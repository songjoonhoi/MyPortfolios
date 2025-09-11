package com.example.demo.controller;

import com.example.demo.dto.FolioDto;
import com.example.demo.dto.ProjectDto;
import com.example.demo.entity.Folio;
import com.example.demo.entity.Project;
import com.example.demo.service.FolioService;
import com.example.demo.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Page<ProjectDto> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        // 페이지 번호, 개수, 정렬 방식(최신순)을 담아 Pageable 객체 생성
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return projectService.getAllProjects(pageable);
    }

    // 단일 프로젝트 조회
    @GetMapping("/portfolios/{id}")
    public ProjectDto getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    // 프로젝트 등록
    @PostMapping("/portfolios")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto dto) {
        Project saved = projectService.createProject(dto);
        return ResponseEntity.ok(projectService.toDto(saved));
    }

    // 프로젝트 수정
    @PutMapping("/portfolios/{id}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto dto) {
        Project updated = projectService.updateProject(id, dto);
        return ResponseEntity.ok(projectService.toDto(updated));
    }
    
    // 프로젝트 삭제
    @DeleteMapping("/portfolios/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    // 개인 소개 조회
    @GetMapping("/folios/{id}")
    public FolioDto getFolio(@PathVariable Long id) {
        return folioService.getFolio(id);
    }

    // 개인 소개 등록 및 수정 통합 API
    @PostMapping("/folios") // PUT 대신 POST 사용
    public ResponseEntity<FolioDto> createOrUpdateFolio(@Valid @RequestBody FolioDto dto) {
        // ID가 1로 고정되도록 DTO를 설정 (자기소개는 항상 1번)
        dto.setId(1L); 
        Folio saved = folioService.createOrUpdateFolio(dto);
        return ResponseEntity.ok(folioService.getFolio(saved.getId()));
    }

    
    
}
