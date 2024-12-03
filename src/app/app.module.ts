import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { ConfigModule } from '@nestjs/config';

//

@Module({
  imports: [
    ConfigModule.forRoot(), // carrega um arquivo em que serao salvas a variaveis de ambiente
    RecadosModule,
    PessoasModule,
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // carrega as entidades automaticamente sem precisar especificar
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // sincroniza com o BD. Nao deve ser usado em producao
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: MyExceptionFilter,
    // }, //uma forma de utilizar sem ser colocar no main.ts New MyExceptionFilter()
    // {
    //   provide: APP_GUARD,
    //   useClass: IsAdminGuard,
    // },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   // implementacao para funcionar os middlewares -->  A ORDEM IMPORTA DOS MIDDLEWARES
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(SimpleMiddleware).forRoutes({
//       path: '*',
//       method: RequestMethod.ALL,
//     });
//     // consumer.apply(OutroMiddleware).forRoutes({
//     //   path: '*',
//     //   method: RequestMethod.ALL,
//     // });
//   }
// }
