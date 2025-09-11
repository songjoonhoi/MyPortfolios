package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/uploads")
public class UploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 허용되는 이미지 타입
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    
    // 허용되는 파일 확장자
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".gif", ".webp"
    );
    
    // 최대 파일 크기 (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @PostMapping("/images")
    @ResponseBody
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        
        // 1. 파일 존재 여부 확인
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어 있습니다.");
        }

        // 2. 파일 크기 검증
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body("파일 크기는 10MB 이하로 업로드해주세요.");
        }

        // 3. 원본 파일명 검증
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("올바른 파일명이 아닙니다.");
        }

        // 4. 파일 확장자 검증
        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            return ResponseEntity.badRequest().body("지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 허용)");
        }

        // 5. MIME 타입 검증
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            return ResponseEntity.badRequest().body("올바른 이미지 파일이 아닙니다.");
        }

        try {
            // 6. 업로드 디렉토리 생성 및 검증
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 7. 안전한 파일명 생성 (UUID + 확장자)
            String safeFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(safeFilename);

            // 8. 파일 중복 방지 (극히 드물지만)
            while (Files.exists(filePath)) {
                safeFilename = UUID.randomUUID().toString() + fileExtension;
                filePath = uploadPath.resolve(safeFilename);
            }

            // 9. 파일 저장
            file.transferTo(filePath.toFile());

            // 10. 파일이 실제로 저장되었는지 확인
            if (!Files.exists(filePath)) {
                return ResponseEntity.internalServerError().body("파일 저장에 실패했습니다.");
            }

            // 11. 저장된 파일 크기 검증 (업로드 과정에서 변조 방지)
            long savedFileSize = Files.size(filePath);
            if (savedFileSize != file.getSize()) {
                // 파일 삭제 후 오류 반환
                Files.deleteIfExists(filePath);
                return ResponseEntity.internalServerError().body("파일 저장 중 오류가 발생했습니다.");
            }

            // 12. 반환할 URL 생성
            String fileUrl = "/uploads/" + safeFilename;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("업로드 실패: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        
        return filename.substring(lastDotIndex);
    }

    /**
     * 업로드된 파일 삭제 (관리자용)
     */
    @DeleteMapping("/images/{filename}")
    @ResponseBody
    public ResponseEntity<String> deleteImage(@PathVariable String filename) {
        try {
            // 파일명 검증 (경로 탐색 공격 방지)
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().body("올바르지 않은 파일명입니다.");
            }

            Path filePath = Paths.get(uploadDir).resolve(filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return ResponseEntity.ok("파일이 삭제되었습니다.");
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("파일 삭제 실패: " + e.getMessage());
        }
    }

    /**
     * 업로드 상태 확인 (디버깅용)
     */
    @GetMapping("/status")
    @ResponseBody
    public ResponseEntity<String> getUploadStatus() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            boolean dirExists = Files.exists(uploadPath);
            boolean isWritable = Files.isWritable(uploadPath);
            
            return ResponseEntity.ok(String.format(
                "Upload Directory: %s\nExists: %s\nWritable: %s", 
                uploadPath.toAbsolutePath(), dirExists, isWritable
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("상태 확인 실패: " + e.getMessage());
        }
    }
}