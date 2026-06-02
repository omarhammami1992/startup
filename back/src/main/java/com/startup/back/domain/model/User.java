package com.startup.back.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public final class User {
    private final Long id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String phoneNumber;
    private final String hashedPassword;
    private final boolean active;
    private final List<String> roles;

    public static User createWithoutRole(String email,
                                         String hashedPassword,
                                         String firstName,
                                         String lastName,
                                         String phoneNumber) {
        return new User(null, email, firstName, lastName, phoneNumber, hashedPassword, true, List.of());
    }
}
