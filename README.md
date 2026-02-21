# Task Management REST API

A RESTful API for managing tasks with user authentication, built with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Password Hashing:** bcrypt
- **Validation:** Zod

---

## Prerequisites

- Node.js v18+
- PostgreSQL
- npm

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Ahsanulk27/sammtech-takehome.git
cd sammtech-task-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sammtech"
/// If you want to use my hosted db with pre-filled data -> postgresql://neondb_owner:npg_Y7HSWpLkva0E@ep-fancy-field-a1yrnms0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require
JWT_SECRET="your-super-secret-key"
PORT=3000
```

Replace `USER` and `PASSWORD` with your PostgreSQL credentials.

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

The server will be running at `http://localhost:3000`.

---

## Environment Variables

| Variable       | Description                          |
|----------------|--------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string         |
| `JWT_SECRET`   | Secret key used to sign JWT tokens   |
| `PORT`         | Port the server runs on (default: 3000) |

---

## API Endpoints

### Auth

| Method | Endpoint              | Description         | Auth Required |
|--------|-----------------------|---------------------|---------------|
| POST   | `/api/auth/sign-up`  | Register a new user | No            |
| POST   | `/api/auth/sign-in`     | Login and get token | No            |

### Tasks

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| GET    | `/api/tasks`       | Get all tasks (paginated)| Yes           |
| GET    | `/api/tasks/:id`   | Get a single task by ID  | Yes           |
| POST   | `/api/tasks`       | Create a new task        | Yes           |
| PUT    | `/api/tasks/:id`   | Update a task            | Yes           |
| DELETE | `/api/tasks/:id`   | Delete a task            | Yes           |

### Query Parameters (GET /api/tasks)

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `status`  | string | Filter by status: `pending`, `in_progress`, `completed` |
| `page`    | number | Page number (default: 1)                        |
| `limit`   | number | Results per page (default: 10)                  |

Example: `GET /api/tasks?status=pending&page=1&limit=5`

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

You can obtain a token by logging in via `POST /api/auth/sign-in`.

---

## Request & Response Examples

### Register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2026-02-21T00:00:00.000Z"
  }
}
```

### Create Task

**Request:**
```json
{
  "title": "Complete project documentation",
  "description": "Write up the full API documentation",
  "status": "pending",
  "dueDate": "2026-03-15T10:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "uuid",
    "title": "Complete project documentation",
    "description": "Write up the full API documentation",
    "status": "pending",
    "dueDate": "2026-03-15T10:00:00.000Z",
    "createdAt": "2026-02-21T00:00:00.000Z",
    "userId": "uuid"
  }
}
```

---

## Task Status Values

- `pending`
- `in_progress`
- `completed`

---

## Folder Structure

```
src/
├── controllers/
│   ├── authController.ts
│   └── taskController.ts
├── routes/
│   ├── authRoutes.ts
│   └── taskRoutes.ts
├── middleware/
│   ├── authMiddleware.ts
│   ├── taskValidation.ts
│   ├── authValidation.ts
│   └── validator.ts
├── prisma/
│   └── client.ts
├── generated/        ← gitignored, Prisma generated client
├── prisma.config.ts
└── app.ts
```

---

## Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start development server with tsx  |
| `npm run build` | Compile TypeScript to JavaScript   |
| `npm start`     | Start production server            |
