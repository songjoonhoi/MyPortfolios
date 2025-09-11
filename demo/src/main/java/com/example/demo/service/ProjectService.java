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

    // 전제 조회를 Page<ProjectDto> 반환 타입으로 수정
    public Page<ProjectDto> getAllProjects(Pageable pageable){
        Page<Project> projectPage = projectRepository.findAll(pageable);
        return projectPage.map(this::toDto);
    }

    // 상세 조회
    public ProjectDto getProjectById(Long id){
        return projectRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));
    }
    
    @Transactional
    // 신규 등록
    public Project createProject(ProjectDto dto) {
        // 🔥 수정: dto.getId()가 있어도 무시하고 새로운 엔티티 생성
        Project p = Project.builder()
                .title(dto.getTitle())
                .creator(dto.getCreator())
                .description(dto.getDescription())
                .coverUrl(dto.getCoverUrl())
                .link(dto.getLink())
                .likes(dto.getLikes() != 0 ? dto.getLikes() : 0)
                .createdAt(LocalDate.now())
                .tags(dto.getTags())
                .build();

        // 상세 정보 처리
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

    // 수정
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

        // 상세 정보 갱신 (기존 것 제거 후 새로 저장)
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

    // 삭제 메서드
    @Transactional
    public void deleteProject(Long id){
        if(!projectRepository.existsById(id)){
            throw new RuntimeException("삭제할 프로젝트가 존재하지 않습니다.");
        }
        projectRepository.deleteById(id);
    }

    

    // 🔥 수정된 fromDto 메서드 - 사용하지 않지만 남겨둠
    public Project fromDto(ProjectDto dto) {
        Project p = Project.builder()
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