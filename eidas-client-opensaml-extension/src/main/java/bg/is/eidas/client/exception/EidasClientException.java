package bg.is.eidas.client.exception;

public class EidasClientException extends RuntimeException {

    public EidasClientException(String message, Throwable cause) {
        super(message, cause);
    }

    public EidasClientException(String message) {
        super(message);
    }

}
