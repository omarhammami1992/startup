package com.startup.back.infrastructure.database.mapper;

import com.startup.back.domain.model.User;
import com.startup.back.infrastructure.database.entity.UserEntity;
import com.startup.back.infrastructure.database.entity.UserRoleEntity;

import java.util.List;
import java.util.Optional;

public final class UserEntityMapper {

    private UserEntityMapper() {}

    public static User toDomain(UserEntity entity) {
        List<String> roles = Optional.ofNullable(entity.getRoles())
                .orElse(List.of())
                .stream()
                .map(UserRoleEntity::getName)
                .toList();

        return new User(
                entity.getId(),
                entity.getEmail(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getPhoneNumber(),
                entity.getPassword(),
                entity.isActive(),
                roles
        );
    }

    public static UserEntity toEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .password(user.getHashedPassword())
                .active(user.isActive())
                .build();
    }
}
