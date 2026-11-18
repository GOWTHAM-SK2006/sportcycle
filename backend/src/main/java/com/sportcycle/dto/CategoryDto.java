package com.sportcycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private Long sportId;
    private String sportName;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private Integer displayOrder;
}

