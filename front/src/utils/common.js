const DATA_PLACEHOLDER = '$data$'

const COLLECT_TYPE_LIST = ['array', 'list', 'set', 'collection']
const BOOLEAN_TYPES = ['boolean', 'bool']
const NUMBER_TYPES = [
  'byte', 'short', 'int', 'long', 'integer',
  'int8', 'int16', 'int32', 'int64', 'float', 'double', 'number'
]

let isDingTalk = undefined

/**
 * 构建返回结果例子
 * @param params 返回结果定义
 * @returns {{}} 返回json对象
 */
export function create_response_example(params) {
  const responseJson = {}
  for (const row of params) {
    if (row.isDeleted === 1) {
      continue
    }
    let val
    // 如果有子节点
    if (row.children && row.children.length > 0) {
      const childrenValue = create_response_example(row.children)
      // 如果是数组
      if (is_array_type(row.type)) {
        val = [childrenValue]
      } else {
        val = childrenValue
      }
    } else {
      // 单值
      let example = row.example
      const type = row.type
      // 如果没有示例，默认给一个
      if (!example) {
        example = get_default_example(type)
      } else {
        // 解析出数字，布尔，数组示例值
        if (is_number_type(type)) {
          example = parse_number(example)
        } else if (is_boolean_type(type)) {
          example = parse_boolean(example)
        } else if (is_num_array(type, example)) {
          example = parse_num_array(example)
        } else if (is_str_array(type, example)) {
          example = parse_str_array(example)
        }
      }
      val = example
    }
    responseJson[row.name] = val
  }
  return responseJson
}

function get_default_example(type) {
  if (!type) {
    return ''
  }
  const typeLower = type.toLowerCase()
  if (is_number_type(type)) {
    return 0
  }
  if (is_boolean_type(type)) {
    return false
  }
  let example = ''
  switch (typeLower) {
    case 'map':
    case 'hashmap':
    case 'dict':
    case 'dictionary':
    case 'json':
    case 'obj':
    case 'object':
      example = {}
      break
    case 'collection':
    case 'list':
    case 'set':
    case 'arr':
    case 'array':
      example = []
      break
    default:
  }
  return example
}

function parse_number(val) {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

function parse_boolean(val) {
  if (val === undefined) {
    return false
  }
  return val.toString().toLowerCase() === 'true'
}

function is_boolean_type(type) {
  if (!type) {
    return false
  }
  const typeLower = type.toLowerCase()
  for (const booleanType of BOOLEAN_TYPES) {
    if (booleanType === typeLower) {
      return true
    }
  }
  return false
}

function is_number_type(type) {
  if (!type) {
    return false
  }
  const typeLower = type.toLowerCase()
  for (const numberType of NUMBER_TYPES) {
    if (numberType === typeLower) {
      return true
    }
  }
  return false
}

/**
 * 是否数字数组，即数组里面全是数字
 * @param type 类型
 * @param example 值
 * @returns {boolean}
 */
function is_num_array(type, example) {
  if (is_array_string(example)) {
    example = example.substring(1, example.length - 1)
    const arr = example.split(',')
    for (const num of arr) {
      if (isNaN(Number(num))) {
        return false
      }
    }
    return true
  }
  return type === 'num_array'
}

function is_array_string(example) {
  return typeof (example) === 'string' && example.startsWith('[') && example.endsWith(']')
}

function parse_num_array(val) {
  if (!val || val === '[]') {
    return []
  }
  let str = val.toString()
  if (is_array_string(str)) {
    str = str.substring(1, str.length - 1)
  }
  const arr = str.split(/\D+/)
  return arr.map(el => parse_number(el))
}

function is_str_array(type, example) {
  if (is_array_string(example)) {
    example = example.substring(1, example.length - 1)
    const arr = example.split(',')
    for (const num of arr) {
      if (isNaN(Number(num))) {
        return true
      }
    }
    return false
  }
  return type === 'str_array'
}

function parse_str_array(val) {
  if (!val || val === '[]') {
    return []
  }
  let str = val.toString()
  if (is_array_string(str)) {
    str = str.substring(1, str.length - 1)
  }
  const arr = str.split(',')
  return arr.map(el => {
    if (el.startsWith('\"') || el.startsWith('\'')) {
      el = el.substring(1)
    }
    if (el.endsWith('\"') || el.endsWith('\'')) {
      el = el.substring(0, el.length - 1)
    }
    return el
  })
}

function is_array_type(type) {
  if (!type) {
    return false
  }
  type = type.toLowerCase()
  for (const t of COLLECT_TYPE_LIST) {
    if (t === type) {
      return true
    }
  }
  return false
}

export function get_requestUrl(item) {
  let url = item.url
  if (!url) {
    return ''
  }
  if (url.startsWith('/')) {
    url = url.substring(1)
  }
  let baseUrl = item.baseUrl
  if (!baseUrl) {
    return url
  }
  if (baseUrl && baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.length)
  }
  return `${baseUrl}/${url}`
}

export function get_effective_url(baseUrl, url) {
  if (baseUrl && baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.length)
  }
  if (url && url.startsWith('/')) {
    url = url.substring(1)
  }
  return `${baseUrl}/${url}`
}

/**
 * array转tree，必须要有id,parentId属性
 * @param arr 数组
 * @param parentId 父节点id，第一次调用传0
 * @returns {Array} 返回树array
 */
