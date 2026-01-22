package aib.trademate.global.exception;

/**
 * 재무제표를 찾을 수 없을 때 발생하는 예외
 */
public class StatementNotFoundException extends RuntimeException {

    public StatementNotFoundException(String message) {
        super(message);
    }
}
