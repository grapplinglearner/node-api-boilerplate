import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../../domain/services/AuthenticationService';
import { AuthorizationService } from '../../domain/services/AuthorizationService';
import { Permission, UserRole } from '../../domain/types/auth';


export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
  };
  token?: string;
}

export class AuthMiddleware {
  constructor(
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService
  ) {}

 
  verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      const token = this.authenticationService.extractTokenFromHeader(authHeader);

      if (!token) {
        res.status(401).json({ error: 'Authorization token is required' });
        return;
      }

      const payload = this.authenticationService.verifyAccessToken(token);

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
      };
      req.token = token;

      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      res.status(401).json({ error: message });
    }
  };


  optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      const token = this.authenticationService.extractTokenFromHeader(authHeader);

      if (token) {
        const payload = this.authenticationService.verifyAccessToken(token);
        req.user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
        };
        req.token = token;
      }

      next();
    } catch {
      next();
    }
  };

  requireRole = (...roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authorization token is required' });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          error: `Access denied. Required role(s): ${roles.join(', ')}`,
        });
        return;
      }

      next();
    };
  };


  requirePermission = (...permissions: Permission[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authorization token is required' });
        return;
      }

      const hasPermission = permissions.some((permission) =>
        req.user!.permissions.includes(permission)
      );

      if (!hasPermission) {
        res.status(403).json({
          error: `Access denied. Required permission(s): ${permissions.join(', ')}`,
        });
        return;
      }

      next();
    };
  };

  requireAllPermissions = (...permissions: Permission[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authorization token is required' });
        return;
      }

      const hasAllPermissions = permissions.every((permission) =>
        req.user!.permissions.includes(permission)
      );

      if (!hasAllPermissions) {
        res.status(403).json({
          error: `Access denied. Required all permission(s): ${permissions.join(', ')}`,
        });
        return;
      }

      next();
    };
  };

  /**
   * Require admin role middleware
   */
  requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authorization token is required' });
      return;
    }

    if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({ error: 'Admin role is required' });
      return;
    }

    next();
  };

  /**
   * Require super admin role middleware
   */
  requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authorization token is required' });
      return;
    }

    if (req.user.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({ error: 'Super Admin role is required' });
      return;
    }

    next();
  };


  rateLimitByUser = (maxRequests: number, windowMs: number) => {
    const requestCounts = new Map<string, { count: number; resetTime: number }>();

    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      const userId = req.user?.userId || req.ip || 'anonymous';
      const now = Date.now();

      const record = requestCounts.get(userId);

      if (!record || now > record.resetTime) {
        requestCounts.set(userId, {
          count: 1,
          resetTime: now + windowMs,
        });
        next();
        return;
      }

      if (record.count >= maxRequests) {
        res.status(429).json({
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        });
        return;
      }

      record.count++;
      next();
    };
  };
}
