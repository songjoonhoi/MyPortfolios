package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    // application.properties에서 설정한 상대 경로 (./uploads/)를 가져옵니다.
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        
        // [핵심 수정] 
        // 1. UploadController와 동일한 방식으로 프로젝트의 절대 경로를 찾습니다.
        String projectRoot = new File("").getAbsolutePath();
        
        // 2. 절대 경로와 application.properties의 상대 경로를 조합하여 'uploads' 폴더의 전체 경로를 만듭니다.
        Path uploadPath = Paths.get(projectRoot, uploadDir);

        // 3. Spring이 외부 폴더 경로를 인식할 수 있도록 'file:' 접두사를 붙여줍니다.
        //    - Windows 예시: "file:///C:/Users/USER/Desktop/port/demo/uploads/"
        //    - macOS/Linux 예시: "file:/Users/user/project/demo/uploads/"
        String resourceLocation = uploadPath.toUri().toString();

        // "/uploads/**" 라는 웹 경로로 요청이 오면, 위에서 만든 실제 폴더 위치에서 파일을 찾아 제공하도록 설정합니다.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation)
                .setCachePeriod(3600); // 캐시 기간 1시간

        // 기존의 정적 리소스(CSS, JS 등) 경로는 그대로 유지합니다.
        registry.addResourceHandler("/css/**", "/js/**", "/img/**", "/favicon.ico")
                .addResourceLocations("classpath:/static/css/", "classpath:/static/js/", "classpath:/static/img/", "classpath:/static/")
                .setCachePeriod(3600);
    }
}