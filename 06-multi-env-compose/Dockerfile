# --- Stage 6: one Dockerfile, two environments ---
# Development builds this file locally. Production never builds on the
# server — it pulls an image that was already built and pushed (stage 2).

FROM node:18-slim

# A build argument lets docker-compose.override.yml change how this image
# is built without editing the Dockerfile. Default: production behaviour.
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# Copy dependency files first so Docker can cache this layer separately
# from your application code.
COPY package.json package-lock.json ./

# With NODE_ENV=production, "npm ci" skips devDependencies (nodemon).
# With NODE_ENV=development (set by the dev override), it installs them.
RUN npm ci

COPY main.js ./

# Documentation only — doesn't publish the port.
EXPOSE 8000

CMD [ "node", "main.js" ]
