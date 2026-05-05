package com.example.firstspringbootapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.firstspringbootapp.model.Borrowing;
import com.example.firstspringbootapp.model.BorrowingStatus;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {

	boolean existsByBookIdAndStatus(Long bookId, BorrowingStatus status);

	@EntityGraph(attributePaths = { "book", "book.category", "book.branch" })
	List<Borrowing> findByUserIdOrderByCreatedAtDesc(Long userId);

	@EntityGraph(attributePaths = { "user", "book", "book.category", "book.branch" })
	List<Borrowing> findAllByOrderByCreatedAtDesc();
}
