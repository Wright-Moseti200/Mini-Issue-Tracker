# Secure Mini Issue Tracker

A full-stack, secure web application designed to create and manage software/project issues. Built with **React 19** and **TypeScript** on the frontend, **Node.js** and **Express 5** with **Drizzle ORM** on the backend, and a **PostgreSQL** database.

---

## 🚀 Features

- **User Registration & Authentication**: Secure registration with validated inputs, password hashing via `bcrypt`, JWT tokens stored in HTTP-Only, SameSite cookies, and session management.
- **Server-Side Authorization**: Strict data isolation per user. Users can only view, create, update, or delete issues associated with their account (`user_id`).
- **Issue Tracking & Management**:
  - Create issues with Title, Description, Priority (`low`, `medium`, `high`), and Status (`open`, `in_progress`, `closed`).
  - View a dashboard of user issues with real-time text search and status/priority filter dropdowns.
  - View individual issue details.
  - Edit and update existing issues.
  - Delete issues.
- **Toast Notifications**: Interactive toast alerts (`react-toastify`) for user feedback on actions and error messages.
- **Modern Dark UI**: Minimalist, high-contrast dark design system with styled badges, forms, and responsive layouts.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, React Router DOM v7, React Toastify, Context API
- **Backend**: Node.js, Express 5, Drizzle ORM, Drizzle Kit, PostgreSQL (`postgres`)
- **Authentication & Security**: `bcrypt` (password hashing), `jsonwebtoken` (JWT), `cookie-parser`, `cors`, `express-rate-limit`, `express-validator`

---

## 📁 Repository Structure

```
Mini-Issue-Tracker/
├── Client/                     # React Frontend Application
│   ├── src/
│   │   ├── context/
│   │   │   └── ContextProvider.tsx  # Global State & API integration
│   │   ├── pages/
│   │   │   ├── Login.tsx            # Login Page
│   │   │   ├── Register.tsx         # Registration Page
│   │   │   ├── Dashboard.tsx        # Issues Dashboard Page
│   │   │   ├── CreateIssue.tsx      # Create Issue Form Page
│   │   │   └── IssueDetails.tsx     # Issue Details & Edit Page
│   │   ├── ProtectRoute.tsx         # Session Route Guard Component
│   │   ├── App.tsx                  # Main Router setup with ToastContainer
│   │   └── index.css                # Global CSS Design System
│   ├── package.json
│   └── vite.config.ts
├── Server/                     # Express Backend API
│   ├── controller/
│   │   └── usercontroller.js        # Auth & Issue business logic handlers
│   ├── database/
│   │   └── database.js              # PostgreSQL Drizzle database connection
│   ├── middleware/
│   │   ├── authmiddleware.js        # JWT Cookie authentication middleware
│   │   └── validators.js            # express-validator request validation
│   ├── routes/
│   │   └── userRoutes.js            # API Express router endpoints
│   ├── schema/
│   │   ├── userSchema.js            # Drizzle user schema
│   │   └── issuesSchema.js          # Drizzle issues schema
│   ├── index.js                     # Express app server entry point
│   ├── drizzle.config.js            # Drizzle Kit configuration
│   ├── .env.example                 # Example server environment variables
│   └── package.json
├── .env.example                 # Root example environment variables
└── README.md                    # Project Documentation
```

---

## 🔑 Environment Variables (`.env`)

Create a `.env` file in the `Server/` directory based on `.env.example`:

```bash
# Server Configuration
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/postgres
JWT_PAS=your_secure_jwt_secret_key
SALT_ROUNDS=10
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:123@localhost:5432/postgres` |
| `JWT_PAS` | Secret key used to sign JWT authentication tokens | `super_secret_jwt_key` |
| `SALT_ROUNDS` | Salt rounds for bcrypt password hashing | `10` or `11` |

---

## ⚙️ PostgreSQL Database & System Setup Guide

### 🐧 Linux (Ubuntu / Debian)

1. **Install PostgreSQL**:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Start and Enable PostgreSQL Service**:
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Configure User Password & Database**:
   ```bash
   sudo -u postgres psql
   ```
   In the PostgreSQL prompt, set a password for the `postgres` user:
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_password';
   CREATE DATABASE postgres; -- or use existing default 'postgres' database
   \q
   ```

4. **Verify PostgreSQL status**:
   ```bash
   sudo systemctl status postgresql
   ```

---

### 🪟 Windows Setup

1. **Install PostgreSQL**:
   - Option A: Download and run the official installer from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/) (includes pgAdmin 4 and command-line tools).
   - Option B: Install via Chocolatey package manager in PowerShell:
     ```powershell
     choco install postgresql
     ```

2. **Start PostgreSQL Service**:
   - The installer automatically creates a Windows service (`postgresql-x64-15` or similar).
   - To verify/start via PowerShell (Run as Administrator):
     ```powershell
     Get-Service postgresql* | Start-Service
     ```

3. **Set Up Database in Command Prompt / PowerShell**:
   Open Command Prompt and access `psql`:
   ```cmd
   "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
   ```
   Or set the password during installation and use pgAdmin to inspect databases.

4. **Configure Server `.env` for Windows**:
   Set `DATABASE_URL` in `Server/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:your_windows_password@localhost:5432/postgres
   ```

---

### 🍎 macOS Setup

1. **Install PostgreSQL via Homebrew**:
   ```bash
   brew install postgresql@15
   ```

2. **Start PostgreSQL Service**:
   ```bash
   brew services start postgresql@15
   ```

3. **Set Password & Database**:
   ```bash
   psql postgres
   ```
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_password';
   \q
   ```

---

## 🗄️ Database Migrations (Drizzle ORM)

Once PostgreSQL is running and `Server/.env` is configured:

1. **Navigate to the `Server` directory**:
   ```bash
   cd Server
   npm install
   ```

2. **Generate Database Migrations**:
   ```bash
   npm run db:generate
   ```

3. **Apply Migrations to PostgreSQL Database**:
   ```bash
   npm run db:migrate
   ```

---

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
cd Server
node index.js
```
*Backend server will start listening on `http://localhost:3000`.*

### 2. Start the Frontend Application

Open a second terminal window:

```bash
cd Client
npm install
npm run dev
```
*Frontend application will start listening on `http://localhost:5173`.*

---

## 🌐 API Endpoint Documentation

Base URL: `http://localhost:3000/api`

### 🔓 Public Authentication Routes

#### 1. Register User
- **Method**: `POST`
- **URL**: `/api/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "User registered successfully"
  }
  ```

#### 2. Login User
- **Method**: `POST`
- **URL**: `/api/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`200 OK` + Sets `token` HTTP-Only Cookie):
  ```json
  {
    "success": true,
    "message": "Logged in successfully"
  }
  ```

#### 3. Logout User
- **Method**: `POST`
- **URL**: `/api/logout`
- **Auth Required**: No
- **Response** (`200 OK` + Clears Cookie):
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

### 🔒 Protected Issue Routes (Requires Cookie Authentication)

#### 4. Get Current User Profile
- **Method**: `GET`
- **URL**: `/api/me`
- **Auth Required**: Yes (Cookie)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### 5. Get User Issues
- **Method**: `GET`
- **URL**: `/api/issues`
- **Auth Required**: Yes (Cookie)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "userdata": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Fix login crash bug",
        "description": "App crashes when submitting invalid credentials",
        "priority": "high",
        "status": "open",
        "created_at": "2026-09-02T15:00:00.000Z",
        "updated_at": "2026-09-02T15:00:00.000Z"
      }
    ]
  }
  ```

#### 6. Create Issue
- **Method**: `POST`
- **URL**: `/api/issues`
- **Auth Required**: Yes (Cookie)
- **Request Body**:
  ```json
  {
    "title": "Build user profile page",
    "description": "Allow users to view and update profile information",
    "priority": "medium",
    "status": "open"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Issue created successfully"
  }
  ```

#### 7. View Issue Details
- **Method**: `GET`
- **URL**: `/api/issues/:id`
- **Auth Required**: Yes (Cookie)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "issue": {
      "id": 1,
      "user_id": 1,
      "title": "Fix login crash bug",
      "description": "App crashes when submitting invalid credentials",
      "priority": "high",
      "status": "open",
      "created_at": "2026-09-02T15:00:00.000Z",
      "updated_at": "2026-09-02T15:00:00.000Z"
    }
  }
  ```

#### 8. Update Issue
- **Method**: `PUT`
- **URL**: `/api/issues/:id`
- **Auth Required**: Yes (Cookie)
- **Request Body**:
  ```json
  {
    "title": "Fix login crash bug - UPDATED",
    "description": "Resolved null pointer in error handler",
    "priority": "high",
    "status": "closed"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Issue updated successfully",
    "issue": { ... }
  }
  ```

#### 9. Delete Issue
- **Method**: `DELETE`
- **URL**: `/api/issues/:id`
- **Auth Required**: Yes (Cookie)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Issue deleted successfully"
  }
  ```

---

## 🔐 Architecture, Security & Decision Rationale

1. **Authentication (JWT in HTTP-Only Cookies)**:
   - JSON Web Tokens (JWT) are issued upon successful registration or login.
   - Tokens are attached via `httpOnly: true` and `sameSite: "lax"` HTTP cookies.
   - Storing tokens in HTTP-Only cookies prevents JavaScript access on the client, mitigating Cross-Site Scripting (XSS) token theft.

2. **Server-Side Authorization (Data Scoping)**:
   - Every database query for issues (`viewissues`, `viewdetails`, `updateissues`, `deleteissues`) enforces filtering by `and(eq(Issues.id, id), eq(Issues.user_id, userId))`.
   - Users can never view, update, or delete issues belonging to another user.

3. **Password Security (`bcrypt`)**:
   - User passwords are salted and hashed using `bcrypt` prior to storage.
   - Plaintext passwords are never saved or logged.

4. **Request Validation (`express-validator`)**:
   - Dedicated validation middleware sanitizes email format, requires non-empty text fields, and prevents invalid payloads from reaching database handlers.

5. **Secret & Configuration Management**:
   - Sensitive values (`DATABASE_URL`, `JWT_PAS`, `PORT`) are managed strictly through environment variables.
   - `.env` files are excluded from version control via `.gitignore`, while `.env.example` templates document all required keys.
