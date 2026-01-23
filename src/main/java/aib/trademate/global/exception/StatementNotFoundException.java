package aib.trademate.global.exception;

/**
 * 재무제표를 찾을 수 없을 때 발생하는 예외
 */
public class StatementNotFoundException extends BusinessException {

    public StatementNotFoundException(String stockCode, int year, int quarter) {
        super(ErrorCode.STATEMENT_NOT_FOUND, 
              String.format("stockCode=%s, year=%d, quarter=%d", stockCode, year, quarter));
    }
}
