# Secure Mini Issue Tracker

A full-stack, secure web application for tracking software and project issues. Built with React (TypeScript) on the frontend, Node.js/Express with Drizzle ORM on the backend, and PostgreSQL database.

---

## 🚀 Features

- **User Registration & Authentication**: Secure registration with validated inputs, hashed passwords using `bcrypt`, JWT stored in HTTP-Only cookies, and secure session management.
- **Server-Side Authorization**: Complete ownership enforcement on all issue endpoints. Users can only view, create, update, or delete issues tied to their own account.
- **Issue Management**:
  - Create issues with Title, Description, Priority (`low`, `medium`, `high`), and Status (`open`, `in_progress`, `closed`).
  - View list of authenticated user's issues with search and filter capabilities.
  - View individual issue details.
  - Update issue details and change issue status.
  - Delete issues.
- **Minimalist Green/White/Black Theme**: Modern high-contrast UI designed using a strict green, white, and black palette without gradients.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, React Router DOM v7, Context API
- **Backend**: Node.js, Express 5, Drizzle ORM, PostgreSQL (`postgres`)
- **Authentication & Security**: `bcrypt` password hashing, `jsonwebtoken` (JWT), `express-rate-limit`, `express-validator`

---

## 📁 Frontend Project Structure (`Client/src/pages`)

```
Client/src/
├── context/
│   └── ContextProvider.tsx     # Context API with all API functions & user/issue state
├── pages/
│   ├── Register.tsx            # User Registration page
│   ├── Login.tsx               # User Sign-In page
│   ├── Dashboard.tsx           # Main Issues List & Filter Dashboard
│   ├── CreateIssue.tsx         # Create Issue form page
│   └── IssueDetails.tsx        # View & Edit Issue details page
├── ProtectRoute.tsx            # Protected route wrapper using /api/me authentication
├── App.tsx                     # Main Router configuration
├── index.css                   # Global styles (Green, White, Black theme)
└── main.tsx
```

---

## 🔐 Security & Architectural Decisions

1. **Authentication**: JWT tokens signed on login/registration and stored securely in HTTP-Only, SameSite cookies to protect against XSS token theft.
2. **Server-Side Authorization**: All issue operations (`GET /issues/:id`, `PUT /issues/:id`, `DELETE /issues/:id`) check that `user_id` matches the authenticated user ID (`req.user.id`).
3. **Password Security**: Passwords are hashed using `bcrypt` with salt rounds defined in environment variables. Plaintext passwords are never stored.
4. **Input Validation**: `express-validator` middleware validates inputs (e.g. valid email formats, non-empty fields) on critical endpoints.
5. **Secret Management**: Environment variables managed via `.env` files. Sensitive credentials are excluded from version control (`.env.example` provided).

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Register a new user | No |
| `POST` | `/api/login` | Log in user & receive session cookie | No |
| `POST` | `/api/logout` | Clear user session cookie | No |
| `GET` | `/api/me` | Fetch authenticated user profile | **Yes (Cookie)** |
| `GET` | `/api/issues` | Fetch all issues belonging to current user | **Yes (Cookie)** |
| `POST` | `/api/issues` | Create a new issue | **Yes (Cookie)** |
| `GET` | `/api/issues/:id` | Fetch specific issue details | **Yes (Cookie)** |
| `PUT` | `/api/issues/:id` | Update issue title, description, priority, status | **Yes (Cookie)** |
| `DELETE` | `/api/issues/:id` | Delete an issue | **Yes (Cookie)** |

---

## ⚙️ Setup and Installation

### 1. Environment Setup

Copy `.env.example` in `Server/` to `.env`:

```bash
cp Server/.env.example Server/.env
```

Fill in your database connection string and secret key:
```env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/issue_tracker_db
JWT_PAS=your_secure_jwt_secret_key
SALT_ROUNDS=10
```

### 2. Database Migration

Generate and run Drizzle migrations for PostgreSQL:

```bash
cd Server
npm install
npm run db:generate
npm run db:migrate
```

### 3. Run the Backend

```bash
cd Server
node index.js
```

Backend server runs at `http://localhost:5000`.

### 4. Run the Frontend

In a new terminal:

```bash
cd Client
npm install
npm run dev
```

Frontend application runs at `http://localhost:5173`.
