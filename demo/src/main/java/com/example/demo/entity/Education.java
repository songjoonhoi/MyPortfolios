package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String period; // 기간 (예: 20XX.03 - 20XX.02)
    private String title;  // 학교명
    private String subtitle; // 전공 및 학위

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folio_id")
    private Folio folio;
}