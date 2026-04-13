import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { ApplicationContainer } from './presentation/ApplicationContainer';
import { createProductRoutes, createWarehouseRoutes, createTransferRoutes } from './presentation/routes';
import { createAuthRoutes } from './presentation/routes/AuthRoutes';

import { startServer } from './server';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/warehouse_db';

app.use(cors());
app.use(express.json());

const container = new ApplicationContainer();

app.use('/api/auth', createAuthRoutes(
  container.getAuthenticationService(),
  container.getAuthorizationService(),
  container.getUserRepository()
));
app.use('/api/products', createProductRoutes(container.getProductService(), container.getAuthMiddleware()));
app.use('/api/warehouses', createWarehouseRoutes(container.getWarehouseService(), container.getAuthMiddleware()));
app.use('/api/transfers', createTransferRoutes(container.getTransferService(), container.getAuthMiddleware()));

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  return res.status(500).json({ error: 'Internal server error' });
});

startServer({ MONGODB_URI, app, PORT });
