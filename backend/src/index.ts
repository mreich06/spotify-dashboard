import dotenv from 'dotenv';
import app from './app';

// Express server setup for env, cors and to run on port 4000
// imports app and starts server
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
