# Use official Bun image
FROM oven/bun:1

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "start"]
