package com.startup.back.domain.useCase;

import com.startup.back.domain.exception.EmailAlreadyUsedException;
import com.startup.back.domain.model.CreateUserCommand;
import com.startup.back.domain.model.User;
import com.startup.back.domain.port.PasswordHasherPort;
import com.startup.back.domain.port.UserRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CreateUser {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordHasherPort passwordHasherPort;

    public CreateUser(UserRepositoryPort userRepositoryPort, PasswordHasherPort passwordHasherPort) {
        this.userRepositoryPort = userRepositoryPort;
        this.passwordHasherPort = passwordHasherPort;
    }


    public void execute(CreateUserCommand command) {
        if (userRepositoryPort.existsByEmail(command.email())) {
            throw new EmailAlreadyUsedException(command.email());
        }
        String hashed = passwordHasherPort.hash(command.rawPassword());
        User toCreate = User.createWithoutRole(
                command.email(),
                hashed,
                command.firstName(),
                command.lastName(),
                command.phoneNumber()
        );
        userRepositoryPort.save(toCreate);
    }
}
