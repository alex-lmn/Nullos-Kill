import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { Player } from './player.entity';
import { GameSettings } from './game-settings.entity';
import { GameHistory } from './game-history.entity';
import { ScoreGateway } from './score.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Player, GameSettings, GameHistory])],
  controllers: [ScoreController],
  providers: [ScoreService, ScoreGateway],
})
export class ScoreModule {}
