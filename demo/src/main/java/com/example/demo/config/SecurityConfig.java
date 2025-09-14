package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("1234"))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // ▼▼▼ [수정된 핵심 부분] - 일반 사용자가 볼 수 있는 페이지 확대 ▼▼▼
                // 모든 사용자가 볼 수 있는 페이지와 리소스는 전부 허용 (permitAll)
                .requestMatchers("/", "/projects/**", "/folio/**", "/css/**", "/js/**", "/img/**", "/uploads/**").permitAll()
                // 데이터를 조회(GET)하는 API는 전부 허용
                .requestMatchers(HttpMethod.GET, "/api/portfolios/**", "/api/folios/**").permitAll()
                // 관리자 페이지는 'ADMIN' 역할이 반드시 필요
                .requestMatchers("/admin/**", "/admin-list", "/h2-console/**").hasRole("ADMIN")
                // 위에서 지정한 규칙 외의 모든 요청은 로그인해야만 가능
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/admin-list", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            )
            // CSRF 보호를 API와 H2 콘솔에 대해 비활성화 (API 테스트 및 H2 콘솔 사용을 위함)
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/**", "/h2-console/**")
            )
            // H2 콘솔을 iframe 내에서 표시할 수 있도록 허용
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            );

        return http.build();
    }
}