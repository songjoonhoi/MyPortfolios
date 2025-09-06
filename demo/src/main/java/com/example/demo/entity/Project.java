package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title; // 프로젝트 제목

    @Column(nullable = false, length = 50)
    private String creator; // 만든 사람

    @Lob
    private String description; // 설명

    private String coverUrl; // 대표 이미지 url

    private String link;    // 외부 링크

    private int likes;     // 좋아요 수

    @ElementCollection // 별도 테이블로 저장됨
    private List<String> tags; // 태그들

    private LocalDate createdAt; // 생성 날짜
    
}
