package com.example.demo.service;

import com.example.demo.dao.ProjectRepository;
import com.example.demo.dto.ProjectDetailDto;
import com.example.demo.dto.ProjectDto;
import com.example.demo.entity.Project;
import com.example.demo.entity.ProjectDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

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
                // ▼▼▼ [수정] 케이스 스터디 필드 매핑 추가 ▼▼▼
                .introduction(dto.getIntroduction())
                .problem(dto.getProblem())
                .roles(dto.getRoles())
                .result(dto.getResult())
                // ▲▲▲ [수정] 케이스 스터디 필드 매핑 추가 ▲▲▲
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

        // ▼▼▼ [수정] 케이스 스터디 필드 업데이트 로직 추가 ▼▼▼
        existing.setIntroduction(dto.getIntroduction());
        existing.setProblem(dto.getProblem());
        existing.setRoles(dto.getRoles());
        existing.setResult(dto.getResult());
        // ▲▲▲ [수정] 케이스 스터디 필드 업데이트 로직 추가 ▲▲▲

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

    @Transactional
    public void deleteProject(Long id){
        if(!projectRepository.existsById(id)){
            throw new RuntimeException("삭제할 프로젝트가 존재하지 않습니다.");
        }
        projectRepository.deleteById(id);
    }

    public ProjectDto toDto(Project p) {
    // [수정된 부분] getDetails()가 null인지 확인하는 로직 추가
    List<ProjectDetailDto> detailDtos = (p.getDetails() == null)
            ? new java.util.ArrayList<>() // getDetails()가 null이면 비어있는 리스트 생성
            : p.getDetails().stream()      // null이 아니면 기존 로직 수행
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
            .details(detailDtos) // 위에서 처리된 안전한 리스트를 사용
            .build();
}
}