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
            return ResponseEntity.internalServerError().build();
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
            return ResponseEntity.noContent().build(); // 성공 시 204
        } catch (RuntimeException e) {
            // RuntimeException (e.g., ID를 못찾는 경우)이 발생하면 로그를 남기고 404를 반환합니다.
            System.err.println("프로젝트 삭제 실패 (ID: " + id + "): " + e.getMessage());
            return ResponseEntity.notFound().build(); // 실패 시 404
        } catch (Exception e) {
            // 그 외 다른 모든 예외(파일 I/O 등)가 발생하면, 전체 오류 내용을 로그에 출력하고 500 서버 에러를 반환합니다.
            System.err.println("프로젝트 삭제 중 서버 오류 발생 (ID: " + id + ")");
            e.printStackTrace(); // <-- 진짜 원인을 보여줄 가장 중요한 부분!
            return ResponseEntity.internalServerError().build(); // 실패 시 500
        }
    }

    @GetMapping("/folios/{id}")
public ResponseEntity<FolioDto> getFolio(@PathVariable Long id) {
    try {
        FolioDto folio = folioService.getFolio(id); // 공개페이지용 (기본값 제공)
        return ResponseEntity.ok(folio);
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}

    @PostMapping("/folios/{id}")
    public ResponseEntity<FolioDto> createOrUpdateFolio(
            @PathVariable Long id,
            @Valid @RequestBody FolioDto dto) {
        try {
            // 항상 ID 1번을 수정하도록 강제
            dto.setId(1L);
            Folio savedFolio = folioService.createOrUpdateFolio(dto);
            return ResponseEntity.ok(folioService.getFolio(savedFolio.getId()));
        } catch (Exception e) {
            // 서버 로그에 에러 기록 (실제 운영 시 중요)
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // ▼▼▼ 새로 추가되는 관리페이지용 API ▼▼▼
@GetMapping("/admin/folios/{id}")
public ResponseEntity<FolioDto> getFolioForAdmin(@PathVariable Long id) {
    try {
        FolioDto folio = folioService.getFolioForAdmin(id); // 관리페이지용 (빈 값 제공)
        return ResponseEntity.ok(folio);
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}

}