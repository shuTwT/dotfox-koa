export class CacheConstants{
    /**
     * 登录用户 redis key
     */
    public static LOGIN_TOKEN_KEY="login_tokens:"
    /**
     * 验证码 redis key
     */
    public static CAPTCHA_CODE_KEY = "captcha_codes:"
    /** 参数管理 cache key */
    public static SYS_CONFIG_KEY = "sys_config:"
    /** 字典管理 cache key */
    public static SYS_DICT_KEY = "sys_dict:"
    /** 防重提交 redis key */
    public static REPEAT_SUBMIT_KEY = "repeat_submit:"
    /** 限流 redis key */
    public static RATE_LIMIT_KEY = "rate_limit:"
    /** 登录用户密码错误次数 */
    public static PWD_ERR_CNT_KEY = "pwd_err_cnt:"
}