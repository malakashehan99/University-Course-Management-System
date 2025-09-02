University Course Management System

A full-stack web app to manage courses, users (Admin/Faculty/Student), enrollments, and results.
Backend: Spring Boot + MySQL · Frontend: React + Vite

Backend — Local Setup (necessary only)

Prereqs: JDK 17, Maven 3.9+, MySQL 8

Create DB

CREATE DATABASE university_db;


Configure course-management-backend/src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/university_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=ZGV2LXN1cGVyLXNlY3JldC1rZXktMzItYnl0ZXMtYmFzZTY0IQ==
app.jwt.expiration-ms=3600000

server.port=8080


Run

cd course-management-backend
./mvnw spring-boot:run   # or: mvn spring-boot:run


Backend: http://localhost:8080

Demo Accounts

Role	Email	Password
ADMIN	admin@uni.com
	admin123
FACULTY	smith@uni.com
	pass
STUDENT	studA@uni.com
	pass
Frontend — Local Setup (necessary only)

Prereqs: Node.js 18+ (LTS)

Configure API URL in course-management-frontend/.env

VITE_API=http://localhost:8080


Install & run

cd course-management-frontend
npm install
npm run dev


Frontend: http://localhost:3000

📡 API Endpoints (backend)
Authentication

POST /api/auth/login — login → { token }

POST /api/auth/signup — register user (ADMIN/FACULTY/STUDENT)

Users

GET /api/users — list users

GET /api/users/{id} — get user

PUT /api/users/{id} — update { fullName, email, role }

DELETE /api/users/{id} — delete (blocked if faculty has courses or student has enrollments/results)

Courses

GET /api/courses — list courses

GET /api/courses/{id} — get course

POST /api/courses — create { title, code, capacity, facultyId? }

PUT /api/courses/{id} — update

DELETE /api/courses/{id} — delete

POST /api/courses/{courseId}/assign/{facultyId} — assign instructor

Enrollments

POST /api/enrollments — enroll { studentId, courseId } (capacity counts only ENROLLED)

POST /api/enrollments/drop?studentId={id}&courseId={id} — drop (query params)

GET /api/enrollments/by-student/{studentId} — student’s enrollments

GET /api/enrollments/by-course/{courseId} — course enrollments

Results

POST /api/results — upload { studentId, courseId, marks, grade }

PATCH /api/results/{resultId}?marks={num}&grade={str} — update (query params; either optional)

GET /api/results/by-student/{studentId} — results by student

GET /api/results/by-course/{courseId} — results by course

Website Features (add screenshots under each section)
Login Page

Quick-fill buttons for Admin / Instructor / Student

Email + password form with show/hide toggle

On success, routes by role: /admin, /faculty, /student

Sign Up Page

Create Student/Faculty/Admin user

Fields: Full Name, Email, Password, Role

Success hint + link back to Login

Admin Dashboard

Create course (title, code, capacity, optional instructor)

List / Edit / Delete courses

Assign instructor to course

List users (name, email, role) and Delete with safe-delete rules

Inline status messages for success/errors

Faculty Dashboard

My Courses (only courses assigned to the logged-in instructor)

Enrolled Students for selected course

Results table (student, marks, grade, result ID)

Upload Result (studentId, marks, grade)

Update Result by resultId (marks/grade)

Student Dashboard

Browse Courses (code, title, capacity, instructor)

Enroll in selected course

My Enrollments with status (ENROLLED/DROPPED) and Drop action

My Results (course, marks, grade)
