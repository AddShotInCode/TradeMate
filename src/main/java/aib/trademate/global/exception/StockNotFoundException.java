package aib.trademate.global.exception;

public class StockNotFoundException extends RuntimeException {
    
    public StockNotFoundException(String stockCode) {
        super("Stock not found: " + stockCode);
    }
}
