package com.example.demo.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {
    private Long id;

    @NotEmpty(message = "제목은 필수 입력 항목입니다.")
    @Size(max = 100, message = "제목은 100자를 초과할 수 없습니다.")
    private String title;

    @NotEmpty(message = "작성자는 필수 입력 항목입니다.")
    @Size(max = 50)
    private String creator;

    @NotEmpty(message = "설명은 필수 입력 항목입니다.")
    @Size(max = 1000)
    private String description;

    private String coverUrl;
    private String link;
    private int likes;
    private LocalDate createdAt;
    private List<String> tags;
    private List<ProjectDetailDto> details;

    // 케이스 스터디 필드 및 유효성 검사 추가
    @NotEmpty(message = "프로젝트 도입부는 필수 입력 항목입니다.")
    private String introduction;

    @NotEmpty(message = "문제 정의는 필수 입력 항목입니다.")
    private String problem;

    @NotEmpty(message = "역할 및 기여는 필수 입력 항목입니다.")
    private String roles;

    @NotEmpty(message = "결과 및 회고는 필수 입력 항목입니다.")
    private String result;
    // ▲▲▲ [신규] 케이스 스터디 필드 및 유효성 검사 추가 ▲▲▲
}