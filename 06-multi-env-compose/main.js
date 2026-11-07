const express = require('express');
const app = express();

// Docker containers don't know what port your app "should" use — you tell
// it via an environment variable. We default to 8000 for local runs where
// no env var is set.
const PORT = process.env.PORT || 8000;

// Each Compose environment sets NODE_ENV differently, so the response
// tells you which setup you are talking to.
const ENVIRONMENT = process.env.NODE_ENV || 'unknown';

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from inside a Docker container! - 06-multi-env-compose',
    environment: ENVIRONMENT,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (${ENVIRONMENT})`);
});
