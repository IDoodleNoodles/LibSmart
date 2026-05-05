package com.example.firstspringbootapp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.firstspringbootapp.dto.BookSummaryResponse;
import com.example.firstspringbootapp.dto.BorrowingResponse;
import com.example.firstspringbootapp.dto.BranchResponse;
import com.example.firstspringbootapp.dto.CategoryResponse;
import com.example.firstspringbootapp.model.Book;
import com.example.firstspringbootapp.model.BookStatus;
import com.example.firstspringbootapp.model.Borrowing;
import com.example.firstspringbootapp.model.BorrowingStatus;
import com.example.firstspringbootapp.model.User;
import com.example.firstspringbootapp.repository.BookRepository;
import com.example.firstspringbootapp.repository.BorrowingRepository;

@Service
@Transactional
public class BorrowingService {

	private final BorrowingRepository borrowingRepository;
	private final BookService bookService;
	private final UserService userService;
	private final BookRepository bookRepository;

	public BorrowingService(
		BorrowingRepository borrowingRepository,
		BookService bookService,
		UserService userService,
		BookRepository bookRepository
	) {
		this.borrowingRepository = borrowingRepository;
		this.bookService = bookService;
		this.userService = userService;
		this.bookRepository = bookRepository;
	}

	public BorrowingResponse borrowBook(Long userId, Long bookId) {
		User user = userService.getUserEntity(userId);
		Book book = bookService.getBookEntity(bookId);

		if (book.getAvailableQuantity() == null || book.getAvailableQuantity() <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book is currently unavailable");
		}

		book.setAvailableQuantity(book.getAvailableQuantity() - 1);
		book.setStatus(book.getAvailableQuantity() > 0 ? BookStatus.AVAILABLE : BookStatus.UNAVAILABLE);
		bookRepository.save(book);

		Borrowing borrowing = new Borrowing();
		borrowing.setUser(user);
		borrowing.setBook(book);
		borrowing.setBorrowDate(LocalDateTime.now());
		borrowing.setDueDate(LocalDateTime.now().plusDays(7));
		borrowing.setStatus(BorrowingStatus.BORROWED);
		return toResponse(borrowingRepository.save(borrowing));
	}

	public void returnBook(Long currentUserId, boolean isAdmin, Long borrowingId) {
		Borrowing borrowing = borrowingRepository.findById(borrowingId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrowing record not found"));

		if (!isAdmin && !borrowing.getUser().getId().equals(currentUserId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only return your own borrowed books");
		}
		if (borrowing.getStatus() == BorrowingStatus.RETURNED) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book is already returned");
		}

		borrowing.setReturnDate(LocalDateTime.now());
		borrowing.setStatus(BorrowingStatus.RETURNED);
		borrowingRepository.save(borrowing);

		Book book = borrowing.getBook();
		book.setAvailableQuantity(book.getAvailableQuantity() + 1);
		book.setStatus(BookStatus.AVAILABLE);
		bookRepository.save(book);
	}

	public List<BorrowingResponse> getMyBorrowings(Long userId) {
		List<Borrowing> borrowings = borrowingRepository.findByUserIdOrderByCreatedAtDesc(userId);
		return borrowings.stream().map(this::toResponse).toList();
	}

	public List<BorrowingResponse> getAllBorrowings() {
		List<Borrowing> borrowings = borrowingRepository.findAllByOrderByCreatedAtDesc();
		return borrowings.stream().map(this::toResponse).toList();
	}

	private BorrowingResponse toResponse(Borrowing borrowing) {
		Book book = borrowing.getBook();
		CategoryResponse categoryResponse = null;
		if (book.getCategory() != null) {
			categoryResponse = new CategoryResponse(
				book.getCategory().getId(),
				book.getCategory().getName(),
				book.getCategory().getDescription(),
				book.getCategory().getCreatedAt()
			);
		}

		BranchResponse branchResponse = null;
		if (book.getBranch() != null) {
			branchResponse = new BranchResponse(
				book.getBranch().getId(),
				book.getBranch().getName(),
				book.getBranch().getLocation(),
				book.getBranch().getCreatedAt()
			);
		}

		BookSummaryResponse bookSummary = new BookSummaryResponse(
			book.getId(),
			book.getTitle(),
			book.getAuthor(),
			book.getIsbn(),
			null,
			categoryResponse,
			branchResponse
		);

		return new BorrowingResponse(
			borrowing.getId(),
			borrowing.getUser().getId(),
			borrowing.getUser().getUsername(),
			bookSummary,
			borrowing.getBorrowDate(),
			borrowing.getDueDate(),
			borrowing.getReturnDate(),
			borrowing.getStatus(),
			borrowing.getCreatedAt()
		);
	}
}
