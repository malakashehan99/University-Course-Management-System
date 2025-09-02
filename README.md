# **University Course Management System**

A full-stack web app to manage **courses**, **users** (Admin / Faculty / Student), **enrollments**, and **results**.
**Backend:** Spring Boot + MySQL · **Frontend:** React + Vite

> **Start order:** run the **backend** on `:8080` first, then the **frontend** on `:3000`.

---

## **Backend — Local Setup **

**Prereqs:** **JDK 17**, **Maven 3.9+**, **MySQL 8**

### **1) Create database**

```sql
CREATE DATABASE university_db;
```

### **2) Configure** `course-management-backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/university_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=ZGV2LXN1cGVyLXNlY3JldC1rZXktMzItYnl0ZXMtYmFzZTY0IQ==
app.jwt.expiration-ms=3600000

server.port=8080
```

### **3) Run**

```bash
cd course-management-backend
./mvnw spring-boot:run   # or: mvn spring-boot:run
```

**Backend URL:** `http://localhost:8080`

### **Demo Accounts**

|    **Role** | **Email**                             | **Password** |
| ----------: | ------------------------------------- | ------------ |
|   **ADMIN** | [admin@uni.com](mailto:admin@uni.com) | admin123     |
| **FACULTY** | [smith@uni.com](mailto:smith@uni.com) | pass         |
| **STUDENT** | [studA@uni.com](mailto:studA@uni.com) | pass         |

---

## **Frontend — Local Setup **

**Prereqs:** **Node.js 18+ (LTS)**

### **1) API base URL**

Create `course-management-frontend/.env`:

```env
VITE_API=http://localhost:8080
```

### **2) Install & run**

```bash
cd course-management-frontend
npm install
npm run dev
```

**Frontend URL:** `http://localhost:3000`

---

## **API Endpoints**

> Demo build currently allows all endpoints (**permitAll**). `/api/auth/login` still returns a JWT used by the frontend.

### **Authentication**

* **POST** `/api/auth/login` → `{ "token": "…" }`
* **POST** `/api/auth/signup` → `{ fullName, email, password, role }`

### **Users**

* **GET** `/api/users` — list users
* **GET** `/api/users/{id}` — get user
* **PUT** `/api/users/{id}` — update `{ fullName, email, role }`
* **DELETE** `/api/users/{id}` — delete *(blocked if faculty has courses or student has enrollments/results)*

### **Courses**

* **GET** `/api/courses` — list courses
* **GET** `/api/courses/{id}` — get course
* **POST** `/api/courses` — create `{ title, code, capacity, facultyId? }`
* **PUT** `/api/courses/{id}` — update
* **DELETE** `/api/courses/{id}` — delete
* **POST** `/api/courses/{courseId}/assign/{facultyId}` — assign instructor

### **Enrollments**

* **POST** `/api/enrollments` — enroll `{ studentId, courseId }` *(capacity counts only `ENROLLED`)*
* **POST** `/api/enrollments/drop?studentId={id}&courseId={id}` — drop (query params)
* **GET** `/api/enrollments/by-student/{studentId}` — student’s enrollments
* **GET** `/api/enrollments/by-course/{courseId}` — course enrollments

### **Results**

* **POST** `/api/results` — upload `{ studentId, courseId, marks, grade }`
* **PATCH** `/api/results/{resultId}?marks={num}&grade={str}` — update (either param optional)
* **GET** `/api/results/by-student/{studentId}` — results by student
* **GET** `/api/results/by-course/{courseId}` — results by course

---

## **Website Features** **

### **Login Page**

* Quick-fill for **Admin / Instructor / Student**
* Email + Password with **show/hide** toggle
* Redirects by role: **/admin**, **/faculty**, **/student**
* Inline error on invalid credentials

### **Sign Up Page**

* Create **Student / Faculty / Admin** users
* Fields: **Full Name, Email, Password, Role**
* Success message + link back to login

### **Admin Dashboard**

* **Create Course** (title, code, capacity, optional instructor)
* **List / Edit / Delete** courses
* **Assign Instructor** to a course
* **Users table** (name, email, role) with **Delete**
* Safe-delete rules enforced (faculty with courses; students with enrollments/results)

### **Faculty Dashboard**

* **My Courses** (only those assigned to the logged-in instructor)
* **Enrolled Students** for selected course
* **Results table** (student, marks, grade, result ID)
* **Upload Result** (studentId, marks, grade)
* **Update Result** by `resultId` (marks/grade)

### **Student Dashboard**

* **Browse Courses** (code, title, capacity, instructor)
* **Enroll** in selected course
* **My Enrollments** with status (**ENROLLED / DROPPED**) + **Drop** action
* **My Results** (course, marks, grade)
