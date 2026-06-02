package com.startup.back.domain.useCase;

import com.startup.back.domain.port.UserRepositoryPort;
import com.startup.back.domain.model.LoggedUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class LoginUser implements UserDetailsService {

    private final UserRepositoryPort userRepositoryPort;

    public LoginUser(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepositoryPort.findByEmail(email)
                .map(LoggedUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
