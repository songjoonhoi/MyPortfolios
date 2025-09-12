package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerDto {
    private Long id;
    private String period;
    private String title;
    private String subtitle;
}