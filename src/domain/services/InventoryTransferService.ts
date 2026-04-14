import { InventoryTransfer, TransferStatus } from '../entities/InventoryTransfer';
import { IInventoryTransferRepository, IProductRepository, IWarehouseRepository } from '../repositories/IRepository';
import { EmailService } from '../../infrastructure/email/EmailService';

export class InventoryTransferService {
  constructor(
    private transferRepository: IInventoryTransferRepository,
    private productRepository: IProductRepository,
    private warehouseRepository: IWarehouseRepository,
    private emailService?: EmailService
  ) {}

  async initiateTransfer(
    id: string,
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number
  ): Promise<InventoryTransfer> {

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (product.quantity < quantity) {
      throw new Error(
        `Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}`
      );
    }

    const fromWarehouse = await this.warehouseRepository.findById(fromWarehouseId);
    if (!fromWarehouse) {
      throw new Error(`Source warehouse with ID ${fromWarehouseId} not found`);
    }

    const toWarehouse = await this.warehouseRepository.findById(toWarehouseId);
    if (!toWarehouse) {
      throw new Error(`Destination warehouse with ID ${toWarehouseId} not found`);
    }

    if (!toWarehouse.isCapacityAvailable(quantity)) {
      throw new Error('Destination warehouse does not have sufficient capacity');
    }

    const transfer = new InventoryTransfer(
      id,
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      TransferStatus.PENDING,
      new Date(),
      new Date()
    );

    return this.transferRepository.save(transfer);
  }

  async getTransfer(id: string): Promise<InventoryTransfer> {
    const transfer = await this.transferRepository.findById(id);
    if (!transfer) {
      throw new Error(`Transfer with ID ${id} not found`);
    }
    return transfer;
  }

  async getAllTransfers(): Promise<InventoryTransfer[]> {
    return this.transferRepository.findAll();
  }

  async markAsInTransit(id: string): Promise<InventoryTransfer> {
    const transfer = await this.getTransfer(id);
    transfer.initiate();

    const product = await this.productRepository.findById(transfer.productId);
    if (!product) {
      throw new Error(`Product not found`);
    }
    product.updateStock(-transfer.quantity);
    await this.productRepository.update(product);

    return this.transferRepository.update(transfer);
  }

  async completeTransfer(id: string): Promise<InventoryTransfer> {
    const transfer = await this.getTransfer(id);

    if (transfer.status !== TransferStatus.IN_TRANSIT) {
      throw new Error('Only in-transit transfers can be completed');
    }

    const product = await this.productRepository.findById(transfer.productId);
    if (!product) {
      throw new Error(`Product not found`);
    }

    product.updateStock(transfer.quantity);
    product.warehouseLocation = transfer.toWarehouseId;
    await this.productRepository.update(product);

    transfer.complete();
    return this.transferRepository.update(transfer);
  }

  async failTransfer(id: string): Promise<InventoryTransfer> {
    const transfer = await this.getTransfer(id);

    if (transfer.status === TransferStatus.IN_TRANSIT) {
      const product = await this.productRepository.findById(transfer.productId);
      if (product) {
        product.updateStock(transfer.quantity);
        await this.productRepository.update(product);
      }
    }

    transfer.fail();
    return this.transferRepository.update(transfer);
  }

  async getTransfersByStatus(status: TransferStatus): Promise<InventoryTransfer[]> {
    return this.transferRepository.findByStatus(status);
  }

  async getPendingTransfers(): Promise<InventoryTransfer[]> {
    return this.transferRepository.findByStatus(TransferStatus.PENDING);
  }
}
