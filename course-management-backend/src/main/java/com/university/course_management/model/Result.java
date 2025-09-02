package com.university.course_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "results",
        uniqueConstraints = @UniqueConstraint(name="uk_student_course_result", columnNames = {"student_id","course_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Result {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Double marks;

    @Column(length = 5)
    private String grade;
}

