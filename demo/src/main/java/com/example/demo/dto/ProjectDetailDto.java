package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetailDto {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
}
