import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Gender } from '../shared/common/enums';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ type: 'json', nullable: true })
  medicalHistory: any;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  allergies: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