export function convert_tree(arr, parentId) {
  if (!parentId) {
    parentId = ''
  }
  if (!arr) {
    return []
  }
  // arr是返回的数据parentId父id
  const temp = []
  const treeArr = arr
  treeArr.forEach(item => {
    if (item.parentId === parentId) {
      // 递归调用此函数
      item.children = convert_tree(treeArr, item.id)
      temp.push(item)
    }
  })
  return temp
}

export function init_docInfo(data) {
  data.requestParams = convert_tree(data.requestParams)
  data.responseParams = convert_tree(data.responseParams)
  return data
}

export function init_docInfo_view(data) {
  if (data.isUseGlobalHeaders) {
    data.headerParams = data.globalHeaders.concat(data.headerParams)
  }
  if (data.isUseGlobalParams) {
    const dataNode = (data.globalParams || [])
      .filter(row => row.example === DATA_PLACEHOLDER)
      .shift()
    if (dataNode) {
      const pid = dataNode.id
      dataNode.example = ''
      data.requestParams.forEach(item => {
        const parentId = item.parentId
        if (!parentId) {
          item.parentId = pid
        }
      })
    }
    data.requestParams = data.globalParams.concat(data.requestParams)
  }
  // 如果使用公共返回参数
  if (data.isUseGlobalReturns) {
    const dataNode = (data.globalReturns || [])
      .filter(row => row.example === DATA_PLACEHOLDER)
      .shift()
    if (dataNode) {
      const pid = dataNode.id
      dataNode.example = ''
      data.responseParams.forEach(item => {
        const parentId = item.parentId
        if (!parentId) {
          item.parentId = pid
        }
      })
    }
    data.responseParams = data.globalReturns.concat(data.responseParams)
  }
  data.requestParams = convert_tree(data.requestParams)
  data.responseParams = convert_tree(data.responseParams)
  return data
}

export function init_docInfo_complete_view(data) {
  if (data.isUseGlobalHeaders) {
    const globalHeaders = data.globalHeaders || []
    data.headerParams = globalHeaders.concat(data.headerParams)
  }
  if (data.isUseGlobalParams) {
    const dataNode = (data.globalParams || [])
      .filter(row => row.example === DATA_PLACEHOLDER)
      .shift()
    // 将公共参数转成tree
    data.globalParams = convert_tree(data.globalParams)
    if (dataNode) {
      const pid = dataNode.id
      dataNode.example = ''
      const requestParams = data.requestParams
      requestParams.forEach(item => {
        const parentId = item.parentId
        if (!parentId) {
          item.parentId = pid
        }
      })
      // 将业务返回放到数据节点中
      dataNode.children = requestParams
      data.requestParams = data.globalParams
    } else {
      data.globalParams = convert_tree(data.globalParams)
      data.requestParams = data.globalParams.concat(data.requestParams)
    }
  }
  if (data.isUseGlobalReturns) {
    const dataNode = (data.globalReturns || [])
      .filter(row => row.example === DATA_PLACEHOLDER)
      .shift()
    if (dataNode) {
      const pid = dataNode.id
      dataNode.example = ''
      const responseParams = data.responseParams
      responseParams.forEach(item => {
        const parentId = item.parentId
        if (!parentId) {
          item.parentId = pid
        }
      })
      // 将业务返回放到数据节点中
      dataNode.children = responseParams
      data.responseParams = data.globalReturns
    }
  }
}

export function StringBuilder(str) {
  this.arr = []
  if (str) {
    this.arr.push(str)
  }
}
StringBuilder.prototype = {
  append(str) {
    this.arr.push(str)
    return this
  },
  toString() {
    return this.arr.join('')
  }
}

export function format_string(pattern, args) {
  let result = pattern
  for (const key in args) {
    const reg = new RegExp('({' + key + '})', 'g')
    result = result.replace(reg, args[key])
  }
  return result
}

/**
 * 下载文本内容
 * @param filename 文件名
 * @param text 文本内容
 */
export function download_text(filename, text) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export function is_ding_talk() {
  if (isDingTalk !== undefined) {
    return isDingTalk
  }
  let ret = false
  if (navigator.userAgent) {
    const userAgent = navigator.userAgent.toLowerCase()
    ret = userAgent.indexOf('ret') > -1
  }
  isDingTalk = ret
  return ret
}

export const style_config = {
  '0': [
    { prop: 'name', label: '名称' },
    { prop: 'required', label: '必须' },
    { prop: 'description', label: '描述' },
    { prop: 'example', label: '示例值' }
  ],
  '1': [
    { prop: 'name', label: '名称' },
    { prop: 'required', label: '必须' },
    { prop: 'description', label: '描述' },
    { prop: 'example', label: '示例值' }
  ],
  '2': [
    { prop: 'name', label: '名称' },
    { prop: 'type', label: '类型' },
    { prop: 'required', label: '必须' },
    { prop: 'maxLength', label: '最大长度' },
    { prop: 'description', label: '描述' },
    { prop: 'example', label: '示例值' }
  ],
  '3': [
    { prop: 'name', label: '名称' },
    { prop: 'type', label: '类型' },
    { prop: 'required', label: '必须' },
    { prop: 'maxLength', label: '最大长度' },
    { prop: 'description', label: '描述' },
    { prop: 'example', label: '示例值' }
  ],
  '4': [
    { prop: 'name', label: '错误码' },
    { prop: 'description', label: '错误描述' },
    { prop: 'example', label: '解决方案' }
  ]
}
