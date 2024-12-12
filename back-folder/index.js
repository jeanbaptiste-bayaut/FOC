import 'dotenv/config';
import { createServer } from 'http';
import app from './app/index.app.js';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger.js';
import { connectClient } from './app/config/config.client.js';

const httpServer = createServer(app);

// Serve the Swagger documentation at /api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT;

// Main function to start the server and connect to the database
(async () => {
  try {
    await connectClient(); // connection to database
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server launched at http://localhost:${PORT} 🚀`);
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
    process.exit(1); // exit if error
  }
})();
