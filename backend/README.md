# TaskFlow Backend

Express + Prisma + PostgreSQL API for the TaskFlow Pro frontend.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL with Docker:
   ```bash
   docker compose up -d
   ```

4. Push schema and seed demo data:
   ```bash
   npm run db:setup
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

API runs at `http://localhost:3001`.

> If you already have PostgreSQL installed locally, update `DATABASE_URL` in `.env` with your own credentials instead of using Docker.

## Demo Account

- Email: `alex@taskflow.com`
- Password: `password123`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Forgot password |
| GET | `/api/auth/me` | Current user |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/recent` | Recent tasks |
| GET | `/api/tasks/overdue` | Overdue tasks |
| GET | `/api/tasks/upcoming-deadlines` | Upcoming deadlines |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| GET | `/api/categories/:id/tasks` | Category tasks |
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET | `/api/invitations` | Pending invitations |
| POST | `/api/invitations/:id/accept` | Accept invitation |
| POST | `/api/invitations/:id/reject` | Reject invitation |
| GET | `/api/users/search?q=` | Search users |
| POST | `/api/users/tasks/:id/invite` | Invite user to task |
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |
