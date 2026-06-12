package com.aurora.aurora_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuroraBackendApplication {

	public static void main(String[] args) {
		java.util.TimeZone.setDefault(
				java.util.TimeZone.getTimeZone("Asia/Kolkata"));
		SpringApplication.run(AuroraBackendApplication.class, args);
	}

}
