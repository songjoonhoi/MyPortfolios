package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "careers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String period; // 기간 (예: 20XX.XX - 현재)
    private String title;  // 회사명
    private String subtitle; // 직책

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folio_id")
    private Folio folio;
}