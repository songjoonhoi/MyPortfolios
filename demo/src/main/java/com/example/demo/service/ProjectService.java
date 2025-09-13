package com.example.demo.service;

import com.example.demo.dao.ProjectRepository;
import com.example.demo.dto.ProjectDetailDto;
import com.example.demo.dto.ProjectDto;
import com.example.demo.entity.Project;
import com.example.demo.entity.ProjectDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // (기존 메서드 생략)
    public Page<ProjectDto> getAllProjects(Pageable pageable){
        Page<Project> projectPage = projectRepository.findAll(pageable);
        return projectPage.map(this::toDto);
    }

    public Page<ProjectDto> searchProjects(String query, Pageable pageable) {
        Page<Project> projectPage = projectRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCreatorContainingIgnoreCase(
            query, query, query, pageable);
        return projectPage.map(this::toDto);
    }

    public ProjectDto getProjectById(Long id){
        return projectRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));
    }

    @Transactional
    public Project createProject(ProjectDto dto) {
        Project p = Project.builder()
                .title(dto.getTitle())
                .creator(dto.getCreator())
                .description(dto.getDescription())
                .coverUrl(dto.getCoverUrl())
                .link(dto.getLink())
                .likes(dto.getLikes() != 0 ? dto.getLikes() : 0)
                .createdAt(LocalDate.now())
                .tags(dto.getTags())
                .introduction(dto.getIntroduction())
                .problem(dto.getProblem())
                .roles(dto.getRoles())
                .result(dto.getResult())
                .build();

        if (dto.getDetails() != null) {
            p.setDetails(
                    dto.getDetails().stream()
                            .map(d -> ProjectDetail.builder()
                                    .title(d.getTitle())
                                    .description(d.getDescription())
                                    .imageUrl(d.getImageUrl())
                                    .project(p)
                                    .build())
                            .collect(Collectors.toList())
            );
        }

        return projectRepository.save(p);
    }

    @Transactional
    public Project updateProject(Long id, ProjectDto dto){
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));

        existing.setTitle(dto.getTitle());
        existing.setCreator(dto.getCreator());
        existing.setDescription(dto.getDescription());
        existing.setCoverUrl(dto.getCoverUrl());
        existing.setLink(dto.getLink());
        existing.setTags(dto.getTags());
        existing.setIntroduction(dto.getIntroduction());
        existing.setProblem(dto.getProblem());
        existing.setRoles(dto.getRoles());
        existing.setResult(dto.getResult());

        existing.getDetails().clear();
        if (dto.getDetails() != null) {
            existing.getDetails().addAll(
                dto.getDetails().stream()
                    .map(d -> ProjectDetail.builder()
                            .title(d.getTitle())
                            .description(d.getDescription())
                            .imageUrl(d.getImageUrl())
                            .project(existing)
                            .build()
                    ).collect(Collectors.toList())
            );
        }

        return projectRepository.save(existing);
    }

    /**
     * [수정] 프로젝트 삭제 시, 연결된 이미지 파일도 함께 삭제하는 기능 추가
     */
    @Transactional
    public void deleteProject(Long id) throws IOException { // IOException을 던질 수 있음을 명시
        // 1. DB에서 프로젝트 정보를 찾습니다. 없으면 RuntimeException 발생 -> 404
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("삭제할 프로젝트를 찾을 수 없습니다. ID: " + id));

        // 2. 삭제할 파일 목록을 수집합니다.
        List<String> filesToDelete = new ArrayList<>();
        if (project.getCoverUrl() != null && !project.getCoverUrl().isEmpty() && project.getCoverUrl().startsWith("/uploads/")) {
            filesToDelete.add(project.getCoverUrl());
        }
        project.getDetails().forEach(detail -> {
            if (detail.getImageUrl() != null && !detail.getImageUrl().isEmpty() && detail.getImageUrl().startsWith("/uploads/")) {
                filesToDelete.add(detail.getImageUrl());
            }
        });

        // 3. 파일 시스템에서 실제 파일을 삭제합니다.
        // 여기서 I/O 오류가 발생하면, catch 되어 Controller로 전달 -> 500
        for (String fileUrl : filesToDelete) {
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(new File("").getAbsolutePath(), uploadDir, filename);
            // deleteIfExists는 파일이 없어도 오류를 내지 않으므로 그대로 사용합니다.
            // 만약 권한 등의 문제로 삭제가 실패하면 IOException이 발생할 수 있습니다.
            Files.deleteIfExists(filePath);
        }

        // 4. 모든 파일이 성공적으로 삭제되었거나, 원래 파일이 없었다면 DB에서 프로젝트를 삭제합니다.
        projectRepository.deleteById(id);
    }

    public ProjectDto toDto(Project p) {
        List<ProjectDetailDto> detailDtos = (p.getDetails() == null)
                ? new java.util.ArrayList<>()
                : p.getDetails().stream()
                        .map(d -> new ProjectDetailDto(
                                d.getId(),
                                d.getTitle(),
                                d.getDescription(),
                                d.getImageUrl()
                        ))
                        .collect(Collectors.toList());

        return ProjectDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .creator(p.getCreator())
                .description(p.getDescription())
                .coverUrl(p.getCoverUrl())
                .link(p.getLink())
                .likes(p.getLikes())
                .createdAt(p.getCreatedAt())
                .tags(p.getTags())
                .introduction(p.getIntroduction())
                .problem(p.getProblem())
                .roles(p.getRoles())
                .result(p.getResult())
                .details(detailDtos)
                .build();
    }
}