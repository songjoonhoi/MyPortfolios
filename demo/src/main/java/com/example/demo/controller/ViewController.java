package com.example.demo.controller;

import com.example.demo.service.FolioService;
import com.example.demo.service.ProjectService;
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

    // 자기소개 페이지 - 데이터를 모델에 추가
    @GetMapping("/folio/{id}")
    public String folio(@PathVariable Long id, Model model) {
        try {
            // 자기소개 데이터를 모델에 추가하여 Thymeleaf에서 사용할 수 있도록 함
            model.addAttribute("folio", folioService.getFolio(id));
            return "folio";
        } catch (Exception e) {
            // 오류 발생 시 기본 데이터로 처리
            model.addAttribute("folio", folioService.getFolio(1L));
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