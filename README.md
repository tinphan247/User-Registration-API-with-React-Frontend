README - User Registration System
🎯 Project Overview
A full-stack User Registration System built with:

Backend: NestJS + TypeScript + PostgreSQL + TypeORM
Frontend: React + TypeScript + Tailwind CSS + React Hook Form + React Query

Features:

✅ User registration with email and password
✅ Form validation (client-side and server-side)
✅ Password hashing with bcrypt
✅ Duplicate email detection
✅ Responsive UI with Tailwind CSS
✅ Error handling and success messages
✅ Login page (UI only - no backend implementation)


📋 Prerequisites
Before you begin, ensure you have installed:

Node.js (v18 or higher)
PostgreSQL (v14 or higher)
npm (comes with Node.js)

## 📁 Project Structure
```
User Registration API with React Frontend/
├── backend/
│   ├── src/
│   │   ├── user/          # User module
│   │   ├── app.module.ts  # Root module
│   │   └── main.ts        # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx        # Main application
    │   └── index.css      # Global styles
    ├── tailwind.config.js
    └── package.json


🚀 Installation & Setup
Step 1: Setup PostgreSQL Database

Install PostgreSQL on your system
Create a new database:

bash   psql -U postgres -c "CREATE DATABASE user_registration_db;"
Or use pgAdmin GUI to create the database

Step 2: Backend Setup

Navigate to project directory:

bash   cd "your-project-path"

Create NestJS backend:

bash   npx @nestjs/cli new backend
   cd backend

Install required dependencies:

bash   npm install @nestjs/typeorm typeorm pg @nestjs/config bcrypt class-validator class-transformer
   npm install --save-dev @types/bcrypt

Generate user module:

bash   npx nest g module user
   npx nest g controller user --no-spec
   npx nest g service user --no-spec

Create necessary files:

src/user/user.entity.ts - User database entity
src/user/user.dto.ts - Data validation schema
src/user/user.service.ts - Business logic
src/user/user.controller.ts - API endpoints
src/user/user.module.ts - User module configuration
Replace src/app.module.ts - Database configuration
Replace src/main.ts - Application entry point


Create .env file in backend root:

env   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=user_registration_db
   PORT=3000
⚠️ Replace your_postgres_password with your actual PostgreSQL password

Start backend server:

bash   npm run start:dev
✅ Backend should run on: http://localhost:3000

Step 3: Frontend Setup

Go back to project root:

bash   cd ..

Create React + TypeScript project:

bash   npm create vite@latest frontend -- --template react-ts
   cd frontend

Install dependencies:

bash   npm install
   npm install react-hook-form @tanstack/react-query lucide-react
   npm install -D tailwindcss@3.4.1 postcss autoprefixer

Initialize Tailwind CSS:

bash   npx tailwindcss init -p

Configure Tailwind:

Update tailwind.config.js to include content paths
Update postcss.config.js with Tailwind plugins
Replace src/index.css with Tailwind directives


Replace src/App.tsx with the application code
Start frontend server:

bash   npm run dev
✅ Frontend should run on: http://localhost:5173

🎮 How to Use
Access the Application
Open your browser and navigate to: http://localhost:5173
Register a New User

Click "Sign Up" button on home page
Enter a valid email address
Enter a password (minimum 6 characters)
Click "Sign Up" button
Success message will appear
Automatically redirects to Login page after 2 seconds

Login (UI Only)

Navigate to Login page
Enter email and password
Click "Login" button
See mock success message