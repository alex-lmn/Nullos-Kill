import { Controller, Get, Post, Body, Param, Delete, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  @Post('settings/revives-visibility')
  updateRevivesVisibility(@Body('areRevivesVisible') areRevivesVisible: boolean) {
    return this.scoreService.updateRevivesVisibility(areRevivesVisible);
  }

  @Post('settings/avatars-visibility')
  updateAvatarsVisibility(@Body('areAvatarsVisible') areAvatarsVisible: boolean) {
    return this.scoreService.updateAvatarsVisibility(areAvatarsVisible);
  }

  @Post('settings/visibility/toggle')
  toggleVisibility() {
    return this.scoreService.toggleVisibility();
  }

  @Post('settings/scores-visibility/toggle')
  toggleScoresVisibility() {
    return this.scoreService.toggleScoresVisibility();
  }

  @Post('settings/multiplier-visibility/toggle')
  toggleMultiplierVisibility() {
    return this.scoreService.toggleMultiplierVisibility();
  }

  @Post('settings/loser-preview-visibility/toggle')
  toggleLoserPreviewVisibility() {
    return this.scoreService.toggleLoserPreviewVisibility();
  }

  @Post('settings/revives-visibility/toggle')
  toggleRevivesVisibility() {
    return this.scoreService.toggleRevivesVisibility();
  }

  @Post('settings/avatars-visibility/toggle')
  toggleAvatarsVisibility() {
    return this.scoreService.toggleAvatarsVisibility();
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

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const avatarUrl = `http://localhost:3001/uploads/${file.filename}`;
    return this.scoreService.updateAvatar(+id, avatarUrl);
  }

  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    return this.scoreService.removeAvatar(+id);
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
