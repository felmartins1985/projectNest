import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware executado.');
    const authorization = req.headers?.authorization;
    if (authorization) {
      req['user'] = {
        nome: 'Felipe',
        sobrenome: 'Martins',
        role: 'admin',
      };
    }
    res.setHeader('CABECALHO', 'DO MIDDLEWARE');
    next();
    console.log('Depois do proximo middleware- Simple');
    res.on('finish', () => {
      console.log('SimpleMiddleware: terminou');
    });
    //terminando a cadeia de chamadas
    // return res.status(404).send({
    //   message: 'não encontrado',
    // });
  }
}
