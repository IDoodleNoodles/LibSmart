package com.example.firstspringbootapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "borrowings", indexes = {
	@Index(name = "idx_borrowings_user_id", columnList = "user_id"),
	@Index(name = "idx_borrowings_book_id", columnList = "book_id"),
	@Index(name = "idx_borrowings_status", columnList = "status"),
	@Index(name = "idx_borrowings_due_date", columnList = "due_date"),
	@Index(name = "idx_borrowings_created_at", columnList = "created_at")
})
public class Borrowing {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "book_id", nullable = false)
	private Book book;

	@Column(name = "borrow_date", nullable = false)
	private LocalDateTime borrowDate;

	@Column(name = "due_date", nullable = false)
	private LocalDateTime dueDate;

	@Column(name = "return_date")
	private LocalDateTime returnDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BorrowingStatus status = BorrowingStatus.BORROWED;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist() {
		if (createdAt == null) {
			createdAt = LocalDateTime.now();
		}
		if (borrowDate == null) {
			borrowDate = LocalDateTime.now();
		}
		if (dueDate == null) {
			dueDate = borrowDate.plusDays(7);
		}
		if (status == null) {
			status = BorrowingStatus.BORROWED;
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public LocalDateTime getBorrowDate() {
		return borrowDate;
	}

	public void setBorrowDate(LocalDateTime borrowDate) {
		this.borrowDate = borrowDate;
	}

	public LocalDateTime getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}

	public LocalDateTime getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(LocalDateTime returnDate) {
		this.returnDate = returnDate;
	}

	public BorrowingStatus getStatus() {
		return status;
	}

	public void setStatus(BorrowingStatus status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
