#!/bin/bash

# Define a function to check if gradlew is available
check_gradlew() {
    docker-compose exec client_mobile ls /app/android/gradlew > /dev/null 2>&1
}

# Build Docker images
docker-compose build

# Wait for the gradlew to be available
while ! check_gradlew; do
    echo "Waiting for client_mobile to finish building..."
    sleep 5
done

# Change permissions for gradlew
docker-compose exec client_mobile chmod +x /app/android/gradlew

# Run the mobile container
docker-compose exec client_mobile /app/android/gradlew assembleDebug

# Copy the APK to the host
docker cp $(docker-compose ps -q client_mobile):/app/android/app/build/outputs/apk/debug/app-debug.apk ./app-debug.apk

# Start the containers
docker-compose up
