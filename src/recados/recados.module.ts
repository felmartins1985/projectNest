import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import {
  ONLY_LOWERCASE_LETTER_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from './recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowerCaseLetterRegex } from 'src/common/regex/only-lowercase-letter.regex';

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
    {
      provide: ONLY_LOWERCASE_LETTER_REGEX,
      useClass: OnlyLowerCaseLetterRegex,
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex,
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
