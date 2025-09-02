package com.university.course_management.service;

import com.university.course_management.dto.SignupRequest;
import com.university.course_management.dto.UserUpdateRequest;
import com.university.course_management.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User signup(SignupRequest req);
    Optional<User> findByEmail(String email);
    User getById(Long id);

    List<User> listAll();
    User update(Long id, UserUpdateRequest req);
    void delete(Long id);
}

