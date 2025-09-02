package com.university.course_management.controller;

import com.university.course_management.dto.UserResponse;
import com.university.course_management.dto.UserUpdateRequest;
import com.university.course_management.model.User;
import com.university.course_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UsersController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> all() {
        List<UserResponse> out = userService.listAll().stream()
                .map(UsersController::toDto).toList();
        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> byId(@PathVariable Long id) {
        User u = userService.getById(id);
        return ResponseEntity.ok(toDto(u));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                               @RequestBody @Valid UserUpdateRequest req) {
        User u = userService.update(id, req);
        return ResponseEntity.ok(toDto(u));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static UserResponse toDto(User u) {
        return new UserResponse(u.getUserId(), u.getFullName(), u.getEmail(), u.getRole());
    }
}
