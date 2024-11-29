import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { Request } from 'express';
// import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
// import { SimpleCacheInterceptor } from 'src/common/interceptors/simple-cache.interceptor';
// import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
// import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

@Controller('recados')
@UseInterceptors(AuthTokenInterceptor)
// @UseInterceptors(SimpleCacheInterceptor)
// @UseInterceptors(ChangeDataInterceptor)
// @UsePipes(ParseIntIdPipe)
// @UserInterceptors(AddHeaderInterceptor) --> o cabeçalho aparecia em todas as chamadas
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  // @UseGuards(IsAdminGuard)
  // @UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
  @UseInterceptors(AddHeaderInterceptor)
  async findAll(@Query() paginationDto: PaginationDto, @Req() req: Request) {
    console.log('RecadosController', req['user']);
    const recados = await this.recadosService.findAll(paginationDto);
    // throw new BadRequestException('MENSAGEM DE ERRO');
    // findAll() {
    return recados;
  }

  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRecadoDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recadosService.remove(id);
  }
}

function UserInterceptors(
  AddHeaderInterceptor: any,
): (target: typeof RecadosController) => void | typeof RecadosController {
  throw new Error('Function not implemented.');
}
// O ParseIntPipe é um pipe embutido no NestJS que
// é usado para transformar um parâmetro de string
// em um número inteiro.
