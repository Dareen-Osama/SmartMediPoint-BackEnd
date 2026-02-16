import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  // 🔹 تسجيل الدخول
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    let firstName = '', lastName = '';
    if (user.patient) {
      firstName = user.patient.firstName;
      lastName = user.patient.lastName;
    } else if (user.doctor) {
      firstName = user.doctor.firstName;
      lastName = user.doctor.lastName;
    }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName,
        lastName,
      },
    };
  }

  // 🔹 التسجيل
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.userService.register(registerDto);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    let firstName = registerDto.firstName;
    let lastName = registerDto.lastName;

    if (user.patient) {
      firstName = user.patient.firstName;
      lastName = user.patient.lastName;
    } else if (user.doctor) {
      firstName = user.doctor.firstName;
      lastName = user.doctor.lastName;
    }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName,
        lastName,
      },
    };
  }

  // 🔹 تجديد التوكن
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
