package com.startup.back.application.controller;

import com.startup.back.application.controller.response.UserResponse;
import com.startup.back.domain.model.CreateUserCommand;
import com.startup.back.domain.model.User;
import com.startup.back.domain.useCase.CreateUser;
import com.startup.back.domain.model.LoggedUserDetails;
import com.startup.back.application.controller.request.LoginRequest;
import com.startup.back.application.controller.request.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CreateUser createUser;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    private final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();

    public AuthController(CreateUser createUser,AuthenticationManager authenticationManager) {
        this.createUser = createUser;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest body) {
        CreateUserCommand createUserCommand = new CreateUserCommand(
                body.email(),
                body.password(),
                body.firstName(),
                body.lastName(),
                body.phoneNumber()
        );
        createUser.execute(createUserCommand);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest body,
                              HttpServletRequest request,
                              HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.email(), body.password())
        );

        SecurityContext context = securityContextHolderStrategy.createEmptyContext();
        context.setAuthentication(authentication);
        securityContextHolderStrategy.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        LoggedUserDetails principal = (LoggedUserDetails) authentication.getPrincipal();
        return UserResponse.from(principal.getDomainUser());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof LoggedUserDetails principal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = principal.getDomainUser();
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
