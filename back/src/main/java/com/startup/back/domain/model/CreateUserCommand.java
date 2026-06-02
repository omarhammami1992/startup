package com.startup.back.domain.model;

public record CreateUserCommand(
        String email,
        String rawPassword,
        String firstName,
        String lastName,
        String phoneNumber
) {
}