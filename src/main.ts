/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';
// import { MyExceptionFilter } from './common/exceptions/my-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove as chaves que nao estao presentes nas validações
    forbidNonWhitelisted: true, // retorna um erro se tiver uma chave que nao esta nas validações
    transform: false, // tenta transformar os tipos de dados de dados para as validações

  }),
  new ParseIntIdPipe() // dessa forma funciona globalmente para todas as rotas
  // se eu quiser colocar para um controller especifico, posso ir ao controller e colocar @UsePipes(ParseIntIdPipe) antes da classe
);
  // app.useGlobalFilters(new MyExceptionFilter())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// Definir transform como true no 
// ValidationPipe é útil para garantir que os dados de 
// entrada sejam automaticamente convertidos para os tipos esperados,
// facilitando a validação e o processamento dos dados no seu aplicativo NestJS.