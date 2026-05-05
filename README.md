# TrackAI — AI-Powered Job Application Tracker

A full-stack job application tracker with AI-powered resume-JD match scoring, PDF resume parsing, and automated deadline reminders.

## Live Features

- **AI Match Scorer** — Upload your resume (PDF) and paste a job description to get an instant match score, missing skills, and actionable suggestions powered by Groq (Llama 3.3 70B)
- **Job Application Tracker** — Add, update, and delete job applications with status tracking (Applied → Interview → Offer → Rejected)
- **Dashboard Stats** — Real-time counts of total applications, interviews, offers, and rejections
- **Deadline Scheduler** — Spring batch job runs daily at 9AM, logs applications with upcoming deadlines
- **Job URL Fetcher** — Paste a job URL to auto-extract the job description (works on Greenhouse, Lever, Workday, and company career pages)
- **PDF Resume Extraction** — Upload your resume as PDF and the backend extracts the text using Apache PDFBox

## Tech Stack

**Backend**
- Java 17 + Spring Boot 3.5
- Spring Data JPA + Hibernate
- MySQL 8.0
- Apache PDFBox 3.0 (PDF text extraction)
- Spring Scheduler (batch job)
- Groq API — Llama 3.3 70B (AI analysis)

**Frontend**
- React 18 + Vite
- Axios
- CSS (custom, no UI library)

## Project Structure
job-tracker/
├── jobtracker/                        ← Spring Boot backend
│   ├── src/main/java/com/jagdish/jobtracker/
│   │   ├── controller/
│   │   │   ├── JobApplicationController.java   ← CRUD REST endpoints
│   │   │   ├── ResumeController.java           ← PDF extraction endpoint
│   │   │   └── JobFetchController.java         ← Job URL fetch endpoint
│   │   ├── service/
│   │   │   ├── JobApplicationService.java      ← Business logic
│   │   │   └── AiMatchService.java             ← Groq AI integration
│   │   ├── repository/
│   │   │   └── JobApplicationRepository.java   ← JPA data access
│   │   ├── model/
│   │   │   └── JobApplication.java             ← Entity class
│   │   ├── scheduler/
│   │   │   └── DeadlineScheduler.java          ← Daily batch job
│   │   └── JobtrackerApplication.java
│   └── src/main/resources/
│       ├── application.example.properties      ← Template (safe to commit)
│       └── application.properties              ← Your secrets (gitignored)
└── frontend/                          ← React frontend
└── src/
├── App.jsx
├── App.css
└── components/
├── ApplicationList.jsx    ← Dashboard + stats
├── AddApplication.jsx     ← Add new application form
└── AiMatcher.jsx         ← AI resume-JD scorer

## Getting Started

### Prerequisites
- Java 17
- Maven 3.9+
- MySQL 8.0
- Node.js 18+
- Groq API key — free at [console.groq.com](https://console.groq.com)

### Backend Setup

1. Clone the repo
```bash
git clone https://github.com/jagadishdaswork295-stack/TrackAI.git
cd job-tracker/jobtracker
```

2. Create the database
```sql
CREATE DATABASE jobtracker;
```

3. Copy the example properties and fill in your values
```bash
cp src/main/resources/application.example.properties src/main/resources/application.properties
```

4. Edit `application.properties` with your MySQL password and Groq API key
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
groq.api.key=YOUR_GROQ_API_KEY
```

5. Run the backend
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Add new application |
| PUT | `/api/applications/{id}` | Update application |
| DELETE | `/api/applications/{id}` | Delete application |
| GET | `/api/applications/status/{status}` | Filter by status |
| GET | `/api/applications/summary` | Get stats summary |
| POST | `/api/applications/analyze-match` | AI resume-JD match score |
| POST | `/api/resume/extract` | Extract text from PDF resume |
| POST | `/api/job/fetch` | Fetch JD text from job URL |

## AI Match Scorer

Sends your resume and job description to Groq's Llama 3.3 70B and returns structured JSON:

```json
{
  "matchScore": 82,
  "strongMatches": ["Java", "Spring Boot", "REST APIs", "OOP"],
  "missingSkills": ["Docker", "Kubernetes"],
  "suggestions": [
    "Add a project using containerization with Docker",
    "Highlight your OOP design patterns experience"
  ],
  "summary": "Strong backend profile with solid Java foundations. With some additional exposure to DevOps tooling, this candidate would be an excellent fit."
}
```

## How the Batch Scheduler Works

`DeadlineScheduler.java` runs automatically every day at 9AM using Spring's `@Scheduled` annotation:

```java
@Scheduled(cron = "0 0 9 * * *")
public void checkDeadlines() {
    // Flags all applications with deadlines within the next 3 days
}
```

This demonstrates enterprise batch processing — a key requirement in most Java backend JDs.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `spring.datasource.url` | MySQL connection URL |
| `spring.datasource.username` | MySQL username |
| `spring.datasource.password` | MySQL password |
| `groq.api.key` | Groq API key for AI analysis |

## Author

**Jagadish Das**  
MCA — PES University, Bengaluru  
[GitHub](https://github.com/jagadishdaswork295-stack)