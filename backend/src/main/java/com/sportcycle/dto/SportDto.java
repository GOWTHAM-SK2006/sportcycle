package com.sportcycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SportDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String iconUrl;
    private String imageUrl;
    private Integer displayOrder;
    private List<CategoryDto> categories;
}

