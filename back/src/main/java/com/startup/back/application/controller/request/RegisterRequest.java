package com.startup.back.application.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        String firstName,
        String lastName,
        @NotBlank
        @Size(min = 6, max = 30)
        @Pattern(regexp = "^\\+?[0-9 ()-]+$", message = "Invalid phone number")
        String phoneNumber
) {}
