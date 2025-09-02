package com.university.course_management.service;

import com.university.course_management.dto.ResultRequest;
import com.university.course_management.model.Result;

import java.util.List;

public interface ResultService {
    Result upload(ResultRequest req);
    Result update(Long resultId, Double marks, String grade);
    List<Result> byStudent(Long studentId);
    List<Result> byCourse(Long courseId);
}
