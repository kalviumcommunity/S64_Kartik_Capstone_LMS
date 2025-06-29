#!/bin/bash

echo "🐳 Testing Docker Setup for LMS Application"
echo "============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"

# Check if .env file exists
if [ ! -f "Backend/.env" ]; then
    echo "⚠️  Backend/.env file not found."
    echo "📝 Please create Backend/.env with your environment variables:"
    echo ""
    echo "MONGO_URI=your_mongo_uri_here"
    echo "JWT_SECRET=your_jwt_secret"
    echo "GOOGLE_CLIENT_ID=your_google_client_id"
    echo "GOOGLE_CLIENT_SECRET=your_google_client_secret"
    echo "PORT=5000"
    echo "FRONTEND_URL=http://localhost:3000"
    echo "OLLAMA_MODEL=llama3.2:1b"
    echo "MOCK_MODE=false"
    echo ""
    exit 1
fi

echo "✅ Environment file ready"

echo ""
echo "🚀 Ready to build and run the application!"
echo ""
echo "To build and run with Docker Compose:"
echo "  docker-compose up --build"
echo ""
echo "To build with Docker directly:"
echo "  docker build . -t lms-app"
echo "  docker run -p 5000:5000 --env-file Backend/.env lms-app"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "To view logs:"
echo "  docker-compose logs" 