package com.example.demo.service;

import com.example.demo.dao.FolioRepository;
import com.example.demo.dto.FolioDto;
import com.example.demo.entity.Folio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FolioService {
    
    private final FolioRepository folioRepository;

    // ID로 자기소개 조회 - 더 안전한 처리
    public FolioDto getFolio(Long id){
        return folioRepository.findById(id)
                .map(this::toDto)
                .orElse(createDefaultFolio()); // 없으면 기본값 반환
    }

    // 기본 자기소개 생성
    private FolioDto createDefaultFolio() {
        return FolioDto.builder()
                .id(1L)
                .name("개발자")
                .bio("안녕하세요! 개발자입니다.")
                .profileImg("https://via.placeholder.com/200x200/365cff/ffffff?text=Profile")
                .skills("Java, Spring Boot")
                .build();
    }

    @Transactional
    public Folio createOrUpdateFolio(FolioDto dto) {
        // DTO를 Entity로 변환
        Folio folio = Folio.builder()
                .id(dto.getId()) // ID가 있으면 update, 없으면 insert
                .name(dto.getName())
                .bio(dto.getBio())
                .skills(dto.getSkills())
                .profileImg(dto.getProfileImg())
                .build();
        
        return folioRepository.save(folio);
    }

    // Entity -> DTO 변환
    private FolioDto toDto(Folio folio){
        return FolioDto.builder()
                .id(folio.getId())
                .name(folio.getName())
                .bio(folio.getBio())
                .profileImg(folio.getProfileImg())
                .skills(folio.getSkills())
                .build();
    }

    // ✅ 추가: 직접 DTO 반환하는 getFolio 메서드
    public FolioDto getFolio(Long id, boolean returnDefault) {
        if (returnDefault) {
            return folioRepository.findById(id)
                    .map(this::toDto)
                    .orElse(createDefaultFolio());
        }
        return getFolio(id);
    }
}