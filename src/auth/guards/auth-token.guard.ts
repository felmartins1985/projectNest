import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';

export class AuthTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Não Logado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });
      const pessoa = await this.pessoaRepository.findOneBy({
        id: payload.sub,
        active: true,
      });
      if (!pessoa) {
        throw new UnauthorizedException('Pessoa não autorizada');
      }
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
      return true;
    } catch (error) {
      console.error('Erro ao verificar token', error);
      throw new UnauthorizedException(error.message);
    }
  }
  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization || typeof authorization !== 'string') {
      return;
    }
    return authorization.split(' ')[1];
  }
}

// Para que Serve o Guard:
// Proteção de Rotas: O AuthTokenGuard é usado para proteger rotas,
// garantindo que apenas solicitações autenticadas com um token JWT válido possam acessar essas rotas.
// Verificação de Autenticação: Verifica se a solicitação contém um token JWT válido e, se for válido,
// permite que a solicitação prossiga.
// Injeção de Dependências: Usa o JwtService para verificar o token JWT e injeta a configuração
// JWT (jwtConfiguration) para obter o segredo usado na verificação.
