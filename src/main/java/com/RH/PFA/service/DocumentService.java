package com.RH.PFA.service;

import com.RH.PFA.entity.Document;
import com.RH.PFA.entity.Employee;
import com.RH.PFA.exception.ResourceNotFoundException;
import com.RH.PFA.repository.DocumentRepository;
import com.RH.PFA.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;
    
    private final String UPLOAD_DIR = "uploads/";

    @Transactional
    public Document uploadDocument(Long employeeId, String documentType, MultipartFile file) throws IOException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Path uploadPath = Paths.get(UPLOAD_DIR);
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

        return documentRepository.save(document);
    }

    public List<Document> getEmployeeDocuments(Long employeeId) {
        return documentRepository.findByEmployeeId(employeeId);
    }
}
