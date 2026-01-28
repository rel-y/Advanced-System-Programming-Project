# src/react-native-app/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    else npm i; fi

COPY . .

EXPOSE 8081 19000 19001 19002

# Minimal: same behavior as `npx expo start --lan`
CMD ["npx", "expo", "start", "--lan", "--port", "8081"]
