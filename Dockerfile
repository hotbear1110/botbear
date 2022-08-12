# syntax=docker/dockerfile:1
# Multi-stage build setup for running a shell script then Node JS code
FROM ubuntu
COPY "configsetup.sh" .
RUN ["chmod", "+x", "./configsetup.sh"]
ENTRYPOINT [ "./configsetup.sh" ]

# Using lightweight node version
FROM node:18.7.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the listener ports
EXPOSE 8080
EXPOSE 3306

# Init
CMD [ "node", "start.js" ]