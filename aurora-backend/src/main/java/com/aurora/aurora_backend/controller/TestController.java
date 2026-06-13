package com.aurora.aurora_backend.controller;

import com.aurora.aurora_backend.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final CloudinaryService cloudinaryService;

    @GetMapping
    public String test() {
        return "Protected Endpoint";
    }

    @PostMapping("/upload")
    public String upload(
            @RequestParam("file") MultipartFile file)
            throws Exception {

        return cloudinaryService
                .uploadImage(file);
    }
}