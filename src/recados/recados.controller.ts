import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
// import { UrlParam } from 'src/common/params/utl-param.decorator';
import { ReqDataParam } from 'src/common/params/req-data-param.decorator';
import {
  ONLY_LOWERCASE_LETTER_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from './recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowerCaseLetterRegex } from 'src/common/regex/only-lowercase-letter.regex';
// import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
// import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
// import { SimpleCacheInterceptor } from 'src/common/interceptors/simple-cache.interceptor';
// import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
// import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

@Controller('recados')
// @UseInterceptors(AuthTokenInterceptor)
// @UseInterceptors(SimpleCacheInterceptor)
// @UseInterceptors(ChangeDataInterceptor)
// @UsePipes(ParseIntIdPipe)
// @UserInterceptors(AddHeaderInterceptor) --> o cabeçalho aparecia em todas as chamadas
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    @Inject(SERVER_NAME)
    private readonly serverName: string,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RemoveSpacesRegex,
    @Inject(ONLY_LOWERCASE_LETTER_REGEX)
    private readonly onlyLowerCaseLetterRegex: OnlyLowerCaseLetterRegex,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  // @UseGuards(IsAdminGuard)
  // @UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
  @UseInterceptors(AddHeaderInterceptor)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @ReqDataParam('headers') method: string,
  ) {
    console.log('RecadosController', method);
    console.log(this.removeSpacesRegex.execute(this.serverName));
    console.log(this.onlyLowerCaseLetterRegex.execute(this.serverName));
    console.log(this.serverName);
    // async findAll(@Query() paginationDto: PaginationDto) {
    // console.log('RecadosController', req['user']);
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

// function UserInterceptors(
//   AddHeaderInterceptor: any,
// ): (target: typeof RecadosController) => void | typeof RecadosController {
//   throw new Error('Function not implemented.');
// }
// O ParseIntPipe é um pipe embutido no NestJS que
// é usado para transformar um parâmetro de string
// em um número inteiro.
