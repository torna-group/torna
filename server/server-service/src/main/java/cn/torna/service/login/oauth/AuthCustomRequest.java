package cn.torna.service.login.oauth;

import cn.torna.common.bean.EnvironmentKeys;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import me.zhyd.oauth.cache.AuthStateCache;
import me.zhyd.oauth.config.AuthConfig;
import me.zhyd.oauth.exception.AuthException;
import me.zhyd.oauth.model.AuthCallback;
import me.zhyd.oauth.model.AuthToken;
import me.zhyd.oauth.model.AuthUser;
import me.zhyd.oauth.request.AuthDefaultRequest;
import me.zhyd.oauth.utils.UrlBuilder;
import org.apache.velocity.util.ClassUtils;

@Slf4j
public class AuthCustomRequest extends AuthDefaultRequest {

    private AuthCustomResultParser authCustomResultParser;

    public AuthCustomRequest(AuthConfig config) {
        super(config, AuthCustomSource.CUSTOM);
    }

    public AuthCustomRequest(AuthConfig config, AuthStateCache authStateCache) {
        super(config, AuthCustomSource.CUSTOM, authStateCache);
    }

    @Override
    protected AuthToken getAccessToken(AuthCallback authCallback) {
        String response = doPostAuthorizationCode(authCallback.getCode());
        JSONObject object = JSONObject.parseObject(response);

        this.checkResponse(object);

        return AuthToken.builder()
                .accessToken(object.getString("access_token"))
                .refreshToken(object.getString("refresh_token"))
                .idToken(object.getString("id_token"))
                .tokenType(object.getString("token_type"))
                .scope(object.getString("scope"))
                .build();
    }

    @Override
    protected AuthUser getUserInfo(AuthToken authToken) {
        String response = doGetUserInfo(authToken);
        JSONObject object = JSONObject.parseObject(response);
        this.checkResponse(object);
        this.initAuthCustomResultParser();
        return this.authCustomResultParser.parse(source.toString(), authToken, object);
    }

    private void initAuthCustomResultParser() {
        if (authCustomResultParser == null) {
            String className = EnvironmentKeys.LOGIN_THIRD_PARTY_OAUTH_PARSER_CLASS_NAME.getValue();
            try {
                this.authCustomResultParser = (AuthCustomResultParser) ClassUtils.getNewInstance(className);
            } catch (Exception e) {
                log.error("?????????parser??????, className:{}", className, e);
                throw new AuthException("?????????parser??????");
            }
        }
    }

    private void checkResponse(JSONObject object) {
        // oauth/token ????????????
        if (object.containsKey("error")) {
            throw new AuthException(object.getString("error_description"));
        }
        // user ????????????
        if (object.containsKey("message")) {
            throw new AuthException(object.getString("message"));
        }
    }

    /**
     * ?????????{@code state}???????????????url?????????????????????????????????{@code state}
     *
     * @param state state ??????????????????????????????????????????csrf
     * @return ??????????????????
     * @since 1.11.0
     */
    @Override
    public String authorize(String state) {
        String scope = EnvironmentKeys.LOGIN_THIRD_PARTY_OAUTH_SCOPE.getValue();
        return UrlBuilder.fromBaseUrl(super.authorize(state))
                .queryParam("scope", scope)
                .build();
    }
}