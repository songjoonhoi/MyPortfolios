package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "folios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Folio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;    //이름
    private String bio;     // 자기소개
    @Column(length = 1000)
    private String profileImg;  // 프로필 사진 경로

    @Lob
    @Column(columnDefinition = "TEXT")
    private String skills; // 기술 스택(Json/String으로 저장)

    // 연관 관계 매핑
    @OneToMany(mappedBy = "folio", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "folio", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Career> careers = new ArrayList<>();

    @OneToMany(mappedBy = "folio", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Expertise> expertises = new ArrayList<>();
}