import { User } from '../../domain/entities/User';
import { AuthenticationService } from '../../domain/services/AuthenticationService';
import { LoginRequest, RegisterRequest, UserRole } from '../../domain/types/auth';
import { IUserRepository } from '../../domain/repositories/IRepository';

export class LoginUseCase {
  constructor(private authenticationService: AuthenticationService) {}

  async execute(request: LoginRequest): Promise<{ token: string; refreshToken: string; user: User }> {
    return this.authenticationService.login(request);
  }
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authenticationService: AuthenticationService
  ) {}

  async execute(request: RegisterRequest): Promise<{ user: User; token: string; refreshToken: string }> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await this.authenticationService.hashPassword(request.password);

    const user = new User(
      '',
      request.email,
      passwordHash,
      request.name,
      UserRole.USER,
      new Date(),
      new Date()
    );

    const savedUser = await this.userRepository.save(user);

    const token = this.authenticationService.generateAccessToken(savedUser);
    const refreshToken = this.authenticationService.generateRefreshToken(savedUser);

    return {
      user: savedUser,
      token,
      refreshToken,
    };
  }
}

export class RefreshTokenUseCase {
  constructor(private authenticationService: AuthenticationService) {}

  async execute(refreshToken: string): Promise<string> {
    return this.authenticationService.refreshAccessToken(refreshToken);
  }
}

export class VerifyTokenUseCase {
  constructor(private authenticationService: AuthenticationService) {}

  execute(token: string) {
    return this.authenticationService.verifyAccessToken(token);
  }
}

export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}

export class UpdateUserRoleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, newRole: UserRole): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = newRole;
    const updated = await this.userRepository.update(user);
    return updated;
  }
}


export class LogoutUseCase {
  private tokenBlacklist: Set<string> = new Set();

  execute(token: string): void {
    this.tokenBlacklist.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
