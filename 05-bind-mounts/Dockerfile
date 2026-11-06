# --- Stage 5: an image for DEVELOPING the app ---
# The Dockerfile barely changes. The new idea lives in docker-compose.yml:
# instead of baking main.js into the image and rebuilding after every edit,
# we mount your local code into the running container.

FROM node:18-slim

WORKDIR /app

# Copy dependency files first so Docker can cache this layer separately
# from your application code.
COPY package.json package-lock.json ./

# Unlike earlier stages, there is NO "--omit=dev" here. nodemon, the tool
# that restarts the app when a file changes, is a devDependency and we
# need it inside this development container.
RUN npm ci

# The code is still copied in, so this image also works on its own,
# without any mount. When the bind mount is active, the mounted folder
# covers this copy.
COPY main.js ./

# Documentation only — doesn't publish the port.
EXPOSE 8000

CMD [ "node", "main.js" ]
