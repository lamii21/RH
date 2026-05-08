package com.RH.PFA.controller;

import com.RH.PFA.entity.Application;
import com.RH.PFA.entity.JobPosting;
import com.RH.PFA.service.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    // PUBLIC ENDPOINTS
    
    @GetMapping("/public/careers")
    public ResponseEntity<List<JobPosting>> getOpenJobs() {
        return ResponseEntity.ok(careerService.getOpenPostings());
    }

    @GetMapping("/public/careers/{id}")
    public ResponseEntity<JobPosting> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(careerService.getPostingById(id));
    }

    @PostMapping("/public/careers/{id}/apply")
    public ResponseEntity<Application> apply(@PathVariable Long id, @RequestBody Application application) {
        JobPosting posting = careerService.getPostingById(id);
        application.setJobPosting(posting);
        return ResponseEntity.ok(careerService.applyForJob(application));
    }

    @GetMapping("/public/careers/track")
    public ResponseEntity<List<Application>> track(@RequestParam String email) {
        return ResponseEntity.ok(careerService.trackApplications(email));
    }

    // ADMIN ENDPOINTS

    @GetMapping("/careers/applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getApplications() {
        return ResponseEntity.ok(careerService.getAllApplications());
    }

    @PutMapping("/careers/applications/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(careerService.updateApplicationStatus(id, status, notes));
    }

    @PostMapping("/careers/postings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobPosting> createPosting(@RequestBody JobPosting jobPosting) {
        return ResponseEntity.ok(careerService.createJobPosting(jobPosting));
    }
}
