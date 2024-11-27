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
} from '@nestjs/common';

@Controller('recados')
export class RecadosController {
  // @HttpCode(200) // para alterar, se eu quiser, o status automatico que vem ao usar o decorator
  @HttpCode(HttpStatus.OK) //--> é possivel utilizar esse Enum
  @Get()
  findAll(@Query() pagination: any) {
    const { limit = 10, offset = 0 } = pagination;
    return `Limit=${limit} e Offset=${offset}`;
  }
  @Get(':id')
  // OU findOne(@Param('id') id: any)
  findOne(@Param() id: any) {
    return `Recado ${id}`;
  }
  @Post()
  // OU create(@Body('recado') body: any) --> eu posso escolher qual parametro pegar do body
  create(@Body() body: any) {
    return body;
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      id,
      ...body,
    };
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Removendo recado ${id}`;
  }
}
