import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      patient: user.patient,
      doctor: user.doctor,
    };
  }
}
