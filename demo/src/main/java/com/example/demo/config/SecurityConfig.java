package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 비밀번호를 암호화하기 위한 Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 테스트용 임시 사용자 계정 생성 (ID: admin, PW: 1234)
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("1234"))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    // HTTP 요청에 대한 보안 규칙 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // CSS, JS, 이미지, API 등은 모두 허용
                .requestMatchers("/css/**", "/js/**", "/img/**", "/uploads/**", "/api/**").permitAll()
                // H2 콘솔 접근 허용
                .requestMatchers("/h2-console/**").permitAll()
                // 공개 페이지 (홈, 프로젝트 상세, 자기소개)는 모두 허용
                .requestMatchers("/", "/projects/**", "/folio/**").permitAll()
                // '/admin'으로 시작하는 모든 관리자 페이지는 ADMIN 권한 필요
                .requestMatchers("/admin/**", "/admin-list").hasRole("ADMIN")
                // 그 외 모든 요청은 인증(로그인)을 요구
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                // 우리가 만들 로그인 페이지 경로
                .loginPage("/login")
                // 로그인 성공 시 이동할 기본 페이지
                .defaultSuccessUrl("/admin-list", true)
                .permitAll() // 로그인 페이지는 누구나 접근 가능해야 함
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/") // 로그아웃 성공 시 홈으로 이동
                .permitAll()
            )
            // H2 콘솔 사용을 위한 예외 설정
            .csrf(csrf -> csrf
                // H2 콘솔과 모든 API 요청에 대해 CSRF 보호 비활성화
                .ignoringRequestMatchers("/h2-console/**", "/api/**")
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }
}