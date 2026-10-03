# --- Stage 3: use Compose to run the Stage 1 app ---
# Compose doesn't replace the Dockerfile — it still builds this exact image.
# What changes is how you RUN it: instead of a long docker run command with
# flags, docker-compose.yml describes it declaratively in one file.

FROM node:18-slim

WORKDIR /app

# Copy dependency files first so Docker can cache this layer separately
# from your application code.
COPY package.json package-lock.json ./

# "npm ci" installs exactly what's in package-lock.json and fails if the
# lockfile and package.json are out of sync — reproducible, not "whatever
# resolves today."
RUN npm ci --omit=dev

COPY main.js ./

# Documentation only — doesn't publish the port. docker-compose.yml's
# "ports" section is what actually does that.
EXPOSE 8000

CMD [ "node", "main.js" ]
