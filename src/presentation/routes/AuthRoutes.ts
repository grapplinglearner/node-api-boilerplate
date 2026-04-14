import { Router } from 'express';
import { AuthenticationService } from '../../domain/services/AuthenticationService';
import { AuthorizationService } from '../../domain/services/AuthorizationService';
import { IUserRepository } from '../../domain/repositories/IRepository';
import {
  LoginUseCase,
  RegisterUseCase,
  RefreshTokenUseCase,
  VerifyTokenUseCase,
  GetCurrentUserUseCase,
} from '../../application/usecases/AuthUseCases';
import { AuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { Permission } from '../../domain/types/auth';
import { validate, authSchemas } from '../middleware/validation/schemas';

export function createAuthRoutes(
  authenticationService: AuthenticationService,
  authorizationService: AuthorizationService,
  userRepository: IUserRepository
): Router {
  const router = Router();
  const authMiddleware = new AuthMiddleware(authenticationService, authorizationService);

  const loginUseCase = new LoginUseCase(authenticationService);
  const registerUseCase = new RegisterUseCase(userRepository, authenticationService);
  const refreshTokenUseCase = new RefreshTokenUseCase(authenticationService);
  const verifyTokenUseCase = new VerifyTokenUseCase(authenticationService);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

  router.post('/login', validate(authSchemas.login), async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await loginUseCase.execute({ email, password });

      res.status(200).json({
        message: 'Login successful',
        data: {
          token: result.token,
          refreshToken: result.refreshToken,
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({ error: message });
    }
  });

  router.post('/register', validate(authSchemas.register), async (req, res) => {
    try {
      const { email, password, name } = req.body;

      const result = await registerUseCase.execute({ email, password, name });

      res.status(201).json({
        message: 'User registered successfully',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
          token: result.token,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({ error: message });
    }
  });

  router.post('/refresh', validate(authSchemas.refreshToken), async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const token = await refreshTokenUseCase.execute(refreshToken);

      res.status(200).json({
        message: 'Token refreshed successfully',
        data: { token },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      res.status(401).json({ error: message });
    }
  });


  router.get('/verify', (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authenticationService.extractTokenFromHeader(authHeader);

      if (!token) {
        res.status(400).json({ error: 'Authorization token is required' });
        return;
      }

      const payload = verifyTokenUseCase.execute(token);

      res.status(200).json({
        message: 'Token is valid',
        data: {
          valid: true,
          payload,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token verification failed';
      res.status(401).json({ error: message });
    }
  });

  router.get(
    '/me',
    authMiddleware.verifyToken,
    async (req: AuthenticatedRequest, res) => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'User not found in token' });
          return;
        }

        const user = await getCurrentUserUseCase.execute(req.user.userId);

        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        res.status(200).json({
          message: 'Current user retrieved successfully',
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to retrieve user';
        res.status(500).json({ error: message });
      }
    }
  );

  router.post(
    '/logout',
    authMiddleware.verifyToken,
    (req: AuthenticatedRequest, res) => {
      res.status(200).json({
        message: 'Logout successful. Please remove the token from client storage.',
      });
    }
  );

  return router;
}
