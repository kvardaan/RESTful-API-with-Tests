# RESTful API with Tests - For a Blogging Application

A robust API built to handle single and multiple document queries over distinct endpoints enabling seamless CRUD operations and covering integration tests.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features

- CRUD operations for managing documents
- Single and multiple document queries
- Distinct endpoints for various operations
- CI pipeline for automated testing

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- GitHub Actions (CI)
- Vitest & Supertest

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Docker
- Git

### Installation

#### 1. Clone the repository.
   ```bash
   git clone https://github.com/kvardaan/RESTful-API-with-Tests.git
   cd RESTful-API-with-Tests
   ```

#### 2. Install dependencies.
   ```bash
   npm install
   ```

#### 3. Configure Environment Variables
   In the root of the directory, create a .env file by copying the .env.example file.
   ```bash
   cp .env.example .env
   ```

#### 4. Set Up Database (PostgreSQL)

You can use a cloud service like Neon or Supabase, or run a local instance with Docker -

- Local PostgreSQL with Docker:

```bash
docker-compose up -d
```

Update the `.env` file with your PostgreSQL connection details -

- Local instance -

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/rest-test
```

#### 5. Run Prisma migrations -
   ```bash
   npm run db:migrate
   ```

#### 6. Seed the database -
   ```bash
   npm run db:seed
   ```

## Usage

To run the application locally -

```bash
npm run dev
```

To watch the database -

```bash
npm run studio
```

## API Endpoints

### Users

- POST /api/v1/users/ - Add a new user
- PATCH /api/v1/users/:id - Edit user information
- DELETE /api/v1/users/:id - Delete a user
- GET /api/v1/users/:id - Get user details by ID

### Blogs

- POST /api/v1/posts/ - Add a new blog post
- PATCH /api/v1/posts/:id - Edit a blog post
- DELETE /api/v1/posts/:id - Delete a blog post
- GET /api/v1/posts/:id - Get blog post details by ID

Note: Replace `:id` with the actual ID of the user or blog post when making requests.

The application will be available at `http://localhost:3000`.

> [!NOTE]  
> Suggestions are welcomed for additional endpoints or improvements to the existing API structure. If you have ideas for enhancing the functionality or user experience, please feel free to open an issue or submit a pull request.
