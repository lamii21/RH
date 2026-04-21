package com.RH.PFA.controller;

import com.RH.PFA.entity.Document;
import com.RH.PFA.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("employeeId") Long employeeId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {
        try {
            return new ResponseEntity<>(documentService.uploadDocument(employeeId, documentType, file), HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Document>> getEmployeeDocuments(@PathVariable Long employeeId) {
        return ResponseEntity.ok(documentService.getEmployeeDocuments(employeeId));
    }
}
