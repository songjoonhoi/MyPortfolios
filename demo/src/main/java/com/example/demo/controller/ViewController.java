package com.example.demo.controller;

import com.example.demo.dto.FolioDto;
import com.example.demo.service.FolioService;
import com.example.demo.service.ProjectService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
public class ViewController {
    
    private final ProjectService projectService;
    private final FolioService folioService;

    // 홈(프로젝트 목록)
    @GetMapping("/")
    public String home(Model model) {
        return "home";
    }
    
    // 프로젝트 상세
    @GetMapping("/projects/{id}")
    public String projectDetail(@PathVariable Long id, Model model) {
        try {
            model.addAttribute("project", projectService.getProjectById(id));
            model.addAttribute("folio", folioService.getFolio(1L)); 
            return "detail";
        } catch (Exception e) {
            // 프로젝트를 찾을 수 없는 경우 홈으로 리다이렉트
            return "redirect:/";
        }
    }

    // 자기소개 페이지 - 디버깅 로그 추가
@GetMapping("/folio/{id}")
public String folio(@PathVariable Long id, Model model, HttpServletResponse response) {
    try {
        // 캐시 방지 헤더 추가
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        
        System.out.println("=== Folio Debug Info ===");
        System.out.println("Request ID: " + id);
        
        FolioDto folio = folioService.getFolio(id);
        System.out.println("Folio Name: " + folio.getName());
        System.out.println("Folio Bio: " + folio.getBio());
        System.out.println("Folio ProfileImg: " + folio.getProfileImg());
        System.out.println("Education Count: " + (folio.getEducations() != null ? folio.getEducations().size() : "null"));
        System.out.println("Career Count: " + (folio.getCareers() != null ? folio.getCareers().size() : "null"));
        System.out.println("Expertise Count: " + (folio.getExpertises() != null ? folio.getExpertises().size() : "null"));
        
        model.addAttribute("folio", folio);
        return "folio";
    } catch (Exception e) {
        System.err.println("Folio 로드 오류: " + e.getMessage());
        e.printStackTrace();
        
        // 에러 발생 시 기본 데이터로 폴백
        FolioDto defaultFolio = folioService.getFolio(1L);
        model.addAttribute("folio", defaultFolio);
        return "folio";
    }
}

    // 관리자 등록/수정 
    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/admin-list")
    public String adminList() {
        return "admin-list";
    }

    // 자기소개 관리 페이지
    @GetMapping("/admin/folio")
    public String adminFolio() {
        return "admin-folio";
    }
    
    // 로그인 페이지
    @GetMapping("/login")
    public String login() {
        return "login";
    }
}