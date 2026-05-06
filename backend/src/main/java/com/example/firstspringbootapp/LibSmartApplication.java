package com.example.firstspringbootapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class LibSmartApplication {

	public static void main(String[] args) {
		SpringApplication.run(LibSmartApplication.class, args);
	}

}