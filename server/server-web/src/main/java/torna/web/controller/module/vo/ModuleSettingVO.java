package torna.web.controller.module.vo;

import lombok.Data;

import java.util.List;

/**
 * @author tanghc
 */
@Data
public class ModuleSettingVO {
    private ModuleVO moduleVO;
    private List<ModuleConfigVO> globalHeaders;
    private String allowMethod;
    private String baseUrl;

}