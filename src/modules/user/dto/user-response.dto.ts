import { UserRole } from '../../../shared/common/enums';

class PatientInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  emergencyContact?: string;

  @ApiProperty({ required: false })
  bloodGroup?: string;

  @ApiProperty({ required: false })
  allergies?: string;
}

class DoctorInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  specialization?: string;

  @ApiProperty({ required: false })
  qualification?: string;

  @ApiProperty({ required: false })
  licenseNumber?: string;

  @ApiProperty({ required: false })
  consultationFee?: number;

  @ApiProperty({ required: false })
  rating?: number;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  patient?: PatientInfoDto;

  @ApiProperty({ required: false })
  doctor?: DoctorInfoDto;
}