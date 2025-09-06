package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;
import java.util.List;

@Data
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
    private List<String> tags;
    private LocalDate createdAt;
}
