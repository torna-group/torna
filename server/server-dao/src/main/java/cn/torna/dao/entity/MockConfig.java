package cn.torna.dao.entity;

import java.util.Date;

import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 表名：mock_config
 * 备注：mock配置
 *
 * @author tanghc
 */
@Table(name = "mock_config")
@Data
public class MockConfig {

    /**  数据库字段：id */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 名称, 数据库字段：name */
    private String name;

    /** md5(docId+query), 数据库字段：data_id */
    private String dataId;

    /** 过滤ip, 数据库字段：ip */
    private String ip;

    /** 请求参数，数组结构, 数据库字段：query_string */
    private String queryString;

    /** http状态, 数据库字段：http_status */
    private Integer httpStatus;

    /** 延迟时间，单位毫秒, 数据库字段：delay_mills */
    private Integer delayMills;

    /** 响应header，数组结构, 数据库字段：response_headers */
    private String responseHeaders;

    /** 响应结果, 数据库字段：response_body */
    private String responseBody;

    /** 文档id, 数据库字段：doc_id */
    private Long docId;

    /** 备注, 数据库字段：remark */
    private String remark;

    /** 创建人id, 数据库字段：creator_id */
    private Long creatorId;

    /** 创建人姓名, 数据库字段：creator_name */
    private String creatorName;

    /** 修改人id, 数据库字段：modifier_id */
    private Long modifierId;

    /** 修改人, 数据库字段：modifier_name */
    private String modifierName;

    /**  数据库字段：is_deleted */
    @com.gitee.fastmybatis.core.annotation.LogicDelete
    private Byte isDeleted;

    /**  数据库字段：gmt_create */
    private Date gmtCreate;

    /**  数据库字段：gmt_modified */
    private Date gmtModified;


}