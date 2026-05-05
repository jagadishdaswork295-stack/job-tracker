package com.jagdish.jobtracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.net.http.*;
import java.util.Map;
import java.util.regex.*;

@RestController
@RequestMapping("/api/job")
@CrossOrigin(origins = "http://localhost:5173")
public class JobFetchController {

    @PostMapping("/fetch")
    public ResponseEntity<Map<String, String>> fetchJob(
            @RequestBody Map<String, String> body) {
        String url = body.get("url");
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .header("Accept", "text/html,application/xhtml+xml")
                .GET()
                .build();

            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

            String html = response.body();

            // Strip HTML tags to get plain text
            String text = html
                .replaceAll("<script[^>]*>[\\s\\S]*?</script>", "")
                .replaceAll("<style[^>]*>[\\s\\S]*?</style>", "")
                .replaceAll("<[^>]+>", " ")
                .replaceAll("\\s+", " ")
                .trim();

            // Limit to 3000 chars to avoid overwhelming the AI
            if (text.length() > 3000) text = text.substring(0, 3000);

            if (text.length() < 200) {
                return ResponseEntity.ok(Map.of(
                    "error", "Could not extract content. This site may block automated access (LinkedIn/Indeed). Please paste the JD manually."
                ));
            }

            return ResponseEntity.ok(Map.of("text", text));

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "error", "Could not fetch URL. Please paste the JD manually."
            ));
        }
    }
}