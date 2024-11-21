import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCache: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    const payload = await this.jwtService.verifyAsync(token);
    if (!payload) {
      const refreshToken = this.extractRefreshTokenFromHeader(request);
      if (!refreshToken) throw new UnauthorizedException();

      try {
        const redisToken = await this.redisCache.retrieveToken(refreshToken);
        if (!redisToken) throw new UnauthorizedException();
        const newToken = await this.jwtService.signAsync(payload);
        await this.redisCache.storeToken(newToken);

        request['user'] = payload;
      } catch (error) {
        throw new UnauthorizedException();
      }
    }
    return true;
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    const [refreshToken] = request.headers.refresh;
    return refreshToken;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
