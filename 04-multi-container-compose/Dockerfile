# --- Stage 4: same Dockerfile pattern as before ---
# Nothing about the image changes in this stage. The new idea lives in
# docker-compose.yml: a second service (Redis) and how the two find each other.

FROM node:24-slim

WORKDIR /app

# Copy dependency files first so Docker can cache this layer separately
# from your application code.
COPY package.json package-lock.json ./

# Reproducible install: exactly what package-lock.json says.
RUN npm ci --omit=dev

COPY main.js ./

# Documentation only — doesn't publish the port.
EXPOSE 8000

CMD [ "node", "main.js" ]
