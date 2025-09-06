package com.example.demo.controller;

import com.example.demo.dto.FolioDto;
import com.example.demo.dto.ProjectDto;
import com.example.demo.service.FolioService;
import com.example.demo.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api") // 공통 prefix
@RequiredArgsConstructor
public class ApiController {
    
    private final ProjectService projectService;
    private final FolioService folioService;

    // 프로젝트 전제 목록 조회
    @GetMapping("/portfolios")
    public List<ProjectDto> getAllProjects() {
        return projectService.getAllProjects();
    }

    // 프로젝트 상세 조회
    @GetMapping("/portfolios/{id}")
    public ProjectDto getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    // 개인 소개 조회
    @GetMapping("/folios/{id}")
    public FolioDto getFolio(@PathVariable Long id) {
        return folioService.getFolio(id);
    }
    
    
    
}
