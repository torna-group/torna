package torna.dao.entity;

import java.util.Date;

import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 表名：space_user
 * 备注：分组用户关系表
 *
 * @author tanghc
 */
@Table(name = "space_user")
@Data
public class SpaceUser {

	/**  数据库字段：id */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	/** user_info.id, 数据库字段：user_id */
    private Long userId;
    
	/** space.id, 数据库字段：space_id */
    private Long spaceId;
    
	/** 是否组长，1：是，0：否, 数据库字段：is_leader */
    private Byte isLeader;
    
	/**  数据库字段：is_deleted */
    @com.gitee.fastmybatis.core.annotation.LogicDelete
    private Byte isDeleted;
    
	/**  数据库字段：gmt_create */
    private Date gmtCreate;
    
	/**  数据库字段：gmt_modified */
    private Date gmtModified;
    

}