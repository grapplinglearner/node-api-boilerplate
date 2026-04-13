import { DbConnection } from './infrastructure/database/connection';
import type { Application } from 'express';

async function startServer({ MONGODB_URI, app, PORT = 3000 }: { MONGODB_URI: string; app: Application; PORT: number | string }): Promise<void> {
  try {
    await DbConnection.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`✓ Server running on port http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

export { startServer };