FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY next.config.ts tsconfig.json next-env.d.ts ./
COPY src ./src

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
