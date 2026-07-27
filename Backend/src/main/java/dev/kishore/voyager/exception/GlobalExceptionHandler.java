package dev.kishore.voyager.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PlacesServiceException.class)
    public ResponseEntity<?> handlePlacesServiceException(PlacesServiceException ex) {
        log.error("Google Places API error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "success", false,
                "timestamp", LocalDateTime.now().toString(),
                "status", 503,
                "error", "Service Unavailable",
                "message", ex.getMessage() != null ? ex.getMessage() : "Unable to retrieve places for this destination."
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex) {
        log.error("Backend Exception encountered: {}", ex.getMessage(), ex);

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String msg = ex.getMessage() != null ? ex.getMessage() : "An unexpected backend error occurred";

        if (msg.toLowerCase().contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        } else if (msg.toLowerCase().contains("unauthorized") || msg.toLowerCase().contains("access denied")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (msg.toLowerCase().contains("forbidden")) {
            status = HttpStatus.FORBIDDEN;
        } else if (msg.toLowerCase().contains("bad request") || msg.toLowerCase().contains("invalid")) {
            status = HttpStatus.BAD_REQUEST;
        }

        String detailedMessage = msg;
        if (ex.getCause() != null && ex.getCause().getMessage() != null) {
            detailedMessage = detailedMessage + " (Cause: " + ex.getCause().getMessage() + ")";
        }

        return ResponseEntity.status(status).body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", detailedMessage
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Validation failed");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", 400,
                "error", "Bad Request",
                "message", msg
        ));
    }
}
