import { InventoryTransferService } from '../../domain/services/InventoryTransferService';

export class InitiateTransferUseCase {
  constructor(private transferService: InventoryTransferService) {}

  async execute(input: {
    id: string;
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
  }): Promise<ReturnType<InventoryTransferService['initiateTransfer']>> {
    return this.transferService.initiateTransfer(
      input.id,
      input.productId,
      input.fromWarehouseId,
      input.toWarehouseId,
      input.quantity
    );
  }
}

export class MarkTransferAsInTransitUseCase {
  constructor(private transferService: InventoryTransferService) {}

  async execute(transferId: string): Promise<ReturnType<InventoryTransferService['markAsInTransit']>> {
    return this.transferService.markAsInTransit(transferId);
  }
}

export class CompleteTransferUseCase {
  constructor(private transferService: InventoryTransferService) {}

  async execute(transferId: string): Promise<ReturnType<InventoryTransferService['completeTransfer']>> {
    return this.transferService.completeTransfer(transferId);
  }
}

export class FailTransferUseCase {
  constructor(private transferService: InventoryTransferService) {}

  async execute(transferId: string): Promise<ReturnType<InventoryTransferService['failTransfer']>> {
    return this.transferService.failTransfer(transferId);
  }
}

export class GetPendingTransfersUseCase {
  constructor(private transferService: InventoryTransferService) {}

  async execute(): Promise<ReturnType<InventoryTransferService['getPendingTransfers']>> {
    return this.transferService.getPendingTransfers();
  }
}

export class ListAllTransfersUseCase {
  constructor(private transferService: InventoryTransferService) {}

  async execute(): Promise<ReturnType<InventoryTransferService['getAllTransfers']>> {
    return this.transferService.getAllTransfers();
  }
}
