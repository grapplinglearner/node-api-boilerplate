import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

export const productSchemas = {
  create: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).required(),
    sku: Joi.string().required(),
    description: Joi.string().allow(''),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(0).required(),
    warehouseLocation: Joi.string().required(),
  }),

  update: Joi.object({
    name: Joi.string().min(1),
    sku: Joi.string(),
    description: Joi.string().allow(''),
    price: Joi.number().min(0),
    quantity: Joi.number().integer().min(0),
    warehouseLocation: Joi.string(),
  }),
};

export const warehouseSchemas = {
  create: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).required(),
    location: Joi.string().min(1).required(),
    capacity: Joi.number().integer().min(1).required(),
  }),

  update: Joi.object({
    name: Joi.string().min(1),
    location: Joi.string().min(1),
    capacity: Joi.number().integer().min(1),
  }),
};

export const transferSchemas = {
  create: Joi.object({
    id: Joi.string().required(),
    productId: Joi.string().required(),
    fromWarehouseId: Joi.string().required(),
    toWarehouseId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
};

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
      return;
    }

    next();
  };
};