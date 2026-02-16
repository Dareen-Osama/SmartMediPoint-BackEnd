import { IsArray, IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TimeSlotDto {
  @ApiProperty()
  @IsString()
  day: string; // Monday, Tuesday, etc.

  @ApiProperty()
  @IsString()
  startTime: string; // "09:00"

  @ApiProperty()
  @IsString()
  endTime: string; // "17:00"

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class DoctorAvailabilityDto {
  @ApiProperty({ type: [TimeSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  availability: TimeSlotDto[];
}