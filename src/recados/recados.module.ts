import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule), // dependencia circular --> é quando um modula importa um modulo e vice-versa
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils,
      useClass: RecadosUtils,
    },
  ],
  exports: [
    {
      provide: RecadosUtils,
      useClass: RecadosUtils,
    },
  ],
})
export class RecadosModule {}
