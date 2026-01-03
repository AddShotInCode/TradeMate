package com.trademate.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing // [중요] JPA Auditing 활성화 (이게 없으면 날짜가 null로 들어갑니다)
@SpringBootApplication
public class TradeMateApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradeMateApplication.class, args);
	}

}