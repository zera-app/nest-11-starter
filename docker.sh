#!/bin/bash

case "$1" in
  "build")
    docker-compose build
    ;;
  "up")
    docker-compose up -d
    ;;
  "down")
    docker-compose down
    ;;
  "logs")
    docker-compose logs -f
    ;;
  "migrate")
    docker-compose exec app npx prisma migrate deploy
    ;;
  "seed")
    docker-compose exec app npx prisma db seed
    ;;
  "prisma-studio")
    docker-compose exec app npx prisma studio
    ;;
  *)
    echo "Usage: $0 {build|up|down|logs|migrate|seed|prisma-studio}"
    exit 1
    ;;
esac

exit 0
