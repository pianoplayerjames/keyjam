# backend/Dockerfile
FROM oven/bun:latest

WORKDIR /app

# Copy package.json and install dependencies first for better layer caching
COPY package.json .
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port Fastify will run on and start the dev server
EXPOSE 3001
CMD ["bun", "--watch", "src/index.ts"]