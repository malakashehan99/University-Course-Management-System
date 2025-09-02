package com.university.course_management.service.impl;

import com.university.course_management.dto.CourseRequest;
import com.university.course_management.exception.BadRequestException;
import com.university.course_management.exception.ResourceNotFoundException;
import com.university.course_management.model.Course;
import com.university.course_management.model.Role;
import com.university.course_management.model.User;
import com.university.course_management.repository.CourseRepository;
import com.university.course_management.repository.UserRepository;
import com.university.course_management.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepo;
    private final UserRepository userRepo;

    @Override
    public Course create(CourseRequest req) {
        if (courseRepo.existsByCode(req.code()))
            throw new BadRequestException("Course code already exists");

        Course course = Course.builder()
                .title(req.title())
                .code(req.code())
                .capacity(req.capacity())
                .build();

        if (req.facultyId() != null) {
            User faculty = userRepo.findById(req.facultyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
            if (faculty.getRole() != Role.FACULTY)
                throw new BadRequestException("Selected user is not a faculty");
            course.setFaculty(faculty);
        }
        return courseRepo.save(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Course> getAll() {
        return courseRepo.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Course getById(Long id) {
        return courseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    @Override
    public Course update(Long id, CourseRequest req) {
        Course existing = getById(id);

        if (!existing.getCode().equals(req.code()) && courseRepo.existsByCode(req.code()))
            throw new BadRequestException("Course code already exists");

        existing.setTitle(req.title());
        existing.setCode(req.code());
        existing.setCapacity(req.capacity());

        if (req.facultyId() != null) {
            User faculty = userRepo.findById(req.facultyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
            if (faculty.getRole() != Role.FACULTY)
                throw new BadRequestException("Selected user is not a faculty");
            existing.setFaculty(faculty);
        } else {
            existing.setFaculty(null);
        }
        return courseRepo.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!courseRepo.existsById(id))
            throw new ResourceNotFoundException("Course not found");
        courseRepo.deleteById(id);
    }

    @Override
    public Course assignFaculty(Long courseId, Long facultyId) {
        Course course = getById(courseId);
        User faculty = userRepo.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
        if (faculty.getRole() != Role.FACULTY)
            throw new BadRequestException("Selected user is not a faculty");
        course.setFaculty(faculty);
        return courseRepo.save(course);
    }
}
