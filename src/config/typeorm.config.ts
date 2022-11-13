import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          type:'sqlite',
          database: 'db.sqlite',
          synchronize: true,
          autoLoadEntities: true
        };
      case 'test':
        return {
          type:'sqlite',
          database: 'test.sqlite',
          synchronize: true,
          autoLoadEntities: true
        };
      case 'production':
        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          synchronize: false,
          migrationsRun: true,
          entities: ['**/*.entity.js'],
          ssl: {
            rejectUnauthorized: false
          }
        }
    }
  }
}
