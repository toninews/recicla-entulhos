FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN pnpm prisma generate

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN pnpm build

EXPOSE 3001

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start:prod"]
