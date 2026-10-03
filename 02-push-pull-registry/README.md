# Stage 2 - Push & Pull from a Registry

## What's new in this stage

Both stages serve the same endpoint, but Stage 2 adds a lesson label to
the response message. The Dockerfiles also have small differences. Compare
the files yourself:

```bash
diff ../01-hello-docker/main.js main.js
diff ../01-hello-docker/Dockerfile Dockerfile
# The output shows the differences between the two stages.
```

The only new thing this stage teaches is: **how an image gets from
your machine to somewhere else.**

## The idea in one sentence

A registry (Docker Hub, GHCR, ACR, etc.) is just a storage/distribution
service for images - like GitHub, but for images instead of code.

## Try it

You'll need a free [Docker Hub](https://hub.docker.com/) account for
this. Replace `yourusername` below with your actual Docker Hub
username. Docker Hub can create the `hello-docker` repository on your
first push if it doesn't already exist. Choose its visibility in Docker
Hub: public images can be pulled by anyone, while private images require
authorized access.

```bash
# 1. Build the image with a distinct local name
cd 02-push-pull-registry
docker build -t hello-docker-02 .

# 2. Log in to Docker Hub (Docker Desktop credentials may already be available)
docker login

# 3. Tag the image with your Docker Hub namespace, repository, and version
docker tag hello-docker-02 yourusername/hello-docker:0.0.1

# 4. Push it
docker push yourusername/hello-docker:0.0.1
```
This uploads the `0.0.1` tag to your `hello-docker` repository.

The tag gives the local image a registry-qualified name:
`yourusername` is your Docker Hub namespace, `hello-docker` is the
repository, and `0.0.1` identifies this version. Docker Hub uses that
name to route the push, and other machines use it to retrieve the image.
You can publish multiple version tags for the same repository, making
it clear which build to pull instead of relying on a changeable `latest`
tag.

Tags are mutable: pushing a different image to the same tag, such as
`0.0.1`, moves that tag to the new image. Anyone pulling `0.0.1` afterward
will get the new image, not the earlier one. To keep a published version
available under its original name, give the changed image a new version
tag and push that instead. For example, after rebuilding a changed image:

```bash
docker tag hello-docker-02 yourusername/hello-docker:0.0.2
docker push yourusername/hello-docker:0.0.2
```

Use a new version tag for each release you want to keep addressable; do
not push a changed build to an existing version tag.

The tagged image appears in Docker Desktop under the Images tab as
`yourusername/hello-docker`.

Now go check [hub.docker.com](https://hub.docker.com/) - your image
is there. 

Anyone (including you, on a different machine) can now run:

```bash
# Optional: download the image from docker hub to local without starting a container
docker pull yourusername/hello-docker:0.0.1

# Run the image. If it isn't already on this machine, Docker pulls it
# automatically before starting the container.
docker run -p 8000:8000 yourusername/hello-docker:0.0.1
```

If host port `8000` is already in use, either stop the other container or
map a different host port to the app's container port `8000`:

```bash
docker run -p 8001:8000 yourusername/hello-docker:0.0.1
```

Then open `http://localhost:8001/`. The left port is on your machine; the
right port is inside the container. This lets you run Stage 1 and Stage 2
at the same time on different host ports. You do not need to delete the
Stage 1 image to build or run Stage 2; their local image names are distinct.
For this alternate mapping, use `curl http://localhost:8001/`.

For a private repository, first run `docker login` with an account that
has permission to pull the image. The pull and run steps do not require
this source repository or Node.js on the machine.

Then in another terminal:

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 02-push-pull-registry"}
```

## Stop and clean up

Stop the container with `Ctrl+C` in the terminal running it, or find it
and stop it from another terminal. Removing the container frees its host
port; the image can stay on your machine for reuse.

```bash
docker ps -a                    # find the container ID or name
docker stop <container_id_or_name> # only if it is still running
docker rm <container_id_or_name>
```

## Things worth noticing

- The pull and run steps don't need this repo, `npm install`, or even
  Node.js installed on the machine. That's the point of an image - it's
  the deployable unit, not the source code.
- We used the tag `0.0.1`, not `latest`. Specific version tags make it
  possible to pull and run a known build consistently. `latest` is just
  a mutable tag, not a guarantee that the image is the newest version.
  Later stages (CI/CD, ACR) also depend on tags being specific and
  traceable.
- `docker tag` doesn't create a new image - it adds another name to the
  same local image, similar to a git branch pointing at a commit.

## Next stage

[`03-docker-compose`](../03-docker-compose) - learn Compose as an
alternative way to configure and run the local app from stage 1. It is a
separate concept from this stage's registry push/pull workflow.