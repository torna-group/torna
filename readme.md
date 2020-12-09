# TODO 

## 空间页面

- 空间信息 1
- 空间成员.查询。登录名，姓名，加入时间 1
- 空间成员.添加 1
- 空间成员.移除 1
- 空间.删除 1



## 项目页面

- 项目信息.查询 1
- 项目信息.修改 1
- 项目.删除 1

- 项目成员.查询 1
- 项目成员.添加 1
- 项目成员.移除 1


- 接口管理.接口预览，错误码 1
- 接口管理.导入swagger文档 1
- 接口管理.导入swagger文档,（记录导入url，方便刷新；标记是否swagger导入字段，可以刷新，doc_config表？）1
- 接口管理.新建模块+模块配置 1
- 接口管理.swagger模块刷新 1
- 接口管理.添加分类 1
- 接口管理.添加接口 1
- 接口管理.文档页展示，改为表格 1
- appKey/secret管理 1
- 模块token管理 1
- 开放接口 1
    - 文档.列表
    - 文档.创建
    - 文档.修改
    - 文档.根据id查询
    - 分类.创建
    - 分类.修改分类名称

- easyopen文档新增maxLength属性 1
- 权限时有时无问题 1
- 接口管理.支持拖动排序 
- 接口管理.修改历史，文件对比
- 枚举字典，新建表维护？1
- 接口请求 1

- doc_info/doc_param/enum_info/enum_item 新增data_id，因为文档推送不会保存id
需要根据字段生成data_id来获取 1

- 推送参数使用树状来表示父子关系，客户端自行组装数据 1
- 文档预览模式 1
- 推送关联枚举
- 联调


- sdk上传到中央仓库
- 域名
- 上线

- 文档导出PDF（优先级低）


## 权限管理

- 空间权限

操作			游客	空间开发者	空间管理员	超级管理员
---------------------------------------------------
浏览空间			1			1			1			1
创建空间			1			1			1			1	
编辑空间									1			1
管理成员									1			1
删除空间									1			1	


- 项目权限

操作					游客	空间开发者	项目管理员		超级管理员
------------------------------------------------------------
创建项目								1			1           1
编辑项目信息							1			1			1
查看项目成员				1			1			1			1
管理项目成员										1			1
管理模块    							1			1			1
管理接口								1			1			1
删除项目											1			1

- 公开项目：空间内的成员都能查看
- 私有项目：只有加入到项目中才能查看

- 空间权限 1
- 项目权限 1

# 工程架构

- Web 层

主要是对访问控制进行转发，各类基本参数校验，或者不复用的业务简单处理等。

- Service 层

相对具体的业务逻辑服务层。

- Manager 层

通用业务处理层，它有如下特征： 1） 对第三方平台封装的层，预处理返回结果及转化异常信息； 2） 对 Service 层通用能力的下沉，如缓存方案、中间件通用处理； 3） 与 DAO 层交互，对多个 DAO 的组合复用。

- DAO 层

数据访问层，与底层 MySQL、Oracle、Hbase 等进行数据交互。

外部接口或第三方平台

包括其它部门 RPC 开放接口，基础平台，其它公司的 HTTP 接口。
