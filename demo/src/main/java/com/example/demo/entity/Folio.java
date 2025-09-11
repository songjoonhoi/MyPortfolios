package com.example.demo.entity;
// 자기소개
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "folios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Folio {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;    //이름
    private String bio;     // 자기소개
    @Column(length = 1000)  // 🔥 길이 제한 확장 (255 → 1000)
    private String profileImg;  // 프로필 사진 경로

    @Lob
    private String skills; // 기술 스택(Json/String으로 저장)
    
}
