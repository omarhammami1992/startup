package com.startup.back.domain.port;

public interface PasswordHasherPort {

    String hash(String rawPassword);
}
