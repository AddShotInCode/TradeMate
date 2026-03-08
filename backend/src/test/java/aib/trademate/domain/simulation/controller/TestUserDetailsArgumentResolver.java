package aib.trademate.domain.simulation.controller;

import org.springframework.core.MethodParameter;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Collections;

/**
 * 테스트용 ArgumentResolver
 * @AuthenticationPrincipal 어노테이션을 처리하여 테스트 사용자를 주입합니다.
 */
public class TestUserDetailsArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String TEST_EMAIL = "test@test.com";

    @Override
    public boolean supportsParameter(@NonNull MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthenticationPrincipal.class) &&
                UserDetails.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(@NonNull MethodParameter parameter,
                                   @Nullable ModelAndViewContainer mavContainer,
                                   @NonNull NativeWebRequest webRequest,
                                   @Nullable WebDataBinderFactory binderFactory) {
        return User.builder()
                .username(TEST_EMAIL)
                .password("password")
                .authorities(Collections.emptyList())
                .build();
    }
}
