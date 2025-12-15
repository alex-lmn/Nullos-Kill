import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  team1Score: number;

  @Column({ default: 0 })
  team2Score: number;

  @Column({ default: 'Team 1' })
  team1Name: string;

  @Column({ default: 'Team 2' })
  team2Name: string;
}
