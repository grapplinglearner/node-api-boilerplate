import mongoose from 'mongoose';

export default class DbConnection {
  static async connect(mongoUri: string): Promise<void> {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
