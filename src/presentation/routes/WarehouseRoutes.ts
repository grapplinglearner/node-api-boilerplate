import { Router, Request, Response } from 'express';
import { WarehouseService } from '../../domain/services/WarehouseService';
import { CreateWarehouseUseCase, GetWarehouseUseCase, ListWarehousesUseCase, UpdateWarehouseUseCase, DeleteWarehouseUseCase, GetWarehouseCapacityUseCase } from '../../application/usecases/WarehouseUseCases';
import { AuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { Permission } from '../../domain/types/auth';
import { validate, warehouseSchemas } from '../middleware/validation/schemas';

export function createWarehouseRoutes(warehouseService: WarehouseService, authMiddleware: AuthMiddleware): Router {
  const router = Router();

  const createWarehouseUseCase = new CreateWarehouseUseCase(warehouseService);
  const getWarehouseUseCase = new GetWarehouseUseCase(warehouseService);
  const listWarehousesUseCase = new ListWarehousesUseCase(warehouseService);
  const updateWarehouseUseCase = new UpdateWarehouseUseCase(warehouseService);
  const deleteWarehouseUseCase = new DeleteWarehouseUseCase(warehouseService);
  const getCapacityUseCase = new GetWarehouseCapacityUseCase(warehouseService);

  router.post('/', authMiddleware.requirePermission(Permission.CREATE_WAREHOUSES), validate(warehouseSchemas.create), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const warehouse = await createWarehouseUseCase.execute({
        id: req.body.id,
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity,
      });
      return res.status(201).json(warehouse);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/:id', authMiddleware.requirePermission(Permission.READ_WAREHOUSES), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const warehouse = await getWarehouseUseCase.execute(id);
      return res.json(warehouse);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  });

  router.get('/', authMiddleware.requirePermission(Permission.READ_WAREHOUSES), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const warehouses = await listWarehousesUseCase.execute();
      return res.json(warehouses);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  router.put('/:id', authMiddleware.requirePermission(Permission.UPDATE_WAREHOUSES), validate(warehouseSchemas.update), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const warehouse = await updateWarehouseUseCase.execute(id, {
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity,
      });
      return res.json(warehouse);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.delete('/:id', authMiddleware.requirePermission(Permission.DELETE_WAREHOUSES), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await deleteWarehouseUseCase.execute(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/:id/capacity', authMiddleware.requirePermission(Permission.READ_WAREHOUSES), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const capacity = await getCapacityUseCase.execute(id);
      return res.json(capacity);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
