package com.jagdish.jobtracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String jobRole;
    private String status; // APPLIED, INTERVIEW, OFFER, REJECTED
    private LocalDate appliedDate;
    private LocalDate deadline;
    private String notes;
    private String jobDescription;
    private Integer matchScore; // AI match score 0-100
    private String matchFeedback; // AI feedback text
}