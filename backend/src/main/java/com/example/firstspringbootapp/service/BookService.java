package com.example.firstspringbootapp.service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.firstspringbootapp.dto.BookResponse;
import com.example.firstspringbootapp.dto.BookUpsertRequest;
import com.example.firstspringbootapp.dto.BranchResponse;
import com.example.firstspringbootapp.dto.CategoryResponse;
import com.example.firstspringbootapp.model.Book;
import com.example.firstspringbootapp.model.BookStatus;
import com.example.firstspringbootapp.model.BorrowingStatus;
import com.example.firstspringbootapp.repository.BookRepository;
import com.example.firstspringbootapp.repository.BorrowingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
@Transactional
public class BookService {

	private final BookRepository bookRepository;
	private final CategoryService categoryService;
	private final BranchService branchService;
	private final BorrowingRepository borrowingRepository;

	public BookService(
		BookRepository bookRepository,
		CategoryService categoryService,
		BranchService branchService,
		BorrowingRepository borrowingRepository
	) {
		this.bookRepository = bookRepository;
		this.categoryService = categoryService;
		this.branchService = branchService;
		this.borrowingRepository = borrowingRepository;
	}

	public BookResponse create(BookUpsertRequest request) {
		validateIsbnForCreate(request.isbn());

		Book book = new Book();
		book.setTitle(normalizeRequired(request.title(), "Title is required"));
		book.setAuthor(normalizeRequired(request.author(), "Author is required"));
		book.setIsbn(normalizeNullable(request.isbn()));
		book.setDescription(normalizeNullable(request.description()));
		book.setCategory(categoryService.getEntity(request.categoryId()));
		book.setBranch(branchService.getEntity(request.branchId()));
		book.setQuantity(request.quantity());
		book.setAvailableQuantity(request.quantity());
		book.setStatus(request.quantity() > 0 ? BookStatus.AVAILABLE : BookStatus.UNAVAILABLE);

		return toResponse(bookRepository.save(book));
	}

	@Transactional(readOnly = true)
	@Cacheable(cacheNames = "books", key = "{#categoryId, #branchId, #status, #search}")
	public List<BookResponse> getAll(Long categoryId, Long branchId, BookStatus status, String search) {
		String normalizedSearch = normalizeNullable(search);
		return bookRepository.findAllByOrderByCreatedAtDesc().stream()
			.filter(book -> categoryId == null || matchesCategory(book, categoryId))
			.filter(book -> branchId == null || matchesBranch(book, branchId))
			.filter(book -> status == null || book.getStatus() == status)
			.filter(book -> normalizedSearch == null || matchesSearch(book, normalizedSearch))
			.map(this::toResponse)
			.toList();
	}

	@Transactional(readOnly = true)
	@Cacheable(cacheNames = "books", key = "{#categoryId, #branchId, #status, #search, #page, #size}")
	public List<BookResponse> getAllPaged(Long categoryId, Long branchId, BookStatus status, String search, int page, int size) {
		String normalizedSearch = normalizeNullable(search);
		Page<Book> p = bookRepository.findAll(PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt")));
		return p.stream()
			.filter(book -> categoryId == null || matchesCategory(book, categoryId))
			.filter(book -> branchId == null || matchesBranch(book, branchId))
			.filter(book -> status == null || book.getStatus() == status)
			.filter(book -> normalizedSearch == null || matchesSearch(book, normalizedSearch))
			.map(this::toResponse)
			.toList();
	}

	@Transactional(readOnly = true)
	@Cacheable(cacheNames = "book", key = "#id")
	public BookResponse getById(Long id) {
		return toResponse(getBookOrThrow(id));
	}

	public BookResponse update(Long id, BookUpsertRequest request) {
		Book book = getBookOrThrow(id);
		validateIsbnForUpdate(request.isbn(), id);

		book.setTitle(normalizeRequired(request.title(), "Title is required"));
		book.setAuthor(normalizeRequired(request.author(), "Author is required"));
		book.setIsbn(normalizeNullable(request.isbn()));
		book.setDescription(normalizeNullable(request.description()));
		book.setCategory(categoryService.getEntity(request.categoryId()));
		book.setBranch(branchService.getEntity(request.branchId()));

		int newQuantity = request.quantity();
		int borrowedCopies = Math.max(0, book.getQuantity() - book.getAvailableQuantity());
		if (newQuantity < borrowedCopies) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity cannot be less than currently borrowed copies");
		}

		book.setQuantity(newQuantity);
		book.setAvailableQuantity(newQuantity - borrowedCopies);
		book.setStatus(book.getAvailableQuantity() > 0 ? BookStatus.AVAILABLE : BookStatus.UNAVAILABLE);

		return toResponse(bookRepository.save(book));
	}

	public void delete(Long id) {
		Book book = getBookOrThrow(id);
		if (borrowingRepository.existsByBookIdAndStatus(book.getId(), BorrowingStatus.BORROWED)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete book with active borrowings");
		}
		bookRepository.delete(book);
	}

	public void uploadCover(Long id, MultipartFile file) {
		Book book = getBookOrThrow(id);
		validateImage(file);
		try {
			book.setCoverImage(file.getBytes());
			bookRepository.save(book);
		} catch (Exception ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to process cover image", ex);
		}
	}

	@Transactional(readOnly = true)
	public ResponseEntity<byte[]> getCover(Long id) {
		Book book = getBookOrThrow(id);
		byte[] cover = book.getCoverImage();
		if (cover == null || cover.length == 0) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book cover not found");
		}

		return ResponseEntity.ok()
			.cacheControl(CacheControl.noCache())
			.contentType(detectImageMediaType(cover))
			.body(cover);
	}

	@Transactional(readOnly = true)
	public Book getBookEntity(Long id) {
		return getBookOrThrow(id);
	}

	private Book getBookOrThrow(Long id) {
		return bookRepository.findWithDetailsById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
	}

	private void validateIsbnForCreate(String isbn) {
		String normalizedIsbn = normalizeNullable(isbn);
		if (normalizedIsbn != null && bookRepository.existsByIsbn(normalizedIsbn)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ISBN already exists");
		}
	}

	private void validateIsbnForUpdate(String isbn, Long currentBookId) {
		String normalizedIsbn = normalizeNullable(isbn);
		if (normalizedIsbn == null) {
			return;
		}
		bookRepository.findByIsbn(normalizedIsbn)
			.filter(existing -> !existing.getId().equals(currentBookId))
			.ifPresent(existing -> {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ISBN already exists");
			});
	}

	private BookResponse toResponse(Book book) {
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

		return new BookResponse(
			book.getId(),
			book.getTitle(),
			book.getAuthor(),
			book.getIsbn(),
			book.getDescription(),
			book.getQuantity(),
			book.getAvailableQuantity(),
			book.getStatus(),
			book.getCreatedAt(),
			book.getCoverImage() != null && book.getCoverImage().length > 0,
			categoryResponse,
			branchResponse
		);
	}

	private void validateImage(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
		}

		String contentType = file.getContentType();
		if (contentType == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPG and PNG images are allowed");
		}

		String normalized = contentType.toLowerCase(Locale.ROOT);
		if (!normalized.equals("image/jpeg") && !normalized.equals("image/jpg") && !normalized.equals("image/png")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPG and PNG images are allowed");
		}
	}

	private MediaType detectImageMediaType(byte[] image) {
		if (image.length >= 4 && image[0] == (byte) 0x89 && image[1] == 0x50 && image[2] == 0x4E && image[3] == 0x47) {
			return MediaType.IMAGE_PNG;
		}
		if (image.length >= 2 && image[0] == (byte) 0xFF && image[1] == (byte) 0xD8) {
			return MediaType.IMAGE_JPEG;
		}
		return MediaType.APPLICATION_OCTET_STREAM;
	}

	private String normalizeRequired(String value, String message) {
		if (value == null || value.trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
		}
		return value.trim();
	}

	private String normalizeNullable(String value) {
		if (value == null) {
			return null;
		}
		String trimmed = value.trim();
		return trimmed.isEmpty() ? null : trimmed;
	}

	private boolean matchesCategory(Book book, Long categoryId) {
		return book.getCategory() != null && Objects.equals(book.getCategory().getId(), categoryId);
	}

	private boolean matchesBranch(Book book, Long branchId) {
		return book.getBranch() != null && Objects.equals(book.getBranch().getId(), branchId);
	}

	private boolean matchesSearch(Book book, String normalizedSearch) {
		String lowerSearch = normalizedSearch.toLowerCase(Locale.ROOT);
		return (book.getTitle() != null && book.getTitle().toLowerCase(Locale.ROOT).contains(lowerSearch))
			|| (book.getAuthor() != null && book.getAuthor().toLowerCase(Locale.ROOT).contains(lowerSearch));
	}
}
