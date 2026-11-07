# Stage 6 - Development vs production Compose

## What's new in this stage

Stage 5's setup (build locally, mount code, run nodemon) suits development
and not production. This stage splits the Compose configuration into
several files. The only new idea is:

> One **base** Compose file holds what is shared; other files **override or
> add** settings for a specific environment.

## The idea in one sentence

Development builds the image from your code; production runs an image that
was already built and pushed to a registry, as in stage 2.

## The files

| File | Role | Contains |
|---|---|---|
| `docker-compose.yml` | Base | Shared settings: ports, `PORT` |
| `docker-compose.override.yml` | Development | `build`, bind mount, `nodemon`, `NODE_ENV=development` |
| `docker-compose.prod.yml` | Production | `image: yourusername/hello-docker:0.0.1`, `NODE_ENV=production`, restart policy |

The base file has neither `build` nor `image` - each environment decides
where the image comes from - so it cannot run alone.

## Prerequisites

- **Docker Desktop** - must be running before any `docker` command.
- For production: the image you pushed in
  [stage 2](../02-push-pull-registry) (`yourusername/hello-docker:0.0.1`),
  and `docker login` if the repository is private.

## How to test: development

Compose automatically reads `docker-compose.override.yml` on top of
`docker-compose.yml`, so no flags are needed:

```bash
cd 06-multi-env-compose
docker compose up --build
```

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 06-multi-env-compose","environment":"development"}
```

Edit `main.js` while it is running and the change appears, as in stage 5.
Stop with `Ctrl+C`, then `docker compose down`.

## How to test: production

Open `docker-compose.prod.yml` and replace `yourusername` with your Docker
Hub username. Then name both files explicitly:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 02-push-pull-registry"}
```

The response comes from the **stage 2 image** - this folder's `main.js` was
never built or used. That is the point: production runs the exact image you
published. Editing `main.js` here changes nothing in production until you
build, tag and push a new version.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## See what Compose actually builds

`config` prints the merged result without starting anything:

```bash
docker compose config                                                    # base + override (development)
docker compose -f docker-compose.yml -f docker-compose.prod.yml config   # base + prod
```

Compare the two outputs: the same base settings, different `build`/`image`,
`volumes` and `NODE_ENV`.

## Things worth noticing

- **Naming files with `-f` replaces the automatic override.** Only the
  files you list are used, which is why the production command lists the
  base and prod files and leaves out the override. Development never
  accidentally gets production settings, or the reverse.
- **Later files win.** For single values, the last file listed sets the
  value. Lists such as `ports` and `environment` are combined.
- **The Dockerfile has a build argument** (`ARG NODE_ENV`). The dev override
  passes `development`, so nodemon is installed. The default is
  `production`, so `npm ci` skips devDependencies. It is a small supporting
  detail; the lesson is the file split.
- **Tags matter.** The production file pins `0.0.1` rather than `latest`, so
  it is clear which build runs. A new release means pushing a new tag and
  updating this file.

## What's next

[`07-persistent-volumes`](../07-persistent-volumes) - the next problem:
data. Containers are disposable, so where should a database keep its files?
