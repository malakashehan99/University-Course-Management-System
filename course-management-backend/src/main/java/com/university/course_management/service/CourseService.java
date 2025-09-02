package com.university.course_management.service;

import com.university.course_management.dto.CourseRequest;
import com.university.course_management.model.Course;

import java.util.List;

public interface CourseService {
    Course create(CourseRequest req);
    List<Course> getAll();
    Course getById(Long id);
    Course update(Long id, CourseRequest req);
    void delete(Long id);
    Course assignFaculty(Long courseId, Long facultyId);
}
