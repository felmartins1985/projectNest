import {
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
// import { UrlParam } from 'src/common/params/utl-param.decorator';
import { TokenPayloadParam } from 'src/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import { AuthAndPolicyGuard } from 'src/auth/guards/auth-and-policy.guard';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
  }

  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }
  @SetRoutePolicy(RoutePolicies.createRecado)
  @UseGuards(AuthAndPolicyGuard)
  @Post()
  create(
    @Body() createRecadoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }
  @SetRoutePolicy(RoutePolicies.updateRecado)
  @UseGuards(AuthAndPolicyGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }
  @SetRoutePolicy(RoutePolicies.deleteRecado)
  @UseGuards(AuthAndPolicyGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.remove(id, tokenPayload);
  }
}

// function UserInterceptors(
//   AddHeaderInterceptor: any,
// ): (target: typeof RecadosController) => void | typeof RecadosController {
//   throw new Error('Function not implemented.');
// }
// O ParseIntPipe é um pipe embutido no NestJS que
// é usado para transformar um parâmetro de string
// em um número inteiro.
