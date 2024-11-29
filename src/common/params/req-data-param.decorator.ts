import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ReqDataParam = createParamDecorator(
  (data: keyof Request, ctx: ExecutionContext) => {
    //  cria um tipo que é uma união de todas as chaves do tipo Request.
    //Isso inclui propriedades como body, query, params, headers, etc.
    const req: Request = ctx.switchToHttp().getRequest();
    return req[data];
  },
);
