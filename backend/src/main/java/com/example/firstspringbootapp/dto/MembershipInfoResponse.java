package com.example.firstspringbootapp.dto;

import java.time.LocalDateTime;

import com.example.firstspringbootapp.model.MembershipIdRequestStatus;

public record MembershipInfoResponse(
	String membershipId,
	LocalDateTime memberSince,
	MembershipIdRequestStatus membershipIdRequestStatus
) {
}