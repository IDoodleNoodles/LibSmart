package com.example.firstspringbootapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.firstspringbootapp.model.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {

	boolean existsByNameIgnoreCase(String name);

	Optional<Branch> findByNameIgnoreCase(String name);
}
