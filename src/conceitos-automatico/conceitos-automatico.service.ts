/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceitosAutomaticoService {
  getHello(): string {
    return 'Hello Conceitos Automaticos!';
  }
}
