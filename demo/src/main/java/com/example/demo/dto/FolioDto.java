package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolioDto {
    private Long id;
    private String name;
    private String bio;
    private String profileImg;
    private String skills;
}
