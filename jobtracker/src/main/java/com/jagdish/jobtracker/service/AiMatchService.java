package com.jagdish.jobtracker.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.net.URI;
import java.net.http.*;
import org.json.*;

@Service
public class AiMatchService {

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String analyzeMatch(String resumeText, String jobDescription) throws Exception {
        String prompt = """
            You are a resume-JD match analyzer.
            
            Given the resume and job description below, respond ONLY with a valid JSON object in this exact format with no markdown, no backticks, nothing else:
            {
              "matchScore": <number 0-100>,
              "strongMatches": ["skill1", "skill2"],
              "missingSkills": ["skill1", "skill2"],
              "suggestions": ["suggestion1", "suggestion2"],
              "summary": "2-3 sentence honest assessment"
            }
            
            RESUME:
            """ + resumeText + """
            
            JOB DESCRIPTION:
            """ + jobDescription;

        String requestBody = new JSONObject()
            .put("model", "llama-3.3-70b-versatile")
            .put("messages", new JSONArray()
                .put(new JSONObject()
                    .put("role", "user")
                    .put("content", prompt)))
            .put("temperature", 0.3)
            .toString();

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + apiKey)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        JSONObject responseJson = new JSONObject(response.body());
        return responseJson
            .getJSONArray("choices")
            .getJSONObject(0)
            .getJSONObject("message")
            .getString("content");
    }
}