package com.example.demo.controller;

import com.example.demo.service.FolioService;
import com.example.demo.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;




@Controller
@RequiredArgsConstructor
public class ViewController {
    
    private final ProjectService projectService;
    private final FolioService folioService;

    // 홈(프로젝트 목록)
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("projects", projectService.getAllProjects());
        return "home";
    }
    
    // 프로젝트 상세
    @GetMapping("/projects/{id}")
    public String projectDetail(@PathVariable Long id, Model model) {
        model.addAttribute("project", projectService.getProjectById(id));
        return "detail";
    }

    // 자기소개
    @GetMapping("/folio/{id}")
    public String folio(@PathVariable Long id, Model model) {
        model.addAttribute("folio", folioService.getFolio(id));
        return "folio";
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
