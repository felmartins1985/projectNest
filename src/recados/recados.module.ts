import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';
import { RegexFactory } from 'src/common/regex/regex.factory';
import {
  ONLY_LOWERCASE_LETTER_REGEX,
  REMOVE_SPACES_REGEX,
} from './recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule), // dependencia circular --> é quando um modula importa um modulo e vice-versa
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    RecadosUtils,
    RegexFactory,
    {
      provide: REMOVE_SPACES_REGEX,
      useFactory: (regexFactory: RegexFactory) => {
        // meu codigo/logica
        return regexFactory.create('RemoveSpacesRegex');
      },
      inject: [RegexFactory], // injetar dependencia na ordem
    },
    {
      provide: ONLY_LOWERCASE_LETTER_REGEX,
      useFactory: (regexFactory: RegexFactory) => {
        // meu codigo/logica
        return regexFactory.create('OnlyLowercaseLettersRegex');
      },
      inject: [RegexFactory], // injetar dependencia na ordem
    },
  ],
  exports: [
    // {
    //   provide: RecadosUtils,
    //   useClass: RecadosUtils,
    // },
    RecadosUtils,
  ],
})
export class RecadosModule {}
