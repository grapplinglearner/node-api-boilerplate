import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IRepository';
import { UserModel, IUserDocument } from '../database/schemas/schemas';
import { UserRole } from '../../domain/types/auth';

export class UserRepository implements IUserRepository {
  private mapToEntity(doc: IUserDocument): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.passwordHash,
      doc.name,
      doc.role as UserRole,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find({ deletedAt: null });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findAllPaginated(skip: number, limit: number): Promise<User[]> {
    const docs = await UserModel.find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async count(): Promise<number> {
    return UserModel.countDocuments({ deletedAt: null });
  }

  async save(user: User): Promise<User> {
    const docData: any = {
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.id && user.id.trim() !== '') {
      docData._id = user.id;
    }

    const doc = await UserModel.create(docData);
    return this.mapToEntity(doc);
  }

  async update(user: User): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(
      user.id,
      {
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role,
        updatedAt: user.updatedAt,
      },
      { new: true }
    );

    if (!doc) {
      throw new Error(`User with ID ${user.id} not found`);
    }

    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async softDelete(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  }
}
