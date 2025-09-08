package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
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

    @Column(length = 1000)
    private String description; // 설명

    private String coverUrl; // 대표 이미지 url

    private String link;    // 외부 링크

    private int likes;     // 좋아요 수

    private LocalDate createdAt; // 생성 날짜

    @ElementCollection
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tags")
    private List<String> tags = new ArrayList<>();

    // ✅ 상세 이미지/정보
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectDetail> details = new ArrayList<>();
}
