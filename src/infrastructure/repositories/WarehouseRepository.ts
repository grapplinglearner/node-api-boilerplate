import { Warehouse } from '../../domain/entities/Warehouse';
import { IWarehouseRepository } from '../../domain/repositories/IRepository';
import { WarehouseModel, IWarehouseDocument } from '../database/schemas/schemas';

export class WarehouseRepository implements IWarehouseRepository {
  private mapToEntity(doc: IWarehouseDocument): Warehouse {
    return new Warehouse(
      doc._id.toString(),
      doc.name,
      doc.location,
      doc.capacity,
      doc.currentUsage,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findById(id: string): Promise<Warehouse | null> {
    const doc = await WarehouseModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<Warehouse[]> {
    const docs = await WarehouseModel.find({ deletedAt: null });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findAllPaginated(skip: number, limit: number): Promise<Warehouse[]> {
    const docs = await WarehouseModel.find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async count(): Promise<number> {
    return WarehouseModel.countDocuments({ deletedAt: null });
  }

  async save(warehouse: Warehouse): Promise<Warehouse> {
    const docData: any = {
      name: warehouse.name,
      location: warehouse.location,
      capacity: warehouse.capacity,
      currentUsage: warehouse.currentUsage,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
    };

    if (warehouse.id && warehouse.id.trim() !== '') {
      docData._id = warehouse.id;
    }

    const doc = await WarehouseModel.create(docData);
    return this.mapToEntity(doc);
  }

  async update(warehouse: Warehouse): Promise<Warehouse> {
    const doc = await WarehouseModel.findByIdAndUpdate(
      warehouse.id,
      {
        name: warehouse.name,
        location: warehouse.location,
        capacity: warehouse.capacity,
        currentUsage: warehouse.currentUsage,
        updatedAt: warehouse.updatedAt,
      },
      { new: true }
    );

    if (!doc) {
      throw new Error(`Warehouse with ID ${warehouse.id} not found`);
    }

    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await WarehouseModel.findByIdAndDelete(id);
  }

  async softDelete(id: string): Promise<void> {
    await WarehouseModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  }
}
