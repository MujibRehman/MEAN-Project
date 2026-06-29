# # Angular + Express + SQLite Full-Stack App

This project contains:

- An Angular 13 frontend
- An Express backend
- A local SQLite database

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Set `SQLITE_PATH` and `JWT_SECRET` in your shell or environment before starting the backend.

Example:

```bash
export SQLITE_PATH="backend/data/meancourse.sqlite"
export JWT_SECRET="replace-this-with-a-long-random-string"
```

## Run locally

Start the API:

```bash
npm run serve
```

Start the Angular app in a second terminal:

```bash
npm start
```

The frontend runs on `http://localhost:4200` and the API runs on `http://localhost:3000`.
The SQLite database is stored in `backend/data/meancourse.sqlite` by default.

## Build

```bash
npm run build
```

## Notes

- The backend creates the SQLite database and required tables automatically on startup.
- The frontend API base URL is configured through Angular environment files instead of hardcoded service URLs.

## Features

- Angular 13 frontend
- Express.js backend API
- Local SQLite database
- Environment-based configuration
- Separate frontend and backend development servers

## Tech Stack

- Frontend: Angular 13, TypeScript, HTML, CSS
- Backend: Node.js, Express.js
- Database: SQLite
- Tools: npm, VS Code

## Project Purpose

This project was built as a full-stack learning project to understand frontend-backend communication, API development, local database usage, and Angular application structure.
