package com.university.course_management.controller;

import com.university.course_management.dto.SignupRequest;
import com.university.course_management.model.User;
import com.university.course_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody @Valid SignupRequest req) {
        return ResponseEntity.ok(userService.signup(req));
    }
}
