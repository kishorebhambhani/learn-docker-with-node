# --- Stage 1: the absolute basics ---
# One goal here: turn our Node app into something that can run ANYWHERE
# Docker is installed, without "it works on my machine" problems.

# Every Dockerfile starts FROM a base image. This one already has Node.js
# installed, so we don't have to install it ourselves.
FROM node:18-slim

# All commands below run inside this folder, inside the container.
# It doesn't need to match any folder name on your actual computer.
WORKDIR /app

# Copy just the dependency files first (not all our code yet).
# Why: Docker caches each step. If our code changes but our dependencies
# don't, this step is reused instead of re-running install every time.
COPY package.json package-lock.json ./

# "npm ci" instead of "npm install": it installs EXACTLY what's in
# package-lock.json and fails if package.json and the lockfile are out
# of sync, instead of silently updating things. That's what you want
# in a container build — reproducible, not "whatever resolves today."
RUN npm ci --omit=dev

# Now copy the actual application code.
COPY main.js ./

# This doesn't actually open the port — it's documentation for humans
# (and some tools) saying "this container expects to use port 8000".
EXPOSE 8000

# The command that runs when the container starts.
CMD [ "node", "main.js" ]
