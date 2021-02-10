package cn.torna.sdk.param;

import lombok.Getter;
import lombok.Setter;

/**
 * @author tanghc
 */
@Getter
@Setter
public class DocParamReq {

    /** 字段名称 */
    private String name;

    /** 字段类型  */
    private String type;

    /** 是否必须，1：是，0：否 */
    private Byte required;

    /** 最大长度 */
    private String maxLength;

    /** 示例值 */
    private String example;

    /** 描述 */
    private String description;

    /** 字典信息，如果有的话  */
    private EnumInfoParam enumInfo;

    /** 父节点, 没有填空字符串 */
    private String parentId;

}