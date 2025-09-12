package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e) {
        return ResponseEntity.badRequest().body("파일 크기가 너무 큽니다. 10MB 이하로 업로드해주세요.");
    }
    
    // ⭐ 정적 리소스 404 에러를 조용히 처리 (500 -> 404로 변경)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<String> handleNoResourceFound(NoResourceFoundException e) {
        // favicon이나 기타 정적 리소스 404는 조용히 처리
        if (e.getResourcePath().contains("favicon") || 
            e.getResourcePath().contains(".well-known") ||
            e.getResourcePath().contains("devtools")) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        // 로그에 에러 기록
        System.err.println("Unhandled exception: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
    }
}