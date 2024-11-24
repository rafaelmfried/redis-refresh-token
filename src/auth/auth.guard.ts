import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCache: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // RETIRA OS OBJETOS REQUEST E RESPONSE E RETIRA O TOKEN E REFRESH TOKEN DO HEADER DA REQUEST.
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const token = this.extractTokenFromHeader(request);
      const refreshToken = this.extractRefreshTokenFromHeader(request);

      if (!token) throw new UnauthorizedException('Usuario não autenticado');

      try {
        // VERIFICA SE O TOKEN É VALIDO OU ESTA DENTRO DO PRAZO DE EXPIRAÇÃO.
        await this.jwtService.verifyAsync(token, {
          secret: process.env.SECRET_KEY,
        });
        // SE O JWT LANÇAR UMA EXCESSÃO, VAMOS VERIFICAR SE EXISTE O REFRESH TOKEN
      } catch (error) {
        // NÃO TIVER NEM O TOKEN E NEM O REFRESH TOKEN EU POSSO LANÇAR QUE O USUARIO NÃO ESTA AUTENTICADO
        if (!refreshToken)
          throw new UnauthorizedException('Usuario não autenticado');
        // CASO TENHA O REFRESH TOKEN, VAMOS VERIFICAR SE ELE EXISTE NO REDIS
        const redisToken = await this.redisCache.retrieveToken(refreshToken);

        // SE O REFRESH N EXISTIR MAIS NO REDIS PODEMOS LANÇAR QUE O USUARIO NÃO ESTA AUTORIZADO
        if (!redisToken)
          throw new UnauthorizedException('Usuario não autenticado');

        // SE O REFRESH EXISTIR NO REDIS, VAMOS ISOLAR O REFRESH_TOKEN DE SUA CHAVE NO OBJETO DE RESPOSTA
        const { refresh_token: redisRefreshToken } = redisToken as unknown as {
          refresh_token: string;
        };

        // VAMOS VALIDAR O TOKEN PARA CONSEGUIR RETIRAR O PAYLOAD DELE
        const redisPayload = this.jwtService.verify(redisRefreshToken, {
          secret: process.env.REFRESH_TOKEN_SECRET,
        });
        console.log('redisPayload: ', redisPayload);

        // ISOLAMOS OS DADOS DO PAYLOAD RETIRANDO IA EXP DO NOVO PAYLOAD
        const { id, username, email } =
          (redisPayload as unknown as {
            id: string;
            username: string;
            email: string;
          }) || undefined;

        // DEFINIMOS UM NOVO PAYLOAD
        const payload = { id, username, email };

        // GERAMOS UM NOVO ACCESS TOKEN
        const newAccessToken = await this.jwtService.signAsync(payload, {
          secret: process.env.SECRET_KEY,
          expiresIn: process.env.EXPIRESIN_ACCESS_TOKEN,
        });

        // GERAMOS UM NOVO REFRESH TOKEN
        const newRefreshToken = await this.jwtService.signAsync(payload, {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.EXPIRESIN_REFRESH_TOKEN,
        });

        // ATUALIZAMOS O REDIS COM O NOVO REFRESH TOKEN
        const isTokenStored = await this.redisCache.storeToken(newRefreshToken);
        console.log('Token is stored value: ', isTokenStored);

        // DELETAMOS O ANTIGO TOKEN DO REDIS
        if (isTokenStored) this.redisCache.deleteToken(refreshToken);

        // DEFINIMOS UM CABEÇALHO CHAMADO USER COM O NOVO PAYLOAD
        // DEFINIMOS O REFRESH TOKEN NO CABEÇALHO
        console.log('Payload to set user: ', payload);
        request.user = payload;
        console.log('Request set payload: ', request.user);

        response.setHeader('refresh_token', newRefreshToken);
        // DEFINIMOS UM ACCESS_TOKEN NO BODY
        response.json({ access_token: newAccessToken });

        return true;
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
