import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModule, KnexModuleOptions } from 'nestjs-knex';

@Module({})
export class DatabaseModule {
  public static forRoot(configOptions: KnexModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        KnexModule.forRootAsync({
          inject: [ConfigService],
          useFactory: () => configOptions,
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
