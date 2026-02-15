import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Patient } from '../../entities/patient.entity';
import { Doctor } from '../../entities/doctor.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserRole } from '../../shared/common/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName, role, phoneNumber } =
      registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user
    const user = this.userRepository.create({
      email,
      password,
      role,
    });

    await this.userRepository.save(user);

    // Create role-specific profile
    if (role === UserRole.PATIENT) {
      const patient = this.patientRepository.create({
        firstName,
        lastName,
        phoneNumber,
        user,
      });
      await this.patientRepository.save(patient);
    } else if (role === UserRole.DOCTOR) {
      const doctor = this.doctorRepository.create({
        firstName,
        lastName,
        phoneNumber,
        user,
      });
      await this.doctorRepository.save(doctor);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['patient', 'doctor'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    // Simple implementation - you can store refresh tokens in a separate table if needed
    await this.userRepository.update(userId, {
      // Add refreshToken field to User entity if you want to store it
    });
  }
}
