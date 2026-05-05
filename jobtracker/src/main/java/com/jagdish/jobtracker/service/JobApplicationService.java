package com.jagdish.jobtracker.service;

import com.jagdish.jobtracker.model.JobApplication;
import com.jagdish.jobtracker.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository repository;

    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    public Optional<JobApplication> getApplicationById(Long id) {
        return repository.findById(id);
    }

    public JobApplication saveApplication(JobApplication application) {
        return repository.save(application);
    }

    public JobApplication updateApplication(Long id, JobApplication updated) {
        updated.setId(id);
        return repository.save(updated);
    }

    public void deleteApplication(Long id) {
        repository.deleteById(id);
    }

    public List<JobApplication> getByStatus(String status) {
        return repository.findByStatus(status);
    }

    public Object getSummary() {
        long total = repository.count();
        long interviews = repository.findByStatus("INTERVIEW").size();
        long offers = repository.findByStatus("OFFER").size();
        long rejected = repository.findByStatus("REJECTED").size();
        long applied = repository.findByStatus("APPLIED").size();

        return new java.util.HashMap<String, Long>() {{
            put("total", total);
            put("applied", applied);
            put("interviews", interviews);
            put("offers", offers);
            put("rejected", rejected);
        }};
    }
}