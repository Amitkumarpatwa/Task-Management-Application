# Task Management Application

A simple web-based task management application built with Node.js, Express, and MongoDB. Users can register, login, and manage their tasks with full CRUD operations.

## Features

- User Registration & Login with session-based authentication
- Create, Read, Update, Delete tasks
- Task status tracking (Pending, In Progress, Completed)
- Each user can only see and manage their own tasks
- Password hashing with bcrypt
- Session persistence with MongoDB store

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Authentication**: bcryptjs, express-session, connect-mongo

## Project Structure

```
├── config/
│   └── db.js              # MongoDB connection setup
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User schema
│   └── Task.js             # Task schema
├── routes/
│   ├── auth.js             # Auth routes (register, login, logout)
│   └── tasks.js            # Task CRUD routes
├── public/
│   ├── css/
│   │   └── style.css       # Stylesheet
│   ├── js/
│   │   ├── auth.js         # Login/Register frontend logic
│   │   └── dashboard.js    # Dashboard frontend logic
│   ├── index.html          # Login page
│   ├── register.html       # Registration page
│   └── dashboard.html      # Task dashboard
├── docs/
│   ├── test-cases.md       # QA test case documentation
│   └── bug-report.md       # Bug identification report
├── server.js               # Express server entry point
├── package.json
└── .env.example            # Environment variables template
```

## Setup & Installation

1. **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed.

2. **Clone the repository**:
   ```bash
   git clone https://github.com/Amitkumarpatwa/Task-Management-Application.git
   cd Task-Management-Application
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your MongoDB connection string and a session secret.

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Run the application**:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

7. Open your browser and go to `http://localhost:3000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Tasks (requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## QA Documentation

- [Test Cases](docs/test-cases.md) — Test scenarios covering registration, login, CRUD operations, and input validation
- [Bug Report](docs/bug-report.md) — 10 potential bugs and risk areas identified through code review
