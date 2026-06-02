package com.startup.back.application.controller.response;

import com.startup.back.domain.model.User;

import java.util.List;

public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        List<String> roles
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRoles()
        );
    }
}
