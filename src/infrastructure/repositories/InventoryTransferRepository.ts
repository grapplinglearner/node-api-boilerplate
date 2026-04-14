import { InventoryTransfer, TransferStatus } from '../../domain/entities/InventoryTransfer';
import { IInventoryTransferRepository } from '../../domain/repositories/IRepository';
import { InventoryTransferModel, IInventoryTransferDocument } from '../database/schemas/schemas';

export class InventoryTransferRepository implements IInventoryTransferRepository {
  private mapToEntity(doc: IInventoryTransferDocument): InventoryTransfer {
    return new InventoryTransfer(
      doc._id.toString(),
      doc.productId,
      doc.fromWarehouseId,
      doc.toWarehouseId,
      doc.quantity,
      doc.status as TransferStatus,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findById(id: string): Promise<InventoryTransfer | null> {
    const doc = await InventoryTransferModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<InventoryTransfer[]> {
    const docs = await InventoryTransferModel.find({ deletedAt: null });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findAllPaginated(skip: number, limit: number): Promise<InventoryTransfer[]> {
    const docs = await InventoryTransferModel.find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async count(): Promise<number> {
    return InventoryTransferModel.countDocuments({ deletedAt: null });
  }

  async save(transfer: InventoryTransfer): Promise<InventoryTransfer> {
    const docData: any = {
      productId: transfer.productId,
      fromWarehouseId: transfer.fromWarehouseId,
      toWarehouseId: transfer.toWarehouseId,
      quantity: transfer.quantity,
      status: transfer.status,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
    };

    if (transfer.id && transfer.id.trim() !== '') {
      docData._id = transfer.id;
    }

    const doc = await InventoryTransferModel.create(docData);
    return this.mapToEntity(doc);
  }

  async update(transfer: InventoryTransfer): Promise<InventoryTransfer> {
    const doc = await InventoryTransferModel.findByIdAndUpdate(
      transfer.id,
      {
        status: transfer.status,
        updatedAt: transfer.updatedAt,
      },
      { new: true }
    );

    if (!doc) {
      throw new Error(`Transfer with ID ${transfer.id} not found`);
    }

    return this.mapToEntity(doc);
  }

  async findByStatus(status: string): Promise<InventoryTransfer[]> {
    const docs = await InventoryTransferModel.find({ status });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findByFromWarehouse(warehouseId: string): Promise<InventoryTransfer[]> {
    const docs = await InventoryTransferModel.find({ fromWarehouseId: warehouseId });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findByToWarehouse(warehouseId: string): Promise<InventoryTransfer[]> {
    const docs = await InventoryTransferModel.find({ toWarehouseId: warehouseId, deletedAt: null });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async softDelete(id: string): Promise<void> {
    await InventoryTransferModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  }
}
