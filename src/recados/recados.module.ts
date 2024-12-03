import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';
import { MyDynamicModule } from 'src/my-dinamic/my-dynamic.module';
// import { RegexFactory } from 'src/common/regex/regex.factory';
// import {
//   ONLY_LOWERCASE_LETTER_REGEX,
//   REMOVE_SPACES_REGEX,
// } from './recados.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule),
    // dependencia circular --> é quando um modula importa um modulo e vice-versa
    MyDynamicModule.register({
      apiKey: 'API KEY 123',
      apiUrl: 'http://localhost:3000',
    }),
  ],
  controllers: [RecadosController],
  providers: [RecadosService, RecadosUtils],
  exports: [
    // {
    //   provide: RecadosUtils,
    //   useClass: RecadosUtils,
    // },
    RecadosUtils,
  ],
})
export class RecadosModule {}
