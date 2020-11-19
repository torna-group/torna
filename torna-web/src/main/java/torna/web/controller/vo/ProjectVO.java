package torna.web.controller.vo;

import lombok.Data;

import java.util.Date;

/**
 * @author tanghc
 */
@Data
public class ProjectVO {

    private Long id;

    /** 项目名称, 数据库字段：name */
    private String name;

    /** 项目描述, 数据库字段：description */
    private String description;

    /** 创建者userid, 数据库字段：creator_id */
    private Long creatorId;

    /** 创建人, 数据库字段：creator */
    private String creator;

    /** 所属空间，space.id, 数据库字段：space_id */
    private Long spaceId;

    /** 是否私有项目，1：是，0：否, 数据库字段：is_private */
    private Byte isPrivate;

    /**  数据库字段：gmt_create */
    private Date gmtCreate;

}
