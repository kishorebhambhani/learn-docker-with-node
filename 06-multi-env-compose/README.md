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

## Why use different images?

During development, Compose builds an image from this folder so you can
work on this chapter's source. The bind mount then makes your working files
available inside the running container. For production, Compose uses the
versioned image published to Docker Hub in stage 2 (pulling it if it is not
already available locally). That image is a known, deployable build; the
production machine does not need this source folder or a build toolchain.
It also means edits to this folder do not change production until you build
and publish a new image tag, then update the production Compose file.

## What the override file does

When you run `docker compose up` in this folder without `-f`, Compose reads
`docker-compose.yml` and automatically merges in
`docker-compose.override.yml`. The override adds the development-only
settings: build from this folder, run `nodemon`, set `NODE_ENV` to
`development`, and bind-mount the folder into `/app`.

The production command names its files explicitly with `-f`. In that mode,
Compose uses only the listed base and production files; it does not also
load the development override. So production gets the registry `image`,
without the local build, bind mount, or `nodemon` command.

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

The `8000:8000` port mapping connects your machine's port 8000 to port 8000
in the container, so `http://localhost:8000/` still reaches the containerized
app. The `.:/app` bind mount makes this chapter's folder (including
`main.js`) visible inside the container. When you save an edit, `nodemon`
detects it and restarts the app; the next request to localhost reaches that
restarted app and shows the edit. This is the same development loop
introduced in stage 5, now supplied by the development override.

For a direct comparison, temporarily change the `message` in `main.js` and
request `http://localhost:8000/` again. The response now reflects your local
edit. Stop with `Ctrl+C`, then run `docker compose down` before switching to
production.

## How to test: production

Before continuing, complete [stage 2's build, push, and run steps](../02-push-pull-registry#try-it).
Confirm that the pushed image responds at `http://localhost:8000/`, then
stop its container to free port 8000. Stage 6 uses that same published tag;
having only a local image is not enough if the tag has not been pushed.

Open `docker-compose.prod.yml` and replace `yourusername` with your Docker
Hub username. Then explicitly pull the published image and start production:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

The pull comes from Docker Hub, so a local copy of the stage 2 image is not
required. If the image is missing locally, `up` also pulls it automatically;
the explicit `pull` here makes that production source visible in the demo.

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 02-push-pull-registry"}
```

The response comes from the **stage 2 image** - this folder's `main.js` was
never built or mounted into the container. That is the point: production
runs the image you published, rather than your in-progress working copy.
The message remains the stage 2 version even though you edited this folder's
`main.js`: production has no bind mount and does not build from this source.
To deploy a change, build and push a new version, then update the image tag
in `docker-compose.prod.yml`.

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
