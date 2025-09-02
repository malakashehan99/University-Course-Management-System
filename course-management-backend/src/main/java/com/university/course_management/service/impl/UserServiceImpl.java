package com.university.course_management.service.impl;

import com.university.course_management.dto.SignupRequest;
import com.university.course_management.dto.UserUpdateRequest;
import com.university.course_management.exception.BadRequestException;
import com.university.course_management.exception.ResourceNotFoundException;
import com.university.course_management.model.Role;
import com.university.course_management.model.User;
import com.university.course_management.repository.CourseRepository;
import com.university.course_management.repository.EnrollmentRepository;
import com.university.course_management.repository.ResultRepository;
import com.university.course_management.repository.UserRepository;
import com.university.course_management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    // for safe delete checks:
    private final CourseRepository courseRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final ResultRepository resultRepo;

    @Override
    public User signup(SignupRequest req) {
        if (userRepo.existsByEmail(req.email())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .role(req.role())
                .build();
        return userRepo.save(user);
    }

    @Override @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override @Transactional(readOnly = true)
    public User getById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }


    @Override @Transactional(readOnly = true)
    public List<User> listAll() {
        return userRepo.findAll();
    }


    @Override
    public User update(Long id, UserUpdateRequest req) {
        User existing = getById(id);
        if (!existing.getEmail().equalsIgnoreCase(req.email())
                && userRepo.existsByEmail(req.email())) {
            throw new BadRequestException("Email already registered");
        }
        existing.setFullName(req.fullName());
        existing.setEmail(req.email());
        existing.setRole(req.role());
        return userRepo.save(existing);
    }


    @Override
    public void delete(Long id) {
        User u = getById(id);

        if (u.getRole() == Role.FACULTY) {
            long assignedCourses = courseRepo.countByFaculty(u);
            if (assignedCourses > 0) {
                throw new BadRequestException("Cannot delete faculty: assigned to courses");
            }
        }
        if (u.getRole() == Role.STUDENT) {
            long enr = enrollmentRepo.countByStudent(u);
            long res = resultRepo.countByStudent(u);
            if (enr > 0 || res > 0) {
                throw new BadRequestException("Cannot delete student: has enrollments/results");
            }
        }
        userRepo.deleteById(id);
    }
}

