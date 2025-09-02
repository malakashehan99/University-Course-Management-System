package com.university.course_management;

import com.university.course_management.model.Course;
import com.university.course_management.model.Role;
import com.university.course_management.model.User;
import com.university.course_management.repository.CourseRepository;
import com.university.course_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication
public class CourseManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourseManagementApplication.class, args);
	}

	// CourseManagementApplication.java
	@Bean
	CommandLineRunner seed(
			UserRepository users,
			CourseRepository courses,
			PasswordEncoder encoder //  inject encoder
	) {
		return args -> {
			if (users.count() == 0) {
				users.save(User.builder()
						.fullName("Admin One")
						.email("admin@uni.com")
						.password(encoder.encode("admin123"))   //  encode
						.role(Role.ADMIN)
						.build());

				users.save(User.builder()
						.fullName("Dr. Smith")
						.email("smith@uni.com")
						.password(encoder.encode("pass"))        //  encode
						.role(Role.FACULTY)
						.build());

				users.save(User.builder()
						.fullName("Student A")
						.email("studA@uni.com")
						.password(encoder.encode("pass"))        //  encode
						.role(Role.STUDENT)
						.build());
			}

			if (courses.count() == 0) {
				User faculty = users.findByEmail("smith@uni.com").orElseThrow();
				courses.save(Course.builder()
						.title("Data Structures")
						.code("CS201")
						.capacity(40)
						.faculty(faculty)
						.build());
			}
		};
	}


}