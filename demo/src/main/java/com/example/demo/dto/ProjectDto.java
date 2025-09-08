package com.example.demo.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {
    private Long id;
    private String title;
    private String creator;
    private String description;
    private String coverUrl;
    private String link;
    private int likes;
    private LocalDate createdAt;
    private List<String> tags;

    // ✅ 상세 정보 리스트
    private List<ProjectDetailDto> details;
}
