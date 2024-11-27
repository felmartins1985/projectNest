import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadoDto } from './create-recado.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  // eu posso estender a classe e tambem posso criar ou atualizar coisas dentro do campo
  @IsBoolean()
  @IsOptional()
  readonly lido: boolean;
}
