const express = require('express');
const app = express();

// Docker containers don't know what port your app "should" use — you tell
// it via an environment variable. We default to 8000 for local runs where
// no env var is set.
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  // Try it: change this message while the container is running and save
  // the file. With the bind mount in docker-compose.yml, the change shows
  // up without rebuilding the image.
  res.json({ message: 'Hello from inside a Docker container! - 05-bind-mounts' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
