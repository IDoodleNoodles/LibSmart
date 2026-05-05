package com.example.firstspringbootapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.firstspringbootapp.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	boolean existsByNameIgnoreCase(String name);

	Optional<Category> findByNameIgnoreCase(String name);
}
