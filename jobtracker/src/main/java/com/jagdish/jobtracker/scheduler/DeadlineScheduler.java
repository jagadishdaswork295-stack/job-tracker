package com.jagdish.jobtracker.scheduler;

import com.jagdish.jobtracker.model.JobApplication;
import com.jagdish.jobtracker.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class DeadlineScheduler {

    @Autowired
    private JobApplicationRepository repository;

    // Runs every day at 9am
    @Scheduled(cron = "0 0 9 * * *")
    public void checkDeadlines() {
        LocalDate threeDaysFromNow = LocalDate.now().plusDays(3);
        List<JobApplication> upcoming = repository.findByDeadlineBefore(threeDaysFromNow);

        for (JobApplication app : upcoming) {
            System.out.println("⚠ DEADLINE ALERT: " + app.getCompanyName()
                + " - " + app.getJobRole()
                + " | Deadline: " + app.getDeadline());
        }
    }
}