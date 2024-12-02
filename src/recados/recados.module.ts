import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule), // dependencia circular --> é quando um modula importa um modulo e vice-versa
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils, // token
      // useClass: new RecadosUtilsMock(), // valor a ser usado
      useValue: new RecadosUtilsMock(), // valor a ser usado
    },
    {
      provide: SERVER_NAME, // para injetar algum outro tipo de valor que nao seja uma classe
      useValue: 'My name Is NestJS',
    },
  ],
  exports: [
    // {
    //   provide: RecadosUtils,
    //   useClass: RecadosUtils,
    // },
    RecadosUtils,
    SERVER_NAME,
  ],
})
export class RecadosModule {}
