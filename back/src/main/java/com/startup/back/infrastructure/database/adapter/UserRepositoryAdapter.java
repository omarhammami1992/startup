package com.startup.back.infrastructure.database.adapter;

import com.startup.back.domain.model.User;
import com.startup.back.domain.port.UserRepositoryPort;
import com.startup.back.infrastructure.database.entity.UserEntity;
import com.startup.back.infrastructure.database.mapper.UserEntityMapper;
import com.startup.back.infrastructure.database.repository.UserJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final UserJpaRepository jpaRepository;

    public UserRepositoryAdapter(UserJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(UserEntityMapper::toDomain);
    }

    @Override
    public void save(User user) {
        UserEntity entity = UserEntityMapper.toEntity(user);
        jpaRepository.save(entity);
    }
}
