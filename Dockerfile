FROM node:24-alpine AS build-stage

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /tmp/build

COPY package.json pnpm-lock.yaml .npmrc* ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG COMMIT_SHA
RUN pnpm build
RUN pnpm prune --production

FROM node:24-alpine

ARG COMMIT_SHA
LABEL name="template"
LABEL maintainer="Stegripe Development <support@stegripe.org>"
LABEL org.opencontainers.image.revision="${COMMIT_SHA}"

WORKDIR /app

COPY --from=build-stage /tmp/build/package.json ./
COPY --from=build-stage /tmp/build/node_modules ./node_modules
COPY --from=build-stage /tmp/build/dist ./dist

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
