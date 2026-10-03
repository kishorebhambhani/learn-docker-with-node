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

## Prerequisites

- **Docker Desktop** — must be running before any `docker` command.
- **Node.js** (v18+) and **npm** — only needed if you want to run the app
  locally without Docker; not required for the container.

## How to test

```bash
cd 03-docker-compose
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
docker compose config      # validate and print the resolved config; does not start containers
docker compose down        # stop and remove the container(s) started by this file
docker compose ps          # list containers managed by this compose file
docker compose logs -f     # follow logs from all services
```

Notice you never typed an image name or `--name` — Compose derives those
names from the project and service names. With this folder name and the
`app` service, Compose builds an image named
`03-docker-compose-app:latest` and creates a container named
`03-docker-compose-app-1`. The project name defaults to the project
folder name (`03-docker-compose`); the service name comes from the YAML.
The final `-1` identifies the first container instance for that service.

You can see the image and container names with:

```bash
docker compose images
docker compose ps -a
```

Compose generates these names because this file does not set an explicit
`image:` or `container_name:`. If you set a different project name, the
generated names change too.

## Try it: set custom names

This optional exercise assumes you can read and edit basic YAML,
especially its indentation. If YAML is new to you, you can skip this
exercise; the rest of the chapter does not require editing the file.

Before editing the file, stop and remove the current container:

```bash
docker compose down
```

Replace the contents of `docker-compose.yml` with this complete file:

```yaml
services:
  app:
    build: .
    image: 03-docker-compose:dev
    container_name: 03-docker-compose-app
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
```

Compared with the original file, the only additions are `image` and
`container_name`. The first sets the name and tag for the locally built
image; the second sets the container's name instead of letting Compose
generate one.

To check the YAML and see the resolved configuration before starting
anything, run:

```bash
docker compose config
```

If there is a YAML or Compose configuration error, Compose reports it
here. If the command succeeds, review the output for the `app` service,
including the image name and container name. This validates the
configuration; it does not build the image or start a container. Then
run:

```bash
docker compose up --build
```

Check the names with `docker compose images` and `docker compose ps`.
The image uses the name you set, and the container uses the explicit
container name. Remove both settings, run `docker compose down`, and
start Compose again to compare these names with the generated defaults.

For this exercise, `container_name` makes the name easy to spot. In
regular Compose projects, it is usually better to let Compose name
containers: an explicit container name prevents scaling that service to
multiple containers.

## Relationship to stages 1 and 2

This stage builds on Stage 1: it uses the same single-app Docker workflow
and describes the build and run settings in Compose instead of a
`docker run` command. The Dockerfile follows the Stage 1 pattern, and the
response suffix identifies this stage's app.

Stage 2 teaches a separate skill: pushing and pulling images through a
registry. Stage 3 does not need that workflow or a Docker Hub account;
Compose builds the image locally from `build: .`. Keeping registry
distribution out of this example lets it focus on Compose syntax. Compose
can also use registry images, but that is not the workflow taught here.

## What's next

`04-multi-container-compose` (coming soon) adds a
**second service** (Redis) to this same setup, and shows how two
containers in the same Compose file can talk to each other.