import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

import { UserService } from './modules/user/user.service';
import { UserRole } from './shared/common/enums';
// عدّل المسار حسب عندك

// Add this temporarily to test data (remove in production)
async function seedTestData(app: INestApplication) {
  const userService = app.get(UserService);

  const doctors = [
    {
      email: 'dr.smith@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Smith',
      role: UserRole.DOCTOR,
    },
    {
      email: 'dr.jones@example.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Jones',
      role: UserRole.DOCTOR,
    },
  ];

  for (const doctorData of doctors) {
    try {
      await userService.create(doctorData);
    } catch (error) {
      console.log('Doctor already exists');
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Security middleware
  app.use(helmet());

  // CORS configuration
  const frontendUrl = configService.get('FRONTEND_URL');
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3001'].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await seedTestData(app); // 👈 أضف هذا السطر

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
