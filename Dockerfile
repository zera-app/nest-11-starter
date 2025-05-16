FROM node:22-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

FROM node:22-alpine as production

WORKDIR /app

# Copy built app from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production

# Expose ports for backend and client
EXPOSE 8081
EXPOSE 8082

# Command to run the app
CMD ["npm", "run", "start:prod"]
