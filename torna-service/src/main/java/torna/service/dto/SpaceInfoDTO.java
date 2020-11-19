package torna.service.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author tanghc
 */
@Data
public class SpaceInfoDTO {

    private Long id;

    /** 分组名称, 数据库字段：name */
    private String name;

    /** 创建人, 数据库字段：creator */
    private String creator;

    /** 空间管理员 */
    private List<UserInfoDTO> leaders;

    /**  数据库字段：gmt_create */
    private Date gmtCreate;

}
