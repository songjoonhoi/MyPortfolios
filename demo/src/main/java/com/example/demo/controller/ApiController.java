package com.example.demo.controller;

import com.example.demo.dto.FolioDto;
import com.example.demo.dto.ProjectDto;
import com.example.demo.entity.Project;
import com.example.demo.service.FolioService;
import com.example.demo.service.ProjectService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {
    
    private final ProjectService projectService;
    private final FolioService folioService;

    // 전체 프로젝트 조회
    @GetMapping("/portfolios")
    public List<ProjectDto> getAllProjects() {
        return projectService.getAllProjects();
    }

    // 단일 프로젝트 조회
    @GetMapping("/portfolios/{id}")
    public ProjectDto getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    // 프로젝트 등록
    @PostMapping("/portfolios")
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto dto) {
        Project saved = projectService.createProject(dto);
        return ResponseEntity.ok(projectService.toDto(saved));
    }

    // 개인 소개 조회
    @GetMapping("/folios/{id}")
    public FolioDto getFolio(@PathVariable Long id) {
        return folioService.getFolio(id);
    }
}
