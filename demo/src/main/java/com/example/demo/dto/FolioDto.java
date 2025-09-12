package com.example.demo.dto;

import lombok.*;
import jakarta.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolioDto {
    private Long id;

    @NotEmpty(message = "이름은 필수 입력 항목입니다.")
    private String name;

    @NotEmpty(message = "자기소개는 필수 입력 항목입니다.")
    private String bio;

    private String profileImg;
    private String skills;

    // DTO 목록 필드
    @Builder.Default
    private List<EducationDto> educations = new ArrayList<>();

    @Builder.Default
    private List<CareerDto> careers = new ArrayList<>();

    // ▼▼▼ 새로 추가: Expertise DTO 목록 ▼▼▼
    @Builder.Default
    private List<ExpertiseDto> expertises = new ArrayList<>();
}