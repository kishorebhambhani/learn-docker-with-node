# Stage 5 - Bind mounts

## How this fits the learning path

In Stage 3, you used Docker Compose to build and run the app. Stage 4 added
a second service and introduced Compose networking. This stage keeps the
app's Compose setup simple and introduces a different idea: a **bind mount**,
which lets the running container use code from your computer.

Bind mounts get their own stage because they change the development workflow:
save a code edit and see it in the running app without rebuilding the image.
Understanding this also makes it easier to compare bind mounts with the named
volumes used for persistent data in Stage 7. Stage 5 builds on the Compose
workflow from Stage 3; it does not depend on the Redis setup from Stage 4.

## What's new in this stage

So far, changing `main.js` meant stopping the container, rebuilding the
image and starting again. This stage removes that loop. The only new idea is:

> A **bind mount** connects a folder on your machine to a folder in the
> container, so both see the same files.

## The idea in one sentence

With a bind mount, the container reads your code straight from your disk -
save a file in your editor and the running container sees the change.

## What changed

```yaml
services:
  app:
    build: .
    command: npm run dev        # nodemon restarts the app on file changes
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
    volumes:
      - .:/app                  # bind mount: your folder -> /app
      - /app/node_modules       # keep the container's own node_modules
```

Two supporting changes make it work:

- **nodemon** (a devDependency) restarts Node when files change. The
  `dev` script in `package.json` is `nodemon -L main.js`. The Dockerfile now
  runs `npm ci` without `--omit=dev` so nodemon is installed.
- **`-L` (polling)**: file-change notifications often do not cross from your
  machine into a container, especially on Windows and macOS. `-L` makes
  nodemon check for changes instead of waiting for notifications.

## Prerequisites

- **Docker Desktop** - must be running before any `docker` command.
- Node.js is **not** needed on your machine.

## How to test

This stage is meant to be run with Docker Compose. The app is started with
`npm run dev`, which uses `nodemon -L` to restart whenever files change.

```bash
cd 05-bind-mounts
docker compose up --build
```

In another terminal:

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 05-bind-mounts"}
```

If you want to validate the app logic without Docker Desktop, the app itself
still runs locally after `npm install`:

```bash
# bash / zsh
cd 05-bind-mounts
npm install
PORT=8000 node main.js
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 05-bind-mounts"}
```

```powershell
# PowerShell
cd 05-bind-mounts
npm install
$env:PORT = "8000"
node main.js
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 05-bind-mounts"}
```

Now, **without stopping the container**, edit `main.js` and change the
message, for example to `... - 05-bind-mounts (edited)`. Save the file.
Watch the `docker compose up` terminal: nodemon reports a restart. Call
the endpoint again:

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 05-bind-mounts (edited)"}
```

No `docker build`. No new container. Change the message back when done.

Stop with `Ctrl+C`, then:

```bash
docker compose down
```

## Things worth noticing

- **Why the `/app/node_modules` line?** `.:/app` covers the whole `/app`
  folder, including the `node_modules` installed during the image build,
  with your machine's folder (which may have none, or modules built for
  another operating system). The second entry reserves `/app/node_modules`
  for the container's own copy.
- **If you add a new dependency**, the image must be rebuilt
  (`docker compose up --build`). A bind mount shares your code, but
  `npm ci` still ran at build time.
- **The `COPY main.js` in the Dockerfile still exists**, so the image works
  without the mount. While the mount is active, the mounted folder covers
  that copy.
- **A bind mount is for code you edit.** Contrast with stage 7: data the
  app creates belongs in a named volume managed by Docker.
- This image installs development tools and is meant for development only.
  Stage 6 shows how production differs.

## What's next

06-multi-env-compose - this setup is great
for development, but production should not mount code or run nodemon. Next,
split the Compose configuration by environment.
