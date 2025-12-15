import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  kills: number;

  @Column({ default: 0 })
  revives: number;

  @Column({ default: 0 })
  totalDebt: number;

  @Column('simple-json', { default: '{}' })
  debts: Record<string, number>;

  @Column('float', { default: 1.0 })
  scoreMultiplier: number;
}
