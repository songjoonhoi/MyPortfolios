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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {
    
    private final ProjectService projectService;
    private final FolioService folioService;

    @GetMapping("/portfolios")
    public ResponseEntity<Page<ProjectDto>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "latest") String sort) {
        
        try {
            Sort sortOrder = switch (sort) {
                case "popular" -> Sort.by("likes").descending();
                case "title" -> Sort.by("title").ascending();
                default -> Sort.by("createdAt").descending();
            };
            
            Pageable pageable = PageRequest.of(page, size, sortOrder);
            
            Page<ProjectDto> result;
            if (search.trim().isEmpty()) {
                result = projectService.getAllProjects(pageable);
            } else {
                result = projectService.searchProjects(search, pageable);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // 빈 페이지 반환
            Page<ProjectDto> emptyPage = Page.empty();
            return ResponseEntity.ok(emptyPage);
        }
    }

    @GetMapping("/portfolios/{id}")
    public ResponseEntity<ProjectDto> getProject(@PathVariable Long id) {
        try {
            ProjectDto project = projectService.getProjectById(id);
            return ResponseEntity.ok(project);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/portfolios")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto dto) {
        try {
            Project saved = projectService.createProject(dto);
            return ResponseEntity.ok(projectService.toDto(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/portfolios/{id}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto dto) {
        try {
            Project updated = projectService.updateProject(id, dto);
            return ResponseEntity.ok(projectService.toDto(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/portfolios/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/folios/{id}")
    public ResponseEntity<FolioDto> getFolio(@PathVariable Long id) {
        try {
            FolioDto folio = folioService.getFolio(id);
            return ResponseEntity.ok(folio);
        } catch (Exception e) {
            // 기본 프로필 반환
            FolioDto defaultFolio = FolioDto.builder()
                    .id(1L)
                    .name("개발자")
                    .bio("안녕하세요! 개발자입니다.")
                    .profileImg("https://via.placeholder.com/200x200/365cff/ffffff?text=Profile")
                    .skills("Java, Spring Boot")
                    .build();
            return ResponseEntity.ok(defaultFolio);
        }
    }

    @PostMapping("/folios")
    public ResponseEntity<FolioDto> createOrUpdateFolio(@Valid @RequestBody FolioDto dto) {
        try {
            dto.setId(1L); 
            Folio saved = folioService.createOrUpdateFolio(dto);
            return ResponseEntity.ok(folioService.getFolio(saved.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}