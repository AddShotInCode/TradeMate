create database trademate;
use trademate;

CREATE TABLE stock (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT '종목 단축코드 (예: 005930)',
    name VARCHAR(100) NOT NULL COMMENT '종목명 (예: 삼성전자)',
    market_type VARCHAR(20) COMMENT '시장구분 (KOSPI, KOSDAQ)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE daily_price (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stock_id BIGINT NOT NULL COMMENT 'Stock 테이블 FK',
    date DATE NOT NULL COMMENT '기준일자 (basDt)',
    open_price BIGINT NOT NULL COMMENT '시가 (mkp)',
    high_price BIGINT NOT NULL COMMENT '고가 (hipr)',
    low_price BIGINT NOT NULL COMMENT '저가 (lopr)',
    close_price BIGINT NOT NULL COMMENT '종가 (clpr)',
    volume BIGINT NOT NULL COMMENT '거래량 (trqu)',
    change_amount BIGINT COMMENT '대비 (vs)',
    change_rate DOUBLE COMMENT '등락률 (fltRt)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (stock_id) REFERENCES stock(id),
    UNIQUE KEY uk_stock_date (stock_id, date) -- 같은 종목의 같은 날짜 데이터 중복 방지
);

CREATE TABLE statement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stock_code VARCHAR(6) NOT NULL COMMENT '종목코드 (예: 005930)',
    fiscal_year INT NOT NULL COMMENT '사업연도 (예: 2024)',
    qtr INT NOT NULL COMMENT '분기 (1, 2, 3, 4)',
    rcept_no VARCHAR(14) NOT NULL COMMENT '보고서코드 (14자리)',
    rcept_dt VARCHAR(8) NOT NULL COMMENT '보고서업로드일 (yyyyMMdd)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_statement_rcept_no (rcept_no) -- 보고서코드는 고유함
);

CREATE TABLE members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '이메일 (로그인 ID)',
    password VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호 (BCrypt)',
    name VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    birthdate DATE NOT NULL COMMENT '생년월일',
    phone VARCHAR(20) COMMENT '전화번호 (선택)',
    role VARCHAR(20) DEFAULT 'USER' COMMENT '권한 (USER, ADMIN)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE refresh_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL UNIQUE COMMENT 'members 테이블 FK',
    token VARCHAR(500) NOT NULL COMMENT 'Refresh Token',
    expiry_date DATETIME NOT NULL COMMENT '만료일시',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE simulation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL COMMENT 'members 테이블 FK',
    stock_code VARCHAR(20) NOT NULL COMMENT '종목코드 (예: 005930)',
    start_date DATE NOT NULL COMMENT '시뮬레이션 시작일',
    end_date DATE COMMENT '시뮬레이션 종료일 (nullable)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_simulation_member (member_id)
);

CREATE TABLE simulation_trade (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    simulation_id BIGINT NOT NULL COMMENT 'simulation 테이블 FK',
    trade_date DATE NOT NULL COMMENT '거래일',
    balance INT NOT NULL COMMENT '거래 전 보유수',
    price INT NOT NULL COMMENT '거래 시점 주가',
    upper_limit INT NOT NULL COMMENT '사용자 설정 상한',
    lower_limit INT NOT NULL COMMENT '사용자 설정 하한',
    trade_type CHAR(1) NOT NULL COMMENT '거래종류 (B: 매수, S: 매도)',
    volume INT NOT NULL COMMENT '거래량',
    comment VARCHAR(100) COMMENT '메모 (최대 100자)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (simulation_id) REFERENCES simulation(id) ON DELETE CASCADE,
    INDEX idx_trade_simulation (simulation_id)
);