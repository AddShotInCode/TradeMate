package aib.trademate.global.exception;

/**
 * 종목을 찾을 수 없을 때 발생하는 예외
 */
public class StockNotFoundException extends BusinessException {

    public StockNotFoundException(String stockCode) {
        super(ErrorCode.STOCK_NOT_FOUND, stockCode);
    }
}
