import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';
// Consertar a rotina de funcionamento do access_token e refresh_token, somente precisa verificar a existencia do refresh caso o access_token esteja expirado, caso contrario retornar uma excessao
// JWT ta gerando um erro que quando n tratado explode na aplicacao e n permite que o payload seja validado pelas rotinas seguintes, ver como corrigir isso de forma elegante.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCache: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const token = this.extractTokenFromHeader(request);
      const refreshToken = this.extractRefreshTokenFromHeader(request);

      if (!token) throw new UnauthorizedException('Usuario não autenticado');
      try {
        // Verifica a validade do jwt caso ele exista
        await this.jwtService.verifyAsync(token, {
          secret: process.env.SECRET_KEY,
        });
      } catch (error) {
        if (!refreshToken)
          throw new UnauthorizedException('Usuario não autenticado');
        const redisToken = await this.redisCache.retrieveToken(refreshToken);
        if (!redisToken)
          throw new UnauthorizedException('Usuario não autenticado');
        // Tendo o refresh token no redis, gerar um novo access_token e refresh token, salvar o novo no redis, apagar o antigo e enviar
        // para o usuario o novo access_token e refresh_token
        const { refresh_token: redisRefreshToken } = redisToken as unknown as {
          refresh_token: string;
        };
        const redisPayload = this.jwtService.verify(redisRefreshToken, {
          secret: process.env.REFRESH_TOKEN_SECRET,
        });
        console.log('redisPayload: ', redisPayload);
        const { id, username, email } =
          (redisPayload as unknown as {
            id: string;
            username: string;
            email: string;
          }) || undefined;
        const payload = { id, username, email };
        const newAccessToken = await this.jwtService.signAsync(payload, {
          secret: process.env.SECRET_KEY,
          expiresIn: '60s',
        });
        const newRefreshToken = await this.jwtService.signAsync(payload, {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '1d',
        });
        const isTokenStored =  await this.redisCache.storeToken(newRefreshToken);
        console.log('Token is stored value: ', isTokenStored);
        request['user'] = redisPayload;
        response.headers['refresh_token'] = newRefreshToken;
        response.body['access_token'] = newAccessToken;

        throw new UnauthorizedException('Token inválido');
      }
    } catch (error) {
      throw new UnauthorizedException('Usuario não autenticado');
    }
    
    return true;
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    const refreshToken = request.headers.refresh_token as string;
    return refreshToken;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
