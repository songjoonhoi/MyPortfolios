package com.example.demo.service;

import com.example.demo.dao.ProjectRepository;
import com.example.demo.dto.ProjectDetailDto;
import com.example.demo.dto.ProjectDto;
import com.example.demo.entity.Project;
import com.example.demo.entity.ProjectDetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    // 전체 조회
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // 상세 조회
    public ProjectDto getProjectById(Long id){
        return projectRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));
    }

    // 신규 등록
    public Project createProject(ProjectDto dto) {
        Project p = fromDto(dto);
        return projectRepository.save(p);
    }

    // DTO → Entity
    public Project fromDto(ProjectDto dto) {
        Project p = Project.builder()
            .id(dto.getId())
            .title(dto.getTitle())
            .creator(dto.getCreator())
            .description(dto.getDescription())
            .coverUrl(dto.getCoverUrl())
            .link(dto.getLink())
            .likes(dto.getLikes() != 0 ? dto.getLikes() : 0)
            .createdAt(LocalDate.now())
            .tags(dto.getTags())
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
        return p;
    }

    // Entity → DTO
    public ProjectDto toDto(Project p) {
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
            .details(
                p.getDetails().stream()
                 .map(d -> new ProjectDetailDto(
                         d.getId(),
                         d.getTitle(),
                         d.getDescription(),
                         d.getImageUrl()
                 ))
                 .collect(Collectors.toList())
            )
            .build();
    }
}
