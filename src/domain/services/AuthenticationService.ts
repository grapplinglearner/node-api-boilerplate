import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { User } from '../entities/User';
import { IUserRepository } from '../repositories/IRepository';
import { JWTPayload, LoginRequest, TokenRefreshRequest, UserRole } from '../types/auth';
import { RolePermissionMap } from '../constants/roles';

export class AuthenticationService {
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private jwtExpiry: string;
  private jwtRefreshExpiry: string;

  constructor(
    private userRepository: IUserRepository,
    jwtSecret?: string,
    jwtRefreshSecret?: string,
    jwtExpiry?: string,
    jwtRefreshExpiry?: string
  ) {
    this.jwtSecret = jwtSecret || process.env.JWT_SECRET || 'default_secret_change_in_production';
    this.jwtRefreshSecret = jwtRefreshSecret || process.env.JWT_REFRESH_SECRET || 'refresh_secret_change_in_production';
    this.jwtExpiry = jwtExpiry || process.env.JWT_EXPIRY || '7d';
    this.jwtRefreshExpiry = jwtRefreshExpiry || process.env.JWT_REFRESH_EXPIRY || '30d';
  }

  async hashPassword(password: string): Promise<string> {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  async login(request: LoginRequest): Promise<{ token: string; refreshToken: string; user: User }> {
    if (!request.email || !request.password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await this.comparePassword(request.password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      token,
      refreshToken,
      user,
    };
  }

  generateAccessToken(user: User): string {
    const permissions = RolePermissionMap[user.role] || [];

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions,
    };

    return jwt.sign(payload, this.jwtSecret as jwt.Secret, {
      expiresIn: this.jwtExpiry,
    } as unknown as SignOptions);
  }

  generateRefreshToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: [],
    };

    return jwt.sign(payload, this.jwtRefreshSecret as jwt.Secret, {
      expiresIn: this.jwtRefreshExpiry,
    } as unknown as SignOptions);
  }


  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtRefreshSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = this.verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.generateAccessToken(user);
  }

  extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader) {
      throw new Error('Authorization header not found');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new Error('Invalid authorization header format');
    }

    return parts[1];
  }
}
