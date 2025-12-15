import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ScoreService } from './score.service';
import { Player } from './player.entity';

@Controller('players')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  getPlayers() {
    return this.scoreService.getPlayers();
  }

  @Get('settings')
  getSettings() {
    return this.scoreService.getSettings();
  }

  @Post('settings')
  updateMultiplier(@Body('multiplier') multiplier: number) {
    return this.scoreService.updateMultiplier(multiplier);
  }

  @Post('settings/visibility')
  updateVisibility(@Body('isVisible') isVisible: boolean) {
    return this.scoreService.updateVisibility(isVisible);
  }

  @Post('settings/scores-visibility')
  updateScoresVisibility(@Body('areScoresVisible') areScoresVisible: boolean) {
    return this.scoreService.updateScoresVisibility(areScoresVisible);
  }

  @Post('settings/multiplier-visibility')
  updateMultiplierVisibility(@Body('isMultiplierVisible') isMultiplierVisible: boolean) {
    return this.scoreService.updateMultiplierVisibility(isMultiplierVisible);
  }

  @Post('settings/loser-preview-visibility')
  updateLoserPreviewVisibility(@Body('isLoserPreviewVisible') isLoserPreviewVisible: boolean) {
    return this.scoreService.updateLoserPreviewVisibility(isLoserPreviewVisible);
  }

  @Patch(':id/multiplier')
  updatePlayerMultiplier(@Param('id') id: number, @Body('multiplier') multiplier: number) {
    return this.scoreService.updatePlayerMultiplier(id, multiplier);
  }

  @Post('finish')
  finishGame(
    @Body('forceLoserId') forceLoserId?: number,
    @Body('forceWinnerId') forceWinnerId?: number,
  ) {
    return this.scoreService.finishGame(forceLoserId, forceWinnerId);
  }

  @Post('reset')
  resetAll() {
    return this.scoreService.resetAll();
  }

  @Post()
  addPlayer(@Body('name') name: string) {
    return this.scoreService.addPlayer(name);
  }

  @Patch(':id')
  updatePlayer(@Param('id') id: string, @Body() data: Partial<Player>) {
    return this.scoreService.updatePlayer(+id, data);
  }

  @Delete(':id')
  deletePlayer(@Param('id') id: string) {
    return this.scoreService.deletePlayer(+id);
  }

  @Get('history')
  getHistory() {
    return this.scoreService.getHistory();
  }

  @Post(':id/kill')
  incrementKill(@Param('id') id: string) {
    return this.scoreService.incrementKill(+id);
  }

  @Post(':id/revive')
  incrementRevive(@Param('id') id: string) {
    return this.scoreService.incrementRevive(+id);
  }
}
