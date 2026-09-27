# Stage 1 - Hello Docker

## What's new in this stage

Nothing before this - this is the starting point. A plain Express app,
and a Dockerfile that turns it into a container image.

## The idea in one sentence

An **image** is a snapshot of your app + everything it needs to run.
A **container** is that image actually running.

## Step 0: run it locally first (recommended before Docker)

Before wrapping anything in a container, confirm the app itself
works, plain and simple:

```bash
cd 01-hello-docker
npm install
node main.js
```

Then in another terminal:

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container!"}
```
Or
Open Browser and paste http://localhost:8000/ in address bar.

Stop it with `Ctrl+C` on terminal.

**Why bother with this step?** If something breaks later, once Docker
is involved, you want to already know your *code* is fine - so any
error you hit is a Docker problem, not a hidden bug in `main.js`.
Skipping straight to Docker means every failure could be either, and
you can't tell which without backtracking to this exact test anyway.

## Now containerize it

```bash
# Build the image (creates a snapshot called "hello-docker-01").
docker build -t hello-docker-01 .

# Run a container from that image, mapping container port 8000
# to port 8000 on your own machine
docker run -p 8000:8000 hello-docker-01
```

The left port is on your machine; the right port is inside the container.
If host port `8000` is already in use, use another host port, for example
`docker run -p 8001:8000 hello-docker-01`, and open
`http://localhost:8001/`. The app still listens on port `8000` inside the
container.

Then in another terminal:

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container!"}
```
If you used host port `8001`, use `curl http://localhost:8001/` instead.

Stop it with `Ctrl+C`, or find and stop it from another terminal:

```bash
docker ps                    # find the container ID or name
docker stop <container_id_or_name>
```

## Run Container with Custom Container Name

```bash
# Run the container with specific name using image hello-docker-01
docker run -p 8000:8000 --name container-node-app hello-docker-01

# Run another container with a different PORT environment variable
docker run -p 4000:4000 -e PORT=4000 --name container-node-app-4000 hello-docker-01
```
## Things worth noticing

- You'll notice the local step used `npm install`, but the Dockerfile
  uses `npm ci` instead. Locally, `npm install` is fine - you're
  actively developing and it's okay for it to update things. Inside
  a Docker build, we want *exactly* what's in `package-lock.json`
  every single time, with no surprises - that's what `npm ci` gives us.
- You don't need Node.js on your machine to run the container - it
  brings its own copy from the `node:18-slim` base image. Node.js is
  only needed on the host for the optional local verification step.
- If you change `main.js` and want to see the change, you have to
  **rebuild** the image (`docker build` again) - a running container
  doesn't magically pick up new code from your disk. That's the
  price of isolation, and it's exactly why later stages introduce
  volumes and compose.

## How to change code if Container already running at Stage 1

```bash
# Stop Container
docker stop <container_id_or_name>
# Remove Container
docker rm <container_id_or_name>
# Build Image after code changes
docker build -t hello-docker-01 .
# Run the Container
docker run -p 8000:8000 --name container-node-app hello-docker-01
```

## Clean up when finished

Stopping a container frees its port, but leaves the stopped container on
your machine. Remove it when you no longer need it:

```bash
docker ps -a                    # find the container ID or name
docker stop <container_id_or_name> # only if it is still running
docker rm <container_id_or_name>
```

Removing the image is optional; you can keep `hello-docker-01` for later.
If you do want to remove it, remove containers created from it first:

```bash
docker rmi hello-docker-01
```

## Viewing Images & Containers in Docker Desktop

Instead of using CLI commands, you can also view and manage everything visually in Docker Desktop:

- **Images tab** - see all built images (including `hello-docker-01`), their size, and creation date. You can also delete images from here.
- **Containers tab** - see running and stopped containers, their status, port mappings, and logs. You can start, stop, restart, or delete a container with a single click.
- Click on a container to view **live logs** - useful for seeing the same output you'd get from `docker logs <container_name>`, without needing the terminal.

## Next stage

[`02-push-pull-registry`](../02-push-pull-registry) - take this same
image and share it with the outside world via a registry.