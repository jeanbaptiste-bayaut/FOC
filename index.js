import 'dotenv/config';
import { createServer } from 'http';
import app from './app/index.app.js';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger.js';

const httpServer = createServer(app);

// Serve the Swagger documentation at /api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server launched at http://localhost:${PORT} 🚀`);
});
