package com.jagdish.jobtracker.controller;

import com.jagdish.jobtracker.model.JobApplication;
import com.jagdish.jobtracker.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.jagdish.jobtracker.service.AiMatchService;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    @Autowired
    private JobApplicationService service;
    @Autowired
    private AiMatchService aiMatchService;

    @GetMapping
    public List<JobApplication> getAll() {
        return service.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getById(@PathVariable Long id) {
        return service.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public JobApplication create(@RequestBody JobApplication application) {
        return service.saveApplication(application);
    }

    @PutMapping("/{id}")
    public JobApplication update(@PathVariable Long id, @RequestBody JobApplication application) {
        return service.updateApplication(id, application);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteApplication(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    public List<JobApplication> getByStatus(@PathVariable String status) {
        return service.getByStatus(status);
    }

    @GetMapping("/summary")
    public Object getSummary() {
        return service.getSummary();
    }
    @PostMapping("/analyze-match")
public ResponseEntity<String> analyzeMatch(@RequestBody java.util.Map<String, String> body) {
    try {
        String result = aiMatchService.analyzeMatch(
            body.get("resume"),
            body.get("jobDescription")
        );
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
    }
}
}