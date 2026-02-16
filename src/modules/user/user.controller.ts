import { 
  Controller, 
  Get, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Patch,
  Post,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { DoctorAvailabilityDto } from './dto/doctor-availability.dto';
import { UserRole } from '../../shared/common/enums';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: UserResponseDto })
  async getProfile(@GetUser('id') userId: string): Promise<UserResponseDto> {
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: UserResponseDto })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'Doctors retrieved successfully', type: [UserResponseDto] })
  @ApiQuery({ name: 'search', required: false, description: 'Search doctors by name or specialization' })
  async getAllDoctors(@Query('search') search?: string): Promise<UserResponseDto[]> {
    if (search) {
      return this.userService.searchDoctors(search);
    }
    return this.userService.getAllDoctors();
  }

  @Get('doctors/:id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  @ApiResponse({ status: 200, description: 'Doctor retrieved successfully', type: UserResponseDto })
  async getDoctorById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getDoctorById(id);
  }

  @Get('patients')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get all patients (Admin/Doctor only)' })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully', type: [UserResponseDto] })
  async getAllPatients(@GetUser('id') adminId: string): Promise<UserResponseDto[]> {
    return this.userService.getAllPatients(adminId);
  }

  @Get('patients/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get patient by ID (Admin/Doctor only)' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully', type: UserResponseDto })
  async getPatientById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getPatientById(id);
  }

  @Post('doctor/availability')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update doctor availability' })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  async updateAvailability(
    @GetUser('id') doctorId: string,
    @Body() availabilityDto: DoctorAvailabilityDto,
  ): Promise<any> {
    return this.userService.updateDoctorAvailability(doctorId, availabilityDto);
  }

  @Get('doctor/availability/:doctorId')
  @ApiOperation({ summary: 'Get doctor availability' })
  @ApiResponse({ status: 200, description: 'Availability retrieved successfully' })
  async getDoctorAvailability(@Param('doctorId') doctorId: string): Promise<any> {
    return this.userService.getDoctorAvailability(doctorId);
  }

  @Patch('admin/toggle-status/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle user active status (Admin only)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully', type: UserResponseDto })
  async toggleUserStatus(
    @Param('userId') userId: string,
    @GetUser('id') adminId: string,
  ): Promise<UserResponseDto> {
    return this.userService.toggleUserStatus(userId, adminId);
  }
}