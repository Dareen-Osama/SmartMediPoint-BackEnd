import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await seedTestData(app); // 👈 أضف هذا السطر

  await app.listen(3000);
}
bootstrap();
