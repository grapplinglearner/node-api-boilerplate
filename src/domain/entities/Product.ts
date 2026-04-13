export interface IProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  quantity: number;
  warehouseLocation: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  constructor(
    public id: string,
    public name: string,
    public sku: string,
    public description: string,
    public price: number,
    public quantity: number,
    public warehouseLocation: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateProduct();
  }

  private validateProduct(): void {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Product name is required');
    }

    if (!this.sku || this.sku.trim() === '') {
      throw new Error('Product SKU is required');
    }

    if (this.price < 0) {
      throw new Error('Product price cannot be negative');
    }

    if (this.quantity < 0) {
      throw new Error('Product quantity cannot be negative');
    }
  }

  isInStock(): boolean {
    return this.quantity > 0;
  }

  updateStock(amount: number): void {
    if (this.quantity + amount < 0) {
      throw new Error('Insufficient stock for this operation');
    }
    this.quantity += amount;
    this.updatedAt = new Date();
  }

  getStockStatus(): string {
    if (this.quantity === 0) {
      return 'OUT_OF_STOCK';
    }
    if (this.quantity < 10) {
      return 'LOW_STOCK';
    }
    return 'IN_STOCK';
  }
}
