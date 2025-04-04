# Splitwise Application

A full-stack expense sharing application built with Spring Boot and React.

## Architecture Overview

The application follows a microservices architecture with:
- Frontend: React + Vite
- Backend: Spring Boot
- Database: PostgreSQL

## Features

- User Authentication (JWT-based)
- Group Management
- Expense Tracking
- Friend Management
- Settlement System
- Real-time Balance Updates

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security
- JPA/Hibernate
- PostgreSQL

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Context API

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Group Endpoints
- GET /api/groups - List all groups
- POST /api/groups - Create new group
- GET /api/groups/{id} - Get group details
- PUT /api/groups/{id} - Update group
- DELETE /api/groups/{id} - Delete group

### Expense Endpoints
- GET /api/expenses - List all expenses
- POST /api/expenses - Create new expense
- PUT /api/expenses/{id} - Update expense
- DELETE /api/expenses/{id} - Delete expense
- POST /api/expenses/{id}/settle - Settle expense

### Friend Endpoints
- GET /api/friends - List friends
- POST /api/friends - Add friend
- DELETE /api/friends/{id} - Remove friend
- GET /api/friends/pending - List pending requests

## Setup Instructions

### Prerequisites
- Java 17
- Node.js 16+
- PostgreSQL

### Backend Setup
1. Clone the repository
2. Configure database in `application.properties`
3. Run `./mvnw spring-boot:run`

### Frontend Setup
1. Navigate to `splitwise-frontend`
2. Run `npm install`
3. Run `npm run dev`

## ER Diagram

![ER Diagram](./ER_Diagram.png)



## Architecture Diagram

[Include architecture diagram here]