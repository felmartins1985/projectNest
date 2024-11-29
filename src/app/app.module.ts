import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { OutroMiddleware } from 'src/common/middlewares/outro.middleware';
import { APP_FILTER } from '@nestjs/core';
import { MyExceptionFilter } from 'src/common/exceptions/my-exception.filter';
//

@Module({
  imports: [
    RecadosModule,
    PessoasModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: 'gemeos1985',
      autoLoadEntities: true, // carrega as entidades automaticamente sem precisar especificar
      synchronize: true, // sincroniza com o BD. Nao deve ser usado em producao
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter,
    }, //uma forma de utilizar sem ser colocar no main.ts New MyExceptionFilter()
  ],
})
export class AppModule implements NestModule {
  // implementacao para funcionar os middlewares -->  A ORDEM IMPORTA DOS MIDDLEWARES
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware, OutroMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
