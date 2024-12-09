/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';
// import { MyExceptionFilter } from './common/exceptions/my-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);

  await app.listen(3000);
  // app.useGlobalFilters(new MyExceptionFilter())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
