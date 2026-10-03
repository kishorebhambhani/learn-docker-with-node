# learn-docker-with-node

A staged, hands-on path for Node.js developers learning Docker - from
"what is a container" through to sharing images on Docker Hub and
publishing them to a private registry (Azure Container Registry).

## Who this is for

Developers comfortable with Node.js/Express who are new to Docker, or
want a structured refresher. No prior Docker knowledge assumed.

## How this repo is organized

Each stage lives in its own numbered folder and is **fully
self-contained** - its own Dockerfile, app code, and README. You can
open any single folder and run it without needing anything from the
others. The stages are numbered in a recommended learning order, though
not every stage depends on the previous stage's workflow. Each stage
introduces one new concept, so nothing is bundled together.

```
learn-docker-with-node/
├── 01-hello-docker/            # image basics: build, run
├── 02-push-pull-registry/      # sharing images via a registry
├── 03-docker-compose/          # Compose syntax: docker run flags → docker-compose.yml
└── README.md                   # you are here
```

Each stage has a `.dockerignore`, `Dockerfile`, app code (`main.js`,
`package.json`, and `package-lock.json`), and a `README.md` explaining
what's new and how to run it. Stage 3 also has a `docker-compose.yml`.
The stage READMEs contain the actual test/run instructions.

## Roadmap

| Stage | Folder | What it teaches |
|---|---|---|
| 1 | [`01-hello-docker`](01-hello-docker) | Building an image, running a container |
| 2 | [`02-push-pull-registry`](02-push-pull-registry) | Pushing/pulling images via a registry (Docker Hub) |
| 3 | [`03-docker-compose`](03-docker-compose) | Run the Stage 1 app with Compose instead of a `docker run` command |
| 4 | `04-multi-container-compose` *(coming soon)* | Add a second service and connect services by name |
| 5 | `05-bind-mounts` *(coming soon)* | Mount local code into a container for live edits |
| 6 | `06-multi-env-compose` *(coming soon)* | Configure local and production Compose environments |
| 7 | `07-persistent-volumes` *(coming soon)* | Keep application data in named volumes |
| 8 | `08-cicd-github-actions` *(coming soon)* | Automate image builds and pushes with GitHub Actions |
| 9 | `09-azure-acr` *(coming soon)* | Publish and pull images with Azure Container Registry |

## Pre-requisites

- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/).
  Must be running before any `docker` command, or you'll see
  `error during connect: this error may indicate that the docker
  daemon is not running`.
- **Node.js** (v18+) and **npm** - [Download](https://nodejs.org/).
  Needed for a stage's optional local verification step, but not
  required to build or run any app in a container.
- A free [Docker Hub](https://hub.docker.com/) account - needed for
  stage 2. Later stages may use Docker Hub, another registry, or Azure
  Container Registry.

Verify installations:

```bash
docker -v
node -v
npm -v
```

## Structure

```bash
learn-docker-with-node/
├── README.md                       # top-level map: what this repo is, how to use it, link to each stage
├── LICENSE
├── .gitignore
├── .github/
│   ├── pull_request_template.md
│   └── CODEOWNERS
│
├── 01-hello-docker/
│   ├── README.md
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── main.js
├── 02-push-pull-registry/
│   ├── README.md
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── main.js
└── 03-docker-compose/
    ├── README.md
    ├── .dockerignore
    ├── Dockerfile
    ├── docker-compose.yml
    ├── package.json
    ├── package-lock.json
    └── main.js
```

## General Docker commands reference

These apply across every stage, regardless of what's being taught:

```bash
docker ps                                   # list running containers
docker ps -a                                # list all containers, including stopped ones
docker images                               # list images on your machine
docker stop <container_id_or_name>          # gracefully stop a running container
docker start <container_id_or_name>         # start a stopped container
docker rm <container_id_or_name>            # remove a stopped container
docker rmi <image>                          # remove an image (remove its containers first)
docker logs <container_id_or_name>          # view a container's output
```

Registry commands introduced in stage 2:

```bash
docker login [registry]                                             # authenticate with Docker Hub or another registry
docker tag <image> <registry>/<namespace>/<repository>:<tag>         # add a registry-qualified name to an image
docker push <registry>/<namespace>/<repository>:<tag>                # upload an image to a registry
docker pull <registry>/<namespace>/<repository>:<tag>                # download an image from a registry
```

Compose commands introduced in stage 3:

```bash
docker compose up                           # build (if needed) and start all services in the file
docker compose up -d                        # same, but detached (background)
docker compose up --build                   # force a rebuild even if the image already exists
docker compose down                         # stop and remove containers started by the compose file
docker compose ps                           # list containers managed by the compose file
docker compose logs -f                      # follow logs from all services
```

Each stage's README covers its own command sequence, options, and
examples in more detail, including anything specific to that stage.

## Contribute

Create a branch and open a PR - the description will auto-populate
from the repo's PR template.
