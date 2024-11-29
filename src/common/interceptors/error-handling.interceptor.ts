import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('ErrorHandlingInterceptor executado ANTES');
    // await new Promise(resolve => setTimeout(resolve, 10000));
    return next.handle().pipe(
      catchError(err => {
        return throwError(() => {
          if (err.name === 'NotFoundException') {
            return new BadRequestException(err.message);
          } // serve para mudar o retorno de um erro em especifico
          return new BadRequestException('Ocorreu um erro desconhecido');
        });
      }),
    );
  }
}
