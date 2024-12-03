import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class OutroMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('OutroMiddleware executado.');
    const authorization = req.headers?.authorization;
    if (authorization) {
      req['user'] = {
        nome: 'Felipe',
        sobrenome: 'Martins',
      };
    }
    res.setHeader('CABECALHO', 'DO MIDDLEWARE');
    next();
    // console.log('Depois do proximo middleware - Outro');
    //terminando a cadeia de chamadas
    // return res.status(404).send({
    //   message: 'não encontrado',
    // });
  }
}
