# Nest Js Starter

## Introduction

Nest Js Starter is a boilerplate project designed to help you kickstart your backend application using NestJS. It comes pre-configured with essential tools and best practices for building scalable, maintainable, and high-performance APIs.

## Installation

### PreInquires

- NodeJs
- Postgres
- Redis (Queue & Cache)

### Clone and install dependencies

```bash
# Clone the repository
git clone  https://github.com/zera-app/nest-11-starter.git

# Navigate to the project directory
cd nest-11-starter

# Install dependencies
npm install
# or
bun install
```

### Configure the .env file

```bash
cp .env.example .env
```

### Start the development server

```bash
npm run start:dev
# or
bun run start:dev
```

### Build for production

```bash
npm run build
# or
bun run build
```

## Configuration

Environment variables are defined in `.env.example`. Key variables:

- `DATABASE_URL` – PostgreSQL connection string
- `REDIS_HOST` – Redis server host
- `REDIS_PORT` – Redis server port
- `PORT` – Application port

Copy and update:

```bash
cp .env.example .env
```

## Available Scripts

```bash
npm run build # Build for production
npm run format # Format code using prettier
npm run start:backend # start the backend service only
npm run start:client # start the client service only
npm run start # start both backend and client
npm run start:dev # start both backend and client in watch mode
npm run start:debug # start both backend and client in debug mode
npm run start:prod:backend # start the backend service for production
npm run start:prod:client # start the client service for production
npm run lint # Run lint
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the compiled app using pm2:
   ```bash
    npm start:prod:backend && start:prod:client
   ```

## Contributing

Contributions are welcome! Please open issues or submit pull requests. Ensure code follows existing lint rules and has accompanying tests.
