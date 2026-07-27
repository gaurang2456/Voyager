package dev.kishore.voyager.exception;

public class PlacesServiceException extends RuntimeException {
    public PlacesServiceException(String message) {
        super(message);
    }

    public PlacesServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
