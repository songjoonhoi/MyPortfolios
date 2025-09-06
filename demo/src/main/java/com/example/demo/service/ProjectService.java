package com.example.demo.service;

import com.example.demo.dao.ProjectRepository;
import com.example.demo.dto.ProjectDto;
import com.example.demo.entity.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // 생성자 자동 주입
public class ProjectService {

    private final ProjectRepository projectRepository;

    // 모든 프로젝트 조회
     public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    // ID로 프로젝트 조회
    public ProjectDto getProjectById(Long id){
        return projectRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));
    }

    // Entity -> Dto 변환
    private ProjectDto toDto(Project project){
        return ProjectDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .creator(project.getCreator())
                .description(project.getDescription())
                .coverUrl(project.getCoverUrl())
                .link(project.getLink())
                .likes(project.getLikes())
                .tags(project.getTags())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
