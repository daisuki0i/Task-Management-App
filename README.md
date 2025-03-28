# Task Management Application

A full-stack application for managing tasks with a React frontend and NestJS backend.

## Project Overview

This project consists of two main components:

- **Frontend**: React application with TypeScript, Vite, and modern UI libraries
- **Backend**: NestJS application with Sequelize ORM and PostgreSQL

## Project Setup

### Prerequisites

- Node.js v20 or higher
- npm v10 or higher
- PostgreSQL (for the backend database)

### Clone the Repository

```bash
git clone https://github.com/daisuki0i/Task-Management-App
cd Task-Management-App
```

### Backend Setup

```bash
cd taskmanagement-backend
npm install
```

Configure your database connection by creating a `.env` file in the backend directory:

```
DATABASE_HOST='localhost'
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME='taskmanagement-db'
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The backend API will be available at http://localhost:3000

### Frontend Setup

```bash
cd taskmanagement-frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will be available at http://localhost:5173

### Building for Production

Backend:

```bash
cd taskmanagement-backend
npm run build
```

Frontend:

```bash
cd taskmanagement-frontend
npm run build
```

## Docker Support

The project includes Docker configuration for containerized deployment.

Configure your docker environment varaibles by creating a `.env` file in the root directory:

```
DATABASE_HOST='db'
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME='taskmanagement-db'
JWT_SECRET=your_jwt_secret
```

Build and run frontend, backend and database:

```bash
docker compose up -d
```

You can access the frontend application via port 80.

## Architecture and Design Decisions

### Frontend Architecture

- **React 19**: Leveraging the latest React features for optimal performance
- **TypeScript**: Type safety throughout the codebase
- **Vite**: Modern build tool for fast development and optimized production builds
- **UI Component Libraries**:
  - shadcn/ui for composable, accessible UI components
  - Tailwind CSS for utility-first styling
  - Radix UI for unstyled, accessible components (used by shadcn/ui)
- **Form Handling**:
  - Formik and React Hook Form for form state management
  - Yup for schema validation and form validation rules
- **State Management**: React's built-in Context API for global state
- **Testing**: Vitest and React Testing Library for component and integration tests

### Component Library Approach

This project uses [shadcn/ui](https://ui.shadcn.com/) for its UI components. Unlike traditional component libraries that are imported as packages, shadcn/ui follows a different approach:

- Components are copied directly into your project's codebase
- Each component is a standalone implementation based on Radix UI primitives
- Components reside in `src/components/ui` directory
- These components are fully customizable and not treated as third-party dependencies

**Testing Philosophy:**

- We don't write unit tests for the base shadcn/ui components in `src/components/ui` since they are imported components (not written by us)
- We write comprehensive unit tests for all custom components that we build ourselves
- This includes any component that composes or extends the shadcn/ui primitives
- Integration tests verify that our custom components work correctly with the shadcn/ui foundation
- This approach recognizes that the underlying Radix UI primitives are already well-tested by their maintainers

### Backend Architecture

- **NestJS**: Modular, scalable Node.js framework with TypeScript support
- **Authentication**: JWT-based auth with Passport strategies
- **Database**: PostgreSQL with Sequelize ORM
- **API Design**: RESTful API following best practices
- **Validation**: Class-validator for request validation
- **Security**:
  - JWT for secure authentication
  - bcrypt for password hashing
  - Proper CORS configuration

### Key Design Patterns

- **Dependency Injection**: Used throughout the NestJS backend for loose coupling
- **Repository Pattern**: Abstraction over data access layer
- **Service Layer**: Business logic separation from controllers
- **Component-Based Architecture**: Modular UI components in the frontend
- **Responsive Design**: Mobile-first approach for all UI components

## Testing

### Frontend Tests

Note: We don't write unit tests for the base shadcn/ui components in `src/components/ui` since they are imported components (not written by us)

```bash
cd taskmanagement-frontend
npm run test
npm run test:coverage
```

## Project Structure

```
TaskManagementApp/
├── taskmanagement-frontend/  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── pages/            # Page components
│   │   ├── api/              # API client and endpoints
│   │   ├── lib/              # Utility types and functions
│   │   ├── utils/            # Helper functions
│   │   ├── tests/            # Test files
│   │   └── main.tsx          # Main application component
│   └── ...
└── taskmanagement-backend/   # NestJS backend
    ├── src/
    │   ├── database/         # Database configuration and setup
    │   ├── dto/              # Data Transfer Objects
    │   ├── entities/         # Database entity models
    │   ├── tasks/            # Tasks module implementation
    │   ├── types/            # TypeScript type definitions
    │   ├── users/            # Users and authentication module
    │   └── main.ts           # Application entry point
    ├── test/                 # Test directory
    └── ...
```
