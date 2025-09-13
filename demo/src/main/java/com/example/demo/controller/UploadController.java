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

    // (허용 타입, 확장자, 파일 크기 설정은 기존과 동일)
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".gif", ".webp"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @PostMapping("/images")
    @ResponseBody
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        
        // (파일 유효성 검사 로직은 기존과 동일)
        if (file.isEmpty() || file.getSize() > MAX_FILE_SIZE || !isAllowedContentType(file.getContentType()) || !isAllowedExtension(file.getOriginalFilename())) {
             return ResponseEntity.badRequest().body("파일 규격이 올바르지 않습니다.");
        }

        try {
            // [핵심 수정] 애플리케이션 실행 위치를 기준으로 절대 경로를 생성합니다.
            // new File("").getAbsolutePath()는 프로젝트의 루트 경로를 반환합니다.
            Path uploadPath = Paths.get(new File("").getAbsolutePath(), uploadDir);

            // 해당 경로가 존재하지 않으면 모든 상위 폴더까지 생성합니다.
            Files.createDirectories(uploadPath);

            String fileExtension = getFileExtension(file.getOriginalFilename());
            String safeFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(safeFilename);

            // (파일 중복 방지 및 저장 로직은 기존과 동일)
            while (Files.exists(filePath)) {
                safeFilename = UUID.randomUUID().toString() + fileExtension;
                filePath = uploadPath.resolve(safeFilename);
            }
            file.transferTo(filePath.toFile());

            // (저장 후 검증 로직은 기존과 동일)
             if (!Files.exists(filePath) || Files.size(filePath) != file.getSize()) {
                Files.deleteIfExists(filePath);
                return ResponseEntity.internalServerError().body("파일 저장 중 오류가 발생했습니다.");
            }

            String fileUrl = "/uploads/" + safeFilename;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("업로드 실패: " + e.getMessage());
        }
    }

    // (getFileExtension 및 기타 헬퍼 메서드는 기존과 동일)
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }

    private boolean isAllowedContentType(String contentType) {
        return contentType != null && ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase());
    }

    private boolean isAllowedExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return !extension.isEmpty() && ALLOWED_EXTENSIONS.contains(extension);
    }
    
    // (deleteImage, getUploadStatus 메서드도 동일하게 절대 경로를 사용하도록 수정)
    @DeleteMapping("/images/{filename}")
    @ResponseBody
    public ResponseEntity<String> deleteImage(@PathVariable String filename) {
        try {
            Path uploadPath = Paths.get(new File("").getAbsolutePath(), uploadDir);
            Path filePath = uploadPath.resolve(filename);
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
}