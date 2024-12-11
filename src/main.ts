/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';
// import { MyExceptionFilter } from './common/exceptions/my-exception.filter';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);

  // helmet -> cabeçalhos de segurança no protocolo http

  // cors-> permitir que outro dominio faça requests na sua aplicação
  app.use(helmet());

  app.enableCors();
  const documentBuilderConfig = new DocumentBuilder().setTitle('Recados API').setDescription('Envie recados para quem desejar').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, documentBuilderConfig)
  SwaggerModule.setup('docs',app, document)
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
