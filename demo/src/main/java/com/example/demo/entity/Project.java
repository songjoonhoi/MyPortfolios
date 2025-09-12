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
    private String title;

    @Column(nullable = false, length = 50)
    private String creator;

    @Column(length = 1000)
    private String description; // 프로젝트 한 줄 요약

    @Column(length = 2000)
    private String coverUrl;

    @Column(length = 500)
    private String link;

    private int likes;

    private LocalDate createdAt;

    @ElementCollection
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tags")
    private List<String> tags = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectDetail> details = new ArrayList<>();

    // 케이스 스터디 필드 추가 
    @Lob
    @Column(columnDefinition = "TEXT")
    private String introduction; // 1. 도입 (Introduction)

    @Lob
    @Column(columnDefinition = "TEXT")
    private String problem; // 2. 문제 정의 (Problem)

    @Lob
    @Column(columnDefinition = "TEXT")
    private String roles; // 3. 역할 및 기여 (Roles & Contribution)

    @Lob
    @Column(columnDefinition = "TEXT")
    private String result; // 4. 결과 및 회고 (Result & Review)
    // ▲▲▲ [신규] 케이스 스터디 필드 추가 ▲▲▲
}