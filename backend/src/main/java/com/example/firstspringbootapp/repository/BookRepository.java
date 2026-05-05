package com.example.firstspringbootapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.firstspringbootapp.model.Book;
import com.example.firstspringbootapp.model.BookStatus;

public interface BookRepository extends JpaRepository<Book, Long> {

	@EntityGraph(attributePaths = { "category", "branch" })
	List<Book> findAllByOrderByCreatedAtDesc();

	@EntityGraph(attributePaths = { "category", "branch" })
	Optional<Book> findWithDetailsById(Long id);

	@EntityGraph(attributePaths = { "category", "branch" })
	List<Book> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);

	@EntityGraph(attributePaths = { "category", "branch" })
	List<Book> findByBranchIdOrderByCreatedAtDesc(Long branchId);

	@EntityGraph(attributePaths = { "category", "branch" })
	List<Book> findByStatusOrderByCreatedAtDesc(BookStatus status);

	@EntityGraph(attributePaths = { "category", "branch" })
	List<Book> findByCategoryIdAndBranchIdOrderByCreatedAtDesc(Long categoryId, Long branchId);

	@EntityGraph(attributePaths = { "category", "branch" })
	@Query("""
		SELECT b
		FROM Book b
		LEFT JOIN b.category c
		LEFT JOIN b.branch br
		WHERE (:categoryId IS NULL OR c.id = :categoryId)
		  AND (:branchId IS NULL OR br.id = :branchId)
		  AND (:status IS NULL OR b.status = :status)
		  AND (
			:search IS NULL
			OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
			OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%'))
		  )
		ORDER BY b.createdAt DESC
	""")
	List<Book> findByFilters(
		@Param("categoryId") Long categoryId,
		@Param("branchId") Long branchId,
		@Param("status") BookStatus status,
		@Param("search") String search
	);

	boolean existsByIsbn(String isbn);

	Optional<Book> findByIsbn(String isbn);

	boolean existsByCategoryId(Long categoryId);

	boolean existsByBranchId(Long branchId);
}
