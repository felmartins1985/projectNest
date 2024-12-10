/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';
// import { MyExceptionFilter } from './common/exceptions/my-exception.filter';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);

  // helmet -> cabeçalhos de segurança no protocolo http

  // cors-> permitir que outro dominio faça requests na sua aplicação
  app.use(helmet());

  app.enableCors();
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
