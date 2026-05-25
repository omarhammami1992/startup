package com.startup.back.domain.port;

import com.startup.back.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    void save(User user);
}
