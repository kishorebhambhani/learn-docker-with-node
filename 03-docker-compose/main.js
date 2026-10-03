const express = require('express');
const app = express();

// Docker containers don't know what port your app "should" use — you tell
// it via an environment variable. We default to 8000 for local runs where
// no env var is set.
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from inside a Docker container! - 03-docker-compose' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
