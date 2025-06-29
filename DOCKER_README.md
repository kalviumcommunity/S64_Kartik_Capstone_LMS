# Docker Setup for LMS Application

This document provides instructions for running the LMS application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd LMS_Capstone_Kartik
   ```

2. **Set up environment variables**
   ```bash
   # Create your .env file in the Backend directory
   # Use the following format:
   ```
   ```env
   # MongoDB Configuration
   MONGO_URI=your_mongo_uri_here
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Server Configuration
   PORT=5000
   
   # Frontend Configuration
   FRONTEND_URL=http://localhost:3000
   
   # AI/LLM Configuration
   OLLAMA_MODEL=llama3.2:1b
   
   # Application Mode
   MOCK_MODE=false
   ```

3. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:5000/api
   - MongoDB: localhost:27017

### Option 2: Using Docker directly

1. **Build the Docker image**
   ```bash
   docker build . -t lms-app
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 --env-file Backend/.env lms-app
   ```

## Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=your_mongo_uri_here

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=5000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# AI/LLM Configuration
OLLAMA_MODEL=llama3.2:1b

# Application Mode
MOCK_MODE=false
```

## Docker Commands

### Build the image
```bash
docker build . -t lms-app
```

### Run the container
```bash
docker run -p 5000:5000 lms-app
```

### Run in detached mode
```bash
docker run -d -p 5000:5000 --name lms-container lms-app
```

### View logs
```bash
docker logs lms-container
```

### Stop the container
```bash
docker stop lms-container
```

### Remove the container
```bash
docker rm lms-container
```

## Docker Compose Commands

### Start all services
```bash
docker-compose up
```

### Start in detached mode
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

## Architecture

The application uses a multi-stage Docker build:

1. **Dependencies Stage**: Installs Node.js dependencies for both backend and frontend
2. **Builder Stage**: Builds the React frontend using Vite
3. **Runner Stage**: Creates the production image with only necessary files

### Services

- **lms-app**: Main application (Node.js/Express + React)
- **mongodb**: MongoDB database

## Troubleshooting

### Port already in use
If port 5000 is already in use, you can change it in the docker-compose.yml file:
```yaml
ports:
  - "3000:5000"  # Maps host port 3000 to container port 5000
```

### MongoDB connection issues
Make sure the MongoDB service is running and the connection string is correct in your environment variables.

### Build failures
If the build fails, try:
```bash
docker system prune -a
docker-compose build --no-cache
```

## Production Deployment

For production deployment:

1. Update environment variables with production values
2. Use a proper MongoDB instance or cloud database
3. Set up proper SSL/TLS certificates
4. Configure reverse proxy (nginx) if needed
5. Set up monitoring and logging

## Video Recording for Capstone

To record a video showing the app running in Docker:

1. Start the application: `docker-compose up --build`
2. Open a browser and navigate to http://localhost:5000
3. Demonstrate the application features
4. Show the Docker containers running: `docker ps`
5. Show the logs: `docker-compose logs`

## File Structure

```
LMS_Capstone_Kartik/
├── Dockerfile              # Multi-stage Docker build
├── .dockerignore           # Files to exclude from build context
├── docker-compose.yml      # Multi-service orchestration
├── Backend/                # Node.js backend
├── client/                 # React frontend
└── DOCKER_README.md        # This file
``` 