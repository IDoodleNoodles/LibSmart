package com.example.firstspringbootapp.service;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.firstspringbootapp.dto.BranchRequest;
import com.example.firstspringbootapp.dto.BranchResponse;
import com.example.firstspringbootapp.model.Branch;
import com.example.firstspringbootapp.repository.BookRepository;
import com.example.firstspringbootapp.repository.BranchRepository;

@Service
@Transactional
public class BranchService {

	private final BranchRepository branchRepository;
	private final BookRepository bookRepository;

	public BranchService(BranchRepository branchRepository, BookRepository bookRepository) {
		this.branchRepository = branchRepository;
		this.bookRepository = bookRepository;
	}

	public BranchResponse create(BranchRequest request) {
		String normalizedName = normalize(request.name());
		if (branchRepository.existsByNameIgnoreCase(normalizedName)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Branch name already exists");
		}

		Branch branch = new Branch();
		branch.setName(normalizedName);
		branch.setLocation(normalizeNullable(request.location()));
		return toResponse(branchRepository.save(branch));
	}

	@Transactional(readOnly = true)
	@Cacheable(cacheNames = "branches")
	public List<BranchResponse> getAll() {
		return branchRepository.findAll().stream().map(this::toResponse).toList();
	}

	public BranchResponse update(Long id, BranchRequest request) {
		Branch branch = branchRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Branch not found"));

		String normalizedName = normalize(request.name());
		branchRepository.findByNameIgnoreCase(normalizedName)
			.filter(existing -> !existing.getId().equals(id))
			.ifPresent(existing -> {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Branch name already exists");
			});

		branch.setName(normalizedName);
		branch.setLocation(normalizeNullable(request.location()));
		return toResponse(branchRepository.save(branch));
	}

	public void delete(Long id) {
		if (!branchRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Branch not found");
		}
		if (bookRepository.existsByBranchId(id)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete branch with assigned books");
		}
		branchRepository.deleteById(id);
	}

	public Branch getEntity(Long id) {
		if (id == null) {
			return null;
		}
		return branchRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Branch not found"));
	}

	private BranchResponse toResponse(Branch branch) {
		return new BranchResponse(branch.getId(), branch.getName(), branch.getLocation(), branch.getCreatedAt());
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
