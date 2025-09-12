package com.example.demo.service;

import com.example.demo.dao.FolioRepository;
import com.example.demo.dto.CareerDto;
import com.example.demo.dto.EducationDto;
import com.example.demo.dto.ExpertiseDto;
import com.example.demo.dto.FolioDto;
import com.example.demo.entity.Career;
import com.example.demo.entity.Education;
import com.example.demo.entity.Expertise;
import com.example.demo.entity.Folio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolioService {

    private final FolioRepository folioRepository;

    // ID로 자기소개 조회 (관리페이지용)
    public FolioDto getFolioForAdmin(Long id){
        return folioRepository.findById(id)
                .map(this::toDto)
                .orElse(createEmptyFolioDto()); // 빈 DTO 반환
    }

    // ID로 자기소개 조회 (공개페이지용)
    public FolioDto getFolio(Long id){
        return folioRepository.findById(id)
                .map(this::toDto)
                .orElse(createDefaultFolioDto()); // 기본 DTO 반환
    }

    // 빈 자기소개 DTO 생성 (관리페이지용)
    private FolioDto createEmptyFolioDto() {
        return FolioDto.builder()
                .id(1L)
                .name("")
                .bio("")
                .profileImg("")
                .skills("")
                .build(); // 빈 리스트는 @Builder.Default로 자동 초기화
    }

    // 기본 자기소개 DTO 생성 (공개페이지용)
    private FolioDto createDefaultFolioDto() {
        List<ExpertiseDto> defaultExpertises = List.of(
            ExpertiseDto.builder().description("AI 기반 시스템 설계 및 개발").build(),
            ExpertiseDto.builder().description("복잡 CRUD 도메인의 동적 모듈").build(),
            ExpertiseDto.builder().description("DevOps 기반 확장 가능한 클라우드 인프라 구축").build()
        );
        
        return FolioDto.builder()
                .id(1L)
                .name("개발자")
                .bio("안녕하세요! 개발자입니다.")
                .profileImg("https://via.placeholder.com/200x200/365cff/ffffff?text=Profile")
                .skills("Java, Spring Boot")
                .expertises(defaultExpertises)
                .build();
    }

    @Transactional
    public Folio createOrUpdateFolio(FolioDto dto) {
        // ID가 1인 Folio를 찾거나, 없으면 새로 생성
        Folio folio = folioRepository.findById(1L).orElseGet(() -> Folio.builder().id(1L).build());

        // DTO의 값으로 Entity 필드 업데이트
        folio.setName(dto.getName());
        folio.setBio(dto.getBio());
        folio.setSkills(dto.getSkills());
        folio.setProfileImg(dto.getProfileImg());

        // 기존 목록들을 비우고 DTO의 새 목록으로 채움
        folio.getEducations().clear();
        if (dto.getEducations() != null) {
            dto.getEducations().forEach(eduDto -> {
                Education edu = Education.builder()
                    .period(eduDto.getPeriod())
                    .title(eduDto.getTitle())
                    .subtitle(eduDto.getSubtitle())
                    .folio(folio)
                    .build();
                folio.getEducations().add(edu);
            });
        }

        folio.getCareers().clear();
        if (dto.getCareers() != null) {
            dto.getCareers().forEach(carDto -> {
                Career car = Career.builder()
                    .period(carDto.getPeriod())
                    .title(carDto.getTitle())
                    .subtitle(carDto.getSubtitle())
                    .folio(folio)
                    .build();
                folio.getCareers().add(car);
            });
        }

        // ▼▼▼ 새로 추가: Expertise 처리 ▼▼▼
        folio.getExpertises().clear();
        if (dto.getExpertises() != null) {
            dto.getExpertises().forEach(expDto -> {
                Expertise exp = Expertise.builder()
                    .description(expDto.getDescription())
                    .folio(folio)
                    .build();
                folio.getExpertises().add(exp);
            });
        }

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
                .educations(folio.getEducations().stream().map(this::toEducationDto).collect(Collectors.toList()))
                .careers(folio.getCareers().stream().map(this::toCareerDto).collect(Collectors.toList()))
                .expertises(folio.getExpertises().stream().map(this::toExpertiseDto).collect(Collectors.toList()))
                .build();
    }

    // Education Entity -> DTO
    private EducationDto toEducationDto(Education education) {
        return EducationDto.builder()
            .id(education.getId())
            .period(education.getPeriod())
            .title(education.getTitle())
            .subtitle(education.getSubtitle())
            .build();
    }

    // Career Entity -> DTO
    private CareerDto toCareerDto(Career career) {
        return CareerDto.builder()
            .id(career.getId())
            .period(career.getPeriod())
            .title(career.getTitle())
            .subtitle(career.getSubtitle())
            .build();
    }

    // ▼▼▼ 새로 추가: Expertise Entity -> DTO ▼▼▼
    private ExpertiseDto toExpertiseDto(Expertise expertise) {
        return ExpertiseDto.builder()
            .id(expertise.getId())
            .description(expertise.getDescription())
            .build();
    }
}