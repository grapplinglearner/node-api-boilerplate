import { Router, Response } from 'express';
import { InventoryTransferService } from '../../domain/services/InventoryTransferService';
import {
  InitiateTransferUseCase,
  MarkTransferAsInTransitUseCase,
  CompleteTransferUseCase,
  GetPendingTransfersUseCase,
  ListAllTransfersUseCase,
} from '../../application/usecases/InventoryTransferUseCases';
import { AuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { Permission } from '../../domain/types/auth';

export function createTransferRoutes(transferService: InventoryTransferService, authMiddleware: AuthMiddleware): Router {
  const router = Router();

  const initiateTransferUseCase = new InitiateTransferUseCase(transferService);
  const markInTransitUseCase = new MarkTransferAsInTransitUseCase(transferService);
  const completeTransferUseCase = new CompleteTransferUseCase(transferService);
  const getPendingUseCase = new GetPendingTransfersUseCase(transferService);
  const listAllUseCase = new ListAllTransfersUseCase(transferService);

  router.post('/', authMiddleware.requirePermission(Permission.CREATE_TRANSFERS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const transfer = await initiateTransferUseCase.execute({
        id: req.body.id,
        productId: req.body.productId,
        fromWarehouseId: req.body.fromWarehouseId,
        toWarehouseId: req.body.toWarehouseId,
        quantity: req.body.quantity,
      });
      return res.status(201).json(transfer);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.patch('/:id/in-transit', authMiddleware.requirePermission(Permission.UPDATE_TRANSFERS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const transfer = await markInTransitUseCase.execute(id);
      return res.json(transfer);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.patch('/:id/complete', authMiddleware.requirePermission(Permission.UPDATE_TRANSFERS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const transfer = await completeTransferUseCase.execute(id);
      return res.json(transfer);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/pending', authMiddleware.requirePermission(Permission.READ_TRANSFERS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const transfers = await getPendingUseCase.execute();
      return res.json(transfers);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  router.get('/', authMiddleware.requirePermission(Permission.READ_TRANSFERS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const transfers = await listAllUseCase.execute();
      return res.json(transfers);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}
