import {
  IsArray,
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TimeSlotDto {
  @IsString()
  day: string; // Monday, Tuesday, etc.

  @IsString()
  startTime: string; // "09:00"

  @IsString()
  endTime: string; // "17:00"

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class DoctorAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  availability: TimeSlotDto[];
}
