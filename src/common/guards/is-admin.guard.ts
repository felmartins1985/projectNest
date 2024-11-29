import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('IsAdminGuard');
    const request = context.switchToHttp().getRequest();
    const role = request['user']?.role;
    if (role === 'admin') {
      return true;
    }
    return false;
  }
}
