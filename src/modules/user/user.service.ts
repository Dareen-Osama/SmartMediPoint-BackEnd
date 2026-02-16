import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Patient } from '../../entities/patient.entity';
import { Doctor } from '../../entities/doctor.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { DoctorAvailabilityDto } from './dto/doctor-availability.dto';
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

  // 🔹 احصل على بروفايل مستخدم
  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['patient', 'doctor'],
    });

    if (!user) throw new NotFoundException('User not found');

    return this.mapToUserResponse(user);
  }

  // 🔹 تحديث بروفايل
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['patient', 'doctor'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.role === UserRole.PATIENT && user.patient) {
      await this.patientRepository.update(user.patient.id, { ...updateProfileDto });
    } else if (user.role === UserRole.DOCTOR && user.doctor) {
      await this.doctorRepository.update(user.doctor.id, { ...updateProfileDto });
    }

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['patient', 'doctor'],
    });

    return this.mapToUserResponse(updatedUser!);
  }

  // 🔹 دوال للحصول على جميع الأطباء / المرضى
  async getAllDoctors(): Promise<UserResponseDto[]> {
    const doctors = await this.userRepository.find({
      where: { role: UserRole.DOCTOR, isActive: true },
      relations: ['doctor'],
    });
    return doctors.map(d => this.mapToUserResponse(d));
  }

  async getDoctorById(doctorId: string): Promise<UserResponseDto> {
    const doctor = await this.userRepository.findOne({
      where: { id: doctorId, role: UserRole.DOCTOR },
      relations: ['doctor'],
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return this.mapToUserResponse(doctor);
  }

  async create(data: Partial<User>): Promise<User> {
    const patients = await this.userRepository.find({
      where: { role: UserRole.PATIENT },
      relations: ['patient'],
    });
    return patients.map(p => this.mapToUserResponse(p));
  }

  async getPatientById(patientId: string): Promise<UserResponseDto> {
    const patient = await this.userRepository.findOne({
      where: { id: patientId, role: UserRole.PATIENT },
      relations: ['patient'],
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return this.mapToUserResponse(patient);
  }

  // 🔹 إدارة توافر الطبيب
  async updateDoctorAvailability(doctorId: string, availabilityDto: DoctorAvailabilityDto): Promise<any> {
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: doctorId } },
      relations: ['user'],
    });

    if (!doctor) throw new NotFoundException('Doctor not found');

    doctor.availability = availabilityDto.availability;
    await this.doctorRepository.save(doctor);

    return {
      message: 'Availability updated successfully',
      availability: availabilityDto.availability,
    };
  }

  async getDoctorAvailability(doctorId: string): Promise<any> {
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: doctorId } },
    });

    if (!doctor) throw new NotFoundException('Doctor not found');

    return {
      doctorId,
      availability: doctor.availability || [],
    };
  }

  // 🔹 البحث عن أطباء
  async searchDoctors(searchTerm: string): Promise<UserResponseDto[]> {
    const doctors = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.doctor', 'doctor')
      .where('user.role = :role', { role: UserRole.DOCTOR })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere(
        '(doctor.firstName LIKE :search OR doctor.lastName LIKE :search OR doctor.specialization LIKE :search)',
        { search: `%${searchTerm}%` }
      )
      
      .getMany();

    return doctors.map(d => this.mapToUserResponse(d));
  }

  // 🔹 تفعيل / تعطيل المستخدم
  async toggleUserStatus(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['patient', 'doctor'],
    });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return this.mapToUserResponse(user);
  }

  // 🔹 دالة لإنشاء مستخدم (مع تشفير الباسورد)
  async create(data: Partial<User>): Promise<User> {
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }
  
    // create user instance
    const user = this.userRepository.create(data);
  
    // save user to DB
    const savedUser = await this.userRepository.save(user);
  
    return savedUser;
  }
  

  // 🔹 دوال مساعدة
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

  private mapToUserResponse(user: User): UserResponseDto {
    const response: UserResponseDto = {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    if (user.role === UserRole.PATIENT && user.patient) {
      response.patient = { ...user.patient };
    }

    if (user.role === UserRole.DOCTOR && user.doctor) {
      response.doctor = { ...user.doctor };
    }

    return response;
  }
}
