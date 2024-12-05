import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROUTE_POLICY_KEY } from '../auth.constants';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePolicyRequired = this.reflector.get(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );
    console.log(routePolicyRequired);
    return true;
  }
}

// Para que Serve o Guard:
// Proteção de Rotas: O AuthTokenGuard é usado para proteger rotas,
// garantindo que apenas solicitações autenticadas com um token JWT válido possam acessar essas rotas.
// Verificação de Autenticação: Verifica se a solicitação contém um token JWT válido e, se for válido,
// permite que a solicitação prossiga.
// Injeção de Dependências: Usa o JwtService para verificar o token JWT e injeta a configuração
// JWT (jwtConfiguration) para obter o segredo usado na verificação.
