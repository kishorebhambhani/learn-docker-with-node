# Stage 4 - Multi-container Compose

## What's new in this stage

Stage 3 ran one service. This stage adds a **second service, Redis**, and
connects the two. The only new idea is:

> Containers in the same Compose project share a private network, and each
> one can reach the others by their **service name**.

Redis is used because it needs no schema and starts almost instantly, so
nothing competes with the networking lesson.

## The idea in one sentence

Inside Compose, the hostname `redis` means "the container running the
`redis` service" - no IP addresses, no manual network setup.

## What changed

```yaml
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
      - REDIS_HOST=redis     # <- the service name below
    depends_on:
      - redis

  redis:
    image: redis:7-alpine    # <- an existing image, no Dockerfile needed
```

`main.js` is still the Node/Express app from the earlier stages, but now it
asks Redis to keep a visit count. Redis is a small data store: for this
example, it remembers one number under the key `visits`.

## What Compose creates when you start the project

Run `docker compose up --build` and Compose reads the two entries under
`services`. A service is the description of a program Compose should run; it
is not itself a container. For this project, Compose prepares and starts:

1. **The app image.** `build: .` tells Compose to build an image using this
   folder's `Dockerfile`. The image contains the Node app and its dependencies.
2. **The Redis image.** `image: redis:7-alpine` tells Compose to use the
   official Redis image published on Docker Hub. Docker downloads ("pulls")
   it from Docker Hub if it is not already available on your machine. The
   short name `redis:7-alpine` is Docker's shorthand for
   `docker.io/library/redis:7-alpine`. Redis needs no Dockerfile in this
   project. After the first pull, Docker can reuse the local image, so a
   later `docker compose up` may not show a `Pulled` step.
3. **A private network.** Compose creates a default network for this project
   and attaches both service containers to it. No network configuration is
   needed in the YAML.
4. **Two containers.** Compose creates one running container from each image:
   the `app` container and the `redis` container. The images are the
   blueprints; the containers are the running instances.

The startup output will include lines similar to these (the project-name
prefix comes from the folder name and can differ if you set a custom project
name):

```text
Image redis:7-alpine                         Pulled
Image 04-multi-container-compose-app          Built
Network 04-multi-container-compose_default    Created
Container 04-multi-container-compose-redis-1  Created
Container 04-multi-container-compose-app-1    Created
```

The `redis` container is created from the Redis image, even though this
project does not build that image. The names in the startup output are full
container names. Compose forms them from the project name, service name, and
instance number:

```text
04-multi-container-compose-redis-1
└─ project name ─────────┘└service┘└instance
```

The app's full container name follows the same pattern:
`04-multi-container-compose-app-1`. The service names in the YAML are just
`app` and `redis`; those shorter names are also the network hostnames. This
is why the app connects to `redis:6379`, not to the full container name:

```text
your machine -- http://localhost:8000 --> app container
                                          |
                              private Compose network
                                          |
app container -- redis:6379 ------------> redis container
```

The `ports: "8000:8000"` mapping publishes the app's port to your machine;
it does not publish Redis. The app-to-Redis connection stays inside the
Compose network. To see both running containers, use
`docker compose ps`; to see the network Compose created, use
`docker network ls`.

Docker Desktop may display the same containers differently from the
terminal. It groups Compose resources under the project name
`04-multi-container-compose`, then shows the service containers beneath it
with shorter labels such as `redis-1` and `app-1`. Those are the same
containers named `04-multi-container-compose-redis-1` and
`04-multi-container-compose-app-1` in the terminal; the project prefix is
shown once as the group heading instead of repeated on each row. In
Docker Desktop's **Images** view, `redis:7-alpine` is the downloaded image;
in **Containers**, `redis-1` is the running or stopped container made from
that image.

If Docker Desktop says **No containers are running** but still lists this
Compose project, the containers exist but are stopped. This can happen after
you press `Ctrl+C` to stop foreground `docker compose up`. While `docker
compose up` is running, both should show as running. Check their exact names
and status in the terminal with:

```bash
docker compose ps -a
```

## What `main.js` does

The Compose file starts two separate programs:

- **`app`** runs `main.js` and serves HTTP requests on port 8000.
- **`redis`** runs Redis and stores the visit count.

The important parts of `main.js` are easier to follow in the order they run:

1. **Read settings.** The app reads `PORT` and `REDIS_HOST` from environment
   variables. Compose sets `REDIS_HOST=redis`, matching the Redis service name
   in `docker-compose.yml`. The app uses that name to find Redis; it does not
   need to know Redis' IP address.
2. **Create a Redis client.** `createClient(...)` prepares a client using the
   host and port. This creates the app's connection settings; it is not the
   Redis server itself. Redis is running in the other container.
3. **Connect before serving requests.** The `start()` function connects to
   Redis, then starts the Express server. The app can therefore use Redis when
   a request arrives.
4. **Count each visit.** When a browser or `curl` requests `/`, the route runs
   `redis.incr('visits')`. Redis increases the value stored under `visits` and
   returns the new number. The app sends that number back in its JSON response.

In short, the request travels like this:

```text
browser/curl -> app (Express) -> redis (INCR visits) -> app -> response
```

The app does not keep the count in a JavaScript variable. Redis owns the count,
and the app asks Redis to update it for every request. This keeps the count
outside the app process, so restarting the app does not reset it while Redis
is still running.

Most of the Express code should look familiar from Stage 3: it still defines a
route and returns JSON. The new pieces are creating and connecting the Redis
client, and awaiting Redis' response inside the route. The main learning goal
here is how the app reaches the other service by its Compose service name.

## Prerequisites

- **Docker Desktop** - must be running before any `docker` command.
- Node.js is **not** needed; everything runs in containers.

## How to test

```bash
cd 04-multi-container-compose
docker compose up --build
```

In another terminal, call the app a few times:

```bash
curl http://localhost:8000/
# {"message":"Hello from inside a Docker container! - 04-multi-container-compose","visits":1}
curl http://localhost:8000/
# ... "visits":2
```

Each response increases `visits`, proving the app reached Redis.

Look inside Redis yourself:

```bash
docker compose exec redis redis-cli get visits
# "2"
```

Stop everything with `Ctrl+C` (foreground) and then:

```bash
docker compose down
```

## Things worth noticing

- **The app uses `redis`, not `localhost`.** Inside the app container,
  `localhost` is the app container itself. Try changing `REDIS_HOST` to
  `localhost` and run `docker compose up --build` again: the app will log
  connection errors.
- **Redis has no `ports:` section.** The app reaches it over the Compose
  network, but your machine cannot. Publish only what needs to be public.
- **`depends_on` controls start order only.** It does not wait until Redis is
  ready to accept connections. `main.js` retries its connection, so this
  works regardless of timing.
- **The counter resets after `docker compose down`.** The Redis container is
  removed and a new one starts empty. Keeping data across containers is
  what stage 7 covers.

## Useful commands

```bash
docker compose ps                       # both services and their status
docker compose logs -f app              # follow one service's logs
docker compose exec redis redis-cli     # open a Redis shell in the container
docker network ls                       # see the network Compose created
```

## What's next

[`05-bind-mounts`](../05-bind-mounts) - stop rebuilding the image every time
you edit your code, by mounting your local files into the container.
