package com.RH.PFA.service;

import com.RH.PFA.entity.Application;
import com.RH.PFA.entity.JobPosting;
import com.RH.PFA.repository.ApplicationRepository;
import com.RH.PFA.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerService {

    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;

    public List<JobPosting> getOpenPostings() {
        return jobPostingRepository.findByStatus("OPEN");
    }

    public JobPosting getPostingById(Long id) {
        return jobPostingRepository.findById(id).orElse(null);
    }

    public Application applyForJob(Application application) {
        return applicationRepository.save(application);
    }

    public List<Application> trackApplications(String email) {
        return applicationRepository.findByEmail(email);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application updateApplicationStatus(Long id, String status, String notes) {
        Application application = applicationRepository.findById(id).orElseThrow();
        application.setStatus(status);
        if (notes != null) {
            application.setNotes(notes);
        }
        return applicationRepository.save(application);
    }

    public JobPosting createJobPosting(JobPosting jobPosting) {
        return jobPostingRepository.save(jobPosting);
    }
}
