package dev.kishore.voyager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        }

        String detailedMessage = ex.getMessage();
        if (ex.getCause() != null && ex.getCause().getMessage() != null) {
            detailedMessage = detailedMessage + " -> " + ex.getCause().getMessage();
        }

        return ResponseEntity.status(status).body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", detailedMessage
        ));
    }
}
