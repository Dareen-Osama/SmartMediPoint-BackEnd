import { UserRole } from '../../../shared/common/enums';

class PatientInfoDto {
  id: string;

  firstName: string;

  lastName: string;

  phoneNumber?: string;

  dateOfBirth?: Date;

  gender?: string;

  address?: string;

  emergencyContact?: string;

  bloodGroup?: string;

  allergies?: string;
}

class DoctorInfoDto {
  id: string;

  firstName: string;

  lastName: string;

  phoneNumber?: string;

  specialization?: string;

  qualification?: string;

  licenseNumber?: string;

  consultationFee?: number;

  rating?: number;
}

export class UserResponseDto {
  id: string;

  email: string;

  role: UserRole;

  isVerified: boolean;

  isActive: boolean;

  createdAt: Date;

  patient?: PatientInfoDto;

  doctor?: DoctorInfoDto;
}
