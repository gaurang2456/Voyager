package dev.kishore.voyager.service;

import dev.kishore.voyager.entity.Itinerary;
import dev.kishore.voyager.entity.Trip;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@voyager.dev}")
    private String fromEmail;

    @Async("taskExecutor")
    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Voyager - Your AI Travel Companion!");

            String htmlContent = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">"
                    + "<h2 style=\"color: #2563eb;\">Welcome to Voyager, " + (userName != null ? userName : "Explorer") + "!</h2>"
                    + "<p>Thank you for joining Voyager. We are thrilled to help you plan your dream trips with AI-powered itineraries, real-time weather forecasts, and smart expense tracking.</p>"
                    + "<p>Start exploring by creating your first trip today!</p>"
                    + "<br><p>Best regards,<br><strong>The Voyager Team</strong></p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Welcome email successfully sent to {}", toEmail);
        } catch (MessagingException | RuntimeException e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async("taskExecutor")
    public void sendItineraryEmail(String toEmail, String userName, Trip trip, Itinerary itinerary) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Trip Itinerary for " + trip.getDestination() + " is Ready!");

            StringBuilder content = new StringBuilder();
            content.append("<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">");
            content.append("<h2 style=\"color: #2563eb;\">Itinerary for ").append(trip.getDestination()).append("</h2>");
            content.append("<p>Hi ").append(userName != null ? userName : "Traveler").append(",</p>");
            content.append("<p>Your personalized AI itinerary for your trip from <strong>")
                    .append(trip.getStartDate()).append("</strong> to <strong>")
                    .append(trip.getEndDate()).append("</strong> is ready!</p>");

            if (itinerary.getDays() != null && !itinerary.getDays().isEmpty()) {
                content.append("<div style=\"margin-top: 20px;\">");
                for (var day : itinerary.getDays()) {
                    content.append("<div style=\"margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;\">");
                    content.append("<h4 style=\"margin: 0 0 8px 0; color: #1f2937;\">Day ").append(day.getDayNumber());
                    if (day.getDate() != null) {
                        content.append(" - ").append(day.getDate());
                    }
                    content.append("</h4>");

                    if (day.getActivities() != null) {
                        content.append("<ul style=\"margin: 0; padding-left: 20px;\">");
                        for (var activity : day.getActivities()) {
                            content.append("<li style=\"margin-bottom: 4px;\">");
                            if (activity.getTimeSlot() != null) {
                                content.append("<strong>[").append(activity.getTimeSlot()).append("]</strong> ");
                            }
                            content.append(activity.getTitle() != null ? activity.getTitle() : "Activity");
                            if (activity.getDescription() != null) {
                                content.append(" - ").append(activity.getDescription());
                            }
                            content.append("</li>");
                        }
                        content.append("</ul>");
                    }
                    content.append("</div>");
                }
                content.append("</div>");
            }

            content.append("<br><p>Safe travels,<br><strong>The Voyager Team</strong></p>");
            content.append("</div>");

            helper.setText(content.toString(), true);
            mailSender.send(message);
            log.info("Itinerary email successfully sent to {} for trip {}", toEmail, trip.getId());
        } catch (MessagingException | RuntimeException e) {
            log.error("Failed to send itinerary email to {} for trip {}: {}", toEmail, trip.getId(), e.getMessage());
        }
    }
}
