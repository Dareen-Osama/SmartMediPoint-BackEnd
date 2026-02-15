import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
        migrations: [join(__dirname, '..', '..', 'migrations', '*.{ts,js}')],
        cli: {
          migrationsDir: join('src', 'migrations'),
        },
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('NODE_ENV') === 'development',
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
