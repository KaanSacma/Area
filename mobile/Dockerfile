# Use the official Android SDK image
FROM androidsdk/android-30

# Set the working directory in the container
WORKDIR /app

# Update Node.js to a more recent version
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Copy package.json and package-lock.json (if available) to the working directory
COPY package.json package-lock.json* ./

COPY . /app
WORKDIR /app

# Adjust the above command according to your specific needs (e.g., assembleRelease).

RUN npm install react-native
RUN npm install react-native-cli
RUN npm install

# Accept licenses (optional, depending on your specific use case)
RUN yes | sdkmanager --licenses

# Install necessary components (adjust as needed)
RUN sdkmanager "build-tools;29.0.2" "patcher;v4" "platform-tools" "platforms;android-29" "sources;android-29"
