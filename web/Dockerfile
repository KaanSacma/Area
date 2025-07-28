FROM node:13.0.1-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

COPY . /app
WORKDIR /app

RUN npm install react-native
RUN npm install react-native-cli
RUN npm install