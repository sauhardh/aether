FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9  --activate
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "run", "dev"]
