# 03 — Docker Compose basics

This stage teaches **Compose syntax only** — it uses the same basic
single-app build-and-run workflow introduced in
[`01-hello-docker`](../01-hello-docker), but describes the run settings in
`docker-compose.yml` instead of passing them to `docker run`.

## What's new

Previously, running the container meant remembering (or retyping) a
command like:

```bash
docker build -t docker-node-image .
docker run -p 8000:8000 -e PORT=8000 --name app docker-node-image
```

`docker-compose.yml` describes that same intent declaratively:

```yaml
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
```

And now one command does both the build and the run:

```bash
docker compose up
```

## Pre-requisites

- **Docker Desktop** — must be running before any `docker` command.
- **Node.js** (v18+) and **npm** — only needed if you want to run the app
  locally without Docker; not required for the container.

## How to test

```bash
# Build the image AND start the container
docker compose up

# Same thing, but detached (returns your terminal immediately)
docker compose up -d

# Verify
curl http://localhost:8000/
```

Expected response:

```json
{ "message": "Hello from inside a Docker container! - 03-docker-compose" }
```

## Compose commands used in this stage

```bash
docker compose up          # build (if needed) and start all services in this file
docker compose up -d       # same, but detached (background)
docker compose up --build  # force a rebuild even if the image already exists
docker compose down        # stop and remove the container(s) started by this file
docker compose ps          # list containers managed by this compose file
docker compose logs -f     # follow logs from all services
```

Notice you never typed an image name or `--name` — Compose derives those
from the service name (`app`) and the folder name automatically.

## Relationship to stage 2

Stage 2 teaches how to push and pull an image through a registry. This
stage does not use that workflow: Compose builds the image locally with
`build: .`. The app behavior and Dockerfile follow the Stage 1 pattern;
the response suffix only identifies which stage is running.

## What's next

`04-multi-container-compose`(Coming soon) adds a
**second service** (Redis) to this same setup, and shows how two
containers in the same Compose file can talk to each other.
