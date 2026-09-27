# Stage 2 - Push & Pull from a Registry

## What's new in this stage

The application behavior is unchanged: `main.js` is byte-for-byte
identical to [`01-hello-docker`](../01-hello-docker). The package
metadata and Dockerfile comments differ slightly. Compare the app
entry points yourself:

```bash
diff ../01-hello-docker/main.js main.js
diff ../01-hello-docker/Dockerfile Dockerfile
# (no output = no differences)
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
# 1. Build the image, same as stage 1
cd 02-push-pull-registry
docker build -t hello-docker .

# 2. Log in to Docker Hub (Docker Desktop credentials may already be available)
docker login

# 3. Tag the image with your Docker Hub namespace, repository, and version
docker tag hello-docker yourusername/hello-docker:0.0.1

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

The tagged image appears in Docker Desktop under the Images tab as
`yourusername/hello-docker`.

Now go check [hub.docker.com](https://hub.docker.com/) - your image
is there. 

Anyone (including you, on a different machine) can now run:

```bash
# Optional: download the image without starting a container
docker pull yourusername/hello-docker:0.0.1

# Run the image. If it isn't already on this machine, Docker pulls it
# automatically before starting the container.
docker run -p 8000:8000 yourusername/hello-docker:0.0.1
```

For a private repository, first run `docker login` with an account that
has permission to pull the image. The pull and run steps do not require
this source repository or Node.js on the machine.

Then in another terminal:

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container!"}
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

`03-docker-compose` *(coming soon)* - replace the long `docker run`
command with a single config file.