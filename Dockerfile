# Use official Node.js image with the version 20.5.1 (slim variant)
FROM node:20.11.1-slim

RUN apt-get update && apt-get install -y git
RUN npm install -g @nestjs/cli@10.1.17

# Switch to a non-root user named 'node' for security reasons
USER node

# Set the working directory inside the container to '/home/node/app'
# This will be the directory where your application will reside and run
WORKDIR /home/node/app

# Set the default command to keep the container running
# 'tail -f /dev/null' is a way to keep the container alive indefinitely
# This is useful if you don't want the container to exit immediately after starting
CMD ["tail", "-f", "/dev/null"]