# frontend/Dockerfile
# A simpler, more direct Dockerfile

FROM node:22-alpine

WORKDIR /app

# Copy package.json and the rest of your code
# Note: We copy package-lock.json as well if it exists for faster, more reliable installs
COPY package*.json ./
COPY . .

# This single command will now run every time the container starts
CMD npm install && npm run dev -- --host