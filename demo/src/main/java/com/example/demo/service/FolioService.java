package com.example.demo.service;

import com.example.demo.dao.FolioRepository;
import com.example.demo.dto.FolioDto;
import com.example.demo.entity.Folio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FolioService {
    
    private final FolioRepository folioRepository;

    // ID로 자기소개 조회
    public FolioDto getFolio(Long id){
        return folioRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("해당 프로필이 존재하지 않습니다."));
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
}
