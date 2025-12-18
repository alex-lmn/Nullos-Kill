import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 10 }) // Default 10 cents
  multiplier: number;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: true })
  areScoresVisible: boolean;

  @Column({ default: true })
  isMultiplierVisible: boolean;

  @Column({ default: false })
  isLoserPreviewVisible: boolean;

  @Column({ default: true })
  areRevivesVisible: boolean;

  @Column({ default: true })
  areAvatarsVisible: boolean;
}
