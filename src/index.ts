import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { ApplicationContainer } from './presentation/ApplicationContainer';
import { createProductRoutes, createWarehouseRoutes, createTransferRoutes } from './presentation/routes';
import { createAuthRoutes } from './presentation/routes/AuthRoutes';
import { generalRateLimit, authRateLimit } from './presentation/middleware/rateLimit';
import { apiVersioning } from './presentation/middleware/versioning/apiVersioning';
import { metricsMiddleware, metricsHandler } from './infrastructure/monitoring/MonitoringService';
import { specs } from './infrastructure/docs/swagger';
import { upload } from './infrastructure/uploads/uploadService';
import logger from './infrastructure/logging/logger';
import { CacheService } from './infrastructure/cache/CacheService';
import { EmailService } from './infrastructure/email/EmailService';

import { startServer } from './server';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/warehouse_db';

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);
app.use(apiVersioning);
app.use(generalRateLimit);

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/metrics', metricsHandler);

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
});

const container = new ApplicationContainer();

const cacheService = new CacheService();
const emailService = new EmailService();

cacheService.connect().catch(err => logger.error('Failed to connect to cache', err));

app.use('/api/auth', authRateLimit);

app.use('/api/auth', createAuthRoutes(
  container.getAuthenticationService(),
  container.getAuthorizationService(),
  container.getUserRepository()
));
app.use('/api/products', createProductRoutes(container.getProductService(), container.getAuthMiddleware()));
app.use('/api/warehouses', createWarehouseRoutes(container.getWarehouseService(), container.getAuthMiddleware()));
app.use('/api/transfers', createTransferRoutes(container.getTransferService(), container.getAuthMiddleware()));

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      cache: cacheService.isReady,
      email: emailService.isReady,
    },
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  return res.status(500).json({ error: 'Internal server error' });
});

startServer({ MONGODB_URI, app, PORT });
