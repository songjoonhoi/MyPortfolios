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
    public Page<ProjectDto> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "latest") String sort) {
        
        Sort sortOrder = switch (sort) {
            case "popular" -> Sort.by("likes").descending();
            case "title" -> Sort.by("title").ascending();
            default -> Sort.by("createdAt").descending();
        };
        
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        
        if (search.trim().isEmpty()) {
            return projectService.getAllProjects(pageable);
        } else {
            return projectService.searchProjects(search, pageable);
        }
    }

    @GetMapping("/portfolios/{id}")
    public ProjectDto getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping("/portfolios")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto dto) {
        Project saved = projectService.createProject(dto);
        return ResponseEntity.ok(projectService.toDto(saved));
    }

    @PutMapping("/portfolios/{id}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto dto) {
        Project updated = projectService.updateProject(id, dto);
        return ResponseEntity.ok(projectService.toDto(updated));
    }
    
    @DeleteMapping("/portfolios/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/folios/{id}")
    public FolioDto getFolio(@PathVariable Long id) {
        return folioService.getFolio(id);
    }

    @PostMapping("/folios")
    public ResponseEntity<FolioDto> createOrUpdateFolio(@Valid @RequestBody FolioDto dto) {
        dto.setId(1L); 
        Folio saved = folioService.createOrUpdateFolio(dto);
        return ResponseEntity.ok(folioService.getFolio(saved.getId()));
    }
}