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
others. Stages build on each other conceptually, though, so working
through them in order is recommended if you're new to this.

```
learn-docker-with-node/
├── 01-hello-docker/          # image basics: build, run
├── 02-push-pull-registry/    # sharing images via a registry
├── 03-docker-compose/        # (coming soon)
├── 04-multi-env-compose/     # (coming soon)
├── 05-cicd-github-actions/   # (coming soon)
├── 06-azure-acr/             # (coming soon)
└── README.md                 # you are here
```

Within a stage folder, expect: `.dockerignore`, `Dockerfile`, the app
code (`main.js`, `package.json`, and `package-lock.json`), and a
`README.md` explaining what's new in that stage and exactly how to run
it - that's where the actual test/run instructions live, not here.

## What's covered

| Stage | Folder | What it teaches |
|---|---|---|
| 1 | [`01-hello-docker`](01-hello-docker) | Building an image, running a container |
| 2 | [`02-push-pull-registry`](02-push-pull-registry) | Pushing/pulling images via a registry (Docker Hub) |
| 3 | `03-docker-compose` *(coming soon)* | Replacing `docker run` flags with a compose file |
| 4 | `04-multi-env-compose` *(coming soon)* | Local vs. prod config via compose overrides |
| 5 | `05-cicd-github-actions` *(coming soon)* | Automating build + push on every commit |
| 6 | `06-azure-acr` *(coming soon)* | Publishing to and consuming from Azure Container Registry |

## Prerequisites

- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/).
  Must be running before any `docker` command, or you'll see
  `error during connect: this error may indicate that the docker
  daemon is not running`.
- **Node.js** (v18+) and **npm** - [Download](https://nodejs.org/).
  Needed for stage 1's recommended local verification step, but not
  required to build or run the app in a container.
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
│   ├── README.md                   # what's new in this stage + why
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── main.js
├── 02-push-pull-registry/
│   ├── README.md                   # what's new in this stage + why
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── main.js
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

Each stage's README covers its command sequence, options, and examples,
including `build`, `run`, and `compose up`.

## Contribute

Create a branch and open a PR - the description will auto-populate
from the repo's PR template.