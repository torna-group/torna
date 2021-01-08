package torna.common.enums;

/**
 * 模块类型，0：通用配置，1：全局header
 *
 * @author tanghc
 */
public enum ModuleConfigTypeEnum {
    /**
     * 通用配置
     */
    COMMON((byte) 0),
    /**
     * 全局header
     */
    GLOBAL_HEADERS((byte) 1),
    ;

    private final byte type;

    ModuleConfigTypeEnum(byte type) {
        this.type = type;
    }

    public byte getType() {
        return type;
    }
}