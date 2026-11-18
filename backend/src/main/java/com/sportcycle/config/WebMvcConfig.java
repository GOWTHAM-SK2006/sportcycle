package com.sportcycle.config;

import com.sportcycle.controller.RootController;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // Automatically prefix all RestControllers (except RootController) with /api/v1
        configurer.addPathPrefix("/api/v1", c -> c.isAnnotationPresent(RestController.class) && !c.equals(RootController.class));
    }
}
