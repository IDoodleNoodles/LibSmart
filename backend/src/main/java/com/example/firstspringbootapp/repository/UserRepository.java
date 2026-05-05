package com.example.firstspringbootapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.firstspringbootapp.dto.UserProfileResponse;
import com.example.firstspringbootapp.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsernameIgnoreCaseOrEmailIgnoreCase(String username, String email);

	Optional<User> findByUsernameIgnoreCase(String username);

	Optional<User> findByEmailIgnoreCase(String email);

	boolean existsByUsernameIgnoreCase(String username);

	boolean existsByEmailIgnoreCase(String email);

	@Query("select new com.example.firstspringbootapp.dto.UserProfileResponse(u.id, u.username, u.email, u.fullName, u.phone, u.address, u.role, u.createdAt, (u.profilePhoto is not null)) from User u")
	List<UserProfileResponse> findAllProfiles();

	@Query("select new com.example.firstspringbootapp.dto.UserProfileResponse(u.id, u.username, u.email, u.fullName, u.phone, u.address, u.role, u.createdAt, (u.profilePhoto is not null)) from User u where u.id = :id")
	Optional<UserProfileResponse> findProfileById(@Param("id") Long id);
}