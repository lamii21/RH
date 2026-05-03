package com.RH.PFA.service;

import com.RH.PFA.dto.DocumentDTO;
import com.RH.PFA.entity.Document;
import com.RH.PFA.entity.Employee;
import com.RH.PFA.exception.ResourceNotFoundException;
import com.RH.PFA.repository.DocumentRepository;
import com.RH.PFA.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;
    
    @Value("${document.storage.path:./uploads}")
    private String uploadDir;

    @Transactional
    public DocumentDTO uploadDocument(Long employeeId, String documentType, MultipartFile file) throws IOException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        Document document = Document.builder()
                .employee(employee)
                .fileName(originalFilename)
                .filePath(filePath.toString())
                .documentType(documentType)
                .build();

        return mapToDTO(documentRepository.save(document));
    }

    public List<DocumentDTO> getEmployeeDocuments(Long employeeId) {
        return documentRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DocumentDTO getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        return mapToDTO(document);
    }

    public Resource getDocumentResource(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        
        try {
            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + document.getFileName());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        
        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Failed to delete physical file: {}", document.getFilePath());
        }
        
        documentRepository.delete(document);
    }

    private DocumentDTO mapToDTO(Document doc) {
        return DocumentDTO.builder()
                .id(doc.getId())
                .employeeId(doc.getEmployee().getId())
                .employeeName(doc.getEmployee().getFirstName() + " " + doc.getEmployee().getLastName())
                .fileName(doc.getFileName())
                .documentType(doc.getDocumentType())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}
