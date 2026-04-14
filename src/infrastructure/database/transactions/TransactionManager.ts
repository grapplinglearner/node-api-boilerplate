import mongoose from 'mongoose';
import logger from '../../logging/logger';

export class TransactionManager {
  static async executeInTransaction<T>(
    operation: (session: mongoose.ClientSession) => Promise<T>
  ): Promise<T> {
    const session = await mongoose.startSession();

    try {
      let result: T;

      await session.withTransaction(async () => {
        result = await operation(session);
      });

      return result!;
    } catch (error) {
      logger.error('Transaction failed', { error });
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Operation failed (attempt ${attempt}/${maxRetries})`, { error });

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw lastError!;
  }
}