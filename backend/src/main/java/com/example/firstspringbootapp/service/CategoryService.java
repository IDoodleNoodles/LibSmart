package com.example.firstspringbootapp.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.firstspringbootapp.dto.CategoryRequest;
import com.example.firstspringbootapp.dto.CategoryResponse;
import com.example.firstspringbootapp.model.Category;
import com.example.firstspringbootapp.repository.BookRepository;
import com.example.firstspringbootapp.repository.CategoryRepository;

@Service
@Transactional
public class CategoryService {

	private final CategoryRepository categoryRepository;
	private final BookRepository bookRepository;

	public CategoryService(CategoryRepository categoryRepository, BookRepository bookRepository) {
		this.categoryRepository = categoryRepository;
		this.bookRepository = bookRepository;
	}

	public CategoryResponse create(CategoryRequest request) {
		String normalizedName = normalize(request.name());
		if (categoryRepository.existsByNameIgnoreCase(normalizedName)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name already exists");
		}

		Category category = new Category();
		category.setName(normalizedName);
		category.setDescription(normalizeNullable(request.description()));
		return toResponse(categoryRepository.save(category));
	}

	@Transactional(readOnly = true)
	public List<CategoryResponse> getAll() {
		return categoryRepository.findAll().stream().map(this::toResponse).toList();
	}

	public CategoryResponse update(Long id, CategoryRequest request) {
		Category category = categoryRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

		String normalizedName = normalize(request.name());
		categoryRepository.findByNameIgnoreCase(normalizedName)
			.filter(existing -> !existing.getId().equals(id))
			.ifPresent(existing -> {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name already exists");
			});

		category.setName(normalizedName);
		category.setDescription(normalizeNullable(request.description()));
		return toResponse(categoryRepository.save(category));
	}

	public void delete(Long id) {
		if (!categoryRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
		}
		if (bookRepository.existsByCategoryId(id)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete category with assigned books");
		}
		categoryRepository.deleteById(id);
	}

	public Category getEntity(Long id) {
		if (id == null) {
			return null;
		}
		return categoryRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
	}

	private CategoryResponse toResponse(Category category) {
		return new CategoryResponse(category.getId(), category.getName(), category.getDescription(), category.getCreatedAt());
	}

	private String normalize(String value) {
		if (value == null || value.trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
		}
		return value.trim();
	}

	private String normalizeNullable(String value) {
		return value == null ? null : value.trim();
	}
}
