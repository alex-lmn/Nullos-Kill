import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoreModule } from './score/score.module';
import { Player } from './score/player.entity';
import { GameSettings } from './score/game-settings.entity';
import { GameHistory } from './score/game-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://admin:password@localhost:5432/scores_db',
      entities: [Player, GameSettings, GameHistory],
      synchronize: true, // Don't use this in production
    }),
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
