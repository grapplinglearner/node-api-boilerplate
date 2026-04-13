export enum TransferStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface IInventoryTransfer {
  id: string;
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  status: TransferStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class InventoryTransfer {
  constructor(
    public id: string,
    public productId: string,
    public fromWarehouseId: string,
    public toWarehouseId: string,
    public quantity: number,
    public status: TransferStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateTransfer();
  }

  private validateTransfer(): void {
    if (!this.productId || this.productId.trim() === '') {
      throw new Error('Product ID is required');
    }

    if (this.fromWarehouseId === this.toWarehouseId) {
      throw new Error('Source and destination warehouses cannot be the same');
    }

    if (this.quantity <= 0) {
      throw new Error('Transfer quantity must be positive');
    }
  }

  initiate(): void {
    if (this.status !== TransferStatus.PENDING) {
      throw new Error('Only pending transfers can be initiated');
    }
    this.status = TransferStatus.IN_TRANSIT;
    this.updatedAt = new Date();
  }

  complete(): void {
    if (this.status !== TransferStatus.IN_TRANSIT) {
      throw new Error('Only in-transit transfers can be completed');
    }
    this.status = TransferStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  fail(): void {
    if (this.status === TransferStatus.COMPLETED) {
      throw new Error('Cannot fail a completed transfer');
    }
    this.status = TransferStatus.FAILED;
    this.updatedAt = new Date();
  }
}
