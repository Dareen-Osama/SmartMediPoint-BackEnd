import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
import { AppointmentStatus, AppointmentType } from '../shared/common/enums';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  dateTime: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.IN_PERSON,
  })
  type: AppointmentType;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;
}
