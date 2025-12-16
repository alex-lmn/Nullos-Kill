import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { GameSettings } from './game-settings.entity';
import { GameHistory } from './game-history.entity';
import { ScoreGateway } from './score.gateway';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(GameSettings)
    private settingsRepository: Repository<GameSettings>,
    @InjectRepository(GameHistory)
    private historyRepository: Repository<GameHistory>,
    private scoreGateway: ScoreGateway,
  ) {}

  async getPlayers(): Promise<Player[]> {
    return this.playerRepository.find({ order: { id: 'ASC' } });
  }

  async getSettings(): Promise<GameSettings> {
    let settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.settingsRepository.create({ 
        id: 1, 
        multiplier: 10, 
        isVisible: true, 
        areScoresVisible: true, 
        isMultiplierVisible: true,
        isLoserPreviewVisible: false,
        areRevivesVisible: true
      });
      await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async updateMultiplier(multiplier: number): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.multiplier = multiplier;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async updateVisibility(isVisible: boolean): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.isVisible = isVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async updateScoresVisibility(areScoresVisible: boolean): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.areScoresVisible = areScoresVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async updateMultiplierVisibility(isMultiplierVisible: boolean): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.isMultiplierVisible = isMultiplierVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async updateLoserPreviewVisibility(isLoserPreviewVisible: boolean): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.isLoserPreviewVisible = isLoserPreviewVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async updateRevivesVisibility(areRevivesVisible: boolean): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.areRevivesVisible = areRevivesVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async toggleVisibility(): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.isVisible = !settings.isVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async toggleScoresVisibility(): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.areScoresVisible = !settings.areScoresVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async toggleMultiplierVisibility(): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.isMultiplierVisible = !settings.isMultiplierVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async toggleLoserPreviewVisibility(): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.isLoserPreviewVisible = !settings.isLoserPreviewVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async toggleRevivesVisibility(): Promise<GameSettings> {
    let settings = await this.getSettings();
    settings.areRevivesVisible = !settings.areRevivesVisible;
    const savedSettings = await this.settingsRepository.save(settings);
    this.scoreGateway.broadcastSettings(savedSettings);
    return savedSettings;
  }

  async addPlayer(name: string): Promise<Player> {
    const player = this.playerRepository.create({ name });
    const savedPlayer = await this.playerRepository.save(player);
    this.broadcastUpdate();
    return savedPlayer;
  }

  async updatePlayer(id: number, data: Partial<Player>): Promise<Player> {
    await this.playerRepository.update(id, data);
    const updatedPlayer = await this.playerRepository.findOne({ where: { id } });
    if (!updatedPlayer) {
      throw new Error('Player not found');
    }
    this.broadcastUpdate();
    return updatedPlayer;
  }

  async updatePlayerMultiplier(id: number, multiplier: number): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) throw new Error('Player not found');
    player.scoreMultiplier = multiplier;
    const updatedPlayer = await this.playerRepository.save(player);
    this.broadcastUpdate();
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<void> {
    await this.playerRepository.delete(id);
    this.broadcastUpdate();
  }

  async finishGame(forceLoserId?: number, forceWinnerId?: number): Promise<{ 
    status: 'resolved' | 'tie_loser' | 'tie_winner', 
    players?: Player[], 
    result?: { losers: string[], winners: string[], debt: number }, 
    candidates?: Player[], 
    debtAmount?: number,
    pendingLoserId?: number 
  }> {
    const players = await this.getPlayers();
    const settings = await this.getSettings();
    
    console.log('--- Finishing Game ---');
    console.log('Multiplier:', settings.multiplier);

    // Calculate total score of all players (for Debt/Money)
    let totalGameScore = 0;
    players.forEach(p => {
      // If areRevivesVisible is false (Valorant Mode), only kills count for money.
      // If true, both kills and revives count.
      const moneyScore = settings.areRevivesVisible 
        ? (p.kills + p.revives) * (p.scoreMultiplier || 1)
        : p.kills * (p.scoreMultiplier || 1);
      
      totalGameScore += moneyScore;
    });
    console.log('Total Game Score (Money Base):', totalGameScore);

    // Find min and max scores (for Ranking/Loser determination)
    let minScore = Infinity;
    let maxScore = -Infinity;
    players.forEach(p => {
      // Ranking Score Logic:
      // Standard: Kills + Revives
      // Valorant: Kills - Deaths (Revives field). 
      // To change the death penalty weight, modify the -1 below (e.g. to -0.5).
      const reviveMultiplier = settings.areRevivesVisible ? 1 : -0.5; 
      const score = (p.kills + (p.revives * reviveMultiplier)) * (p.scoreMultiplier || 1);
      
      if (score < minScore) minScore = score;
      if (score > maxScore) maxScore = score;
    });
    console.log('Minimum Score:', minScore, 'Maximum Score:', maxScore);

    const potentialLosers = players.filter(p => {
      const reviveMultiplier = settings.areRevivesVisible ? 1 : -1;
      return ((p.kills + (p.revives * reviveMultiplier)) * (p.scoreMultiplier || 1)) === minScore;
    });
    const potentialWinners = players.filter(p => {
      const reviveMultiplier = settings.areRevivesVisible ? 1 : -1;
      return ((p.kills + (p.revives * reviveMultiplier)) * (p.scoreMultiplier || 1)) === maxScore;
    });
    const gameDebt = totalGameScore * settings.multiplier;

    // 1. Determine Loser
    let loser: Player;
    if (forceLoserId) {
      const found = players.find(p => p.id === forceLoserId);
      if (!found) throw new Error('Forced loser not found');
      loser = found;
    } else if (potentialLosers.length > 1) {
      console.log('Tie detected for loser between:', potentialLosers.map(p => p.name));
      return {
        status: 'tie_loser',
        candidates: potentialLosers,
        debtAmount: gameDebt
      };
    } else {
      loser = potentialLosers[0];
    }

    // 2. Determine Winner
    let winner: Player;
    if (forceWinnerId) {
      const found = players.find(p => p.id === forceWinnerId);
      if (!found) throw new Error('Forced winner not found');
      winner = found;
    } else if (potentialWinners.length > 1) {
      // If we have a tie for winner, we need to ask admin.
      console.log('Tie detected for winner between:', potentialWinners.map(p => p.name));
      return {
        status: 'tie_winner',
        candidates: potentialWinners,
        debtAmount: gameDebt,
        pendingLoserId: loser.id
      };
    } else {
      winner = potentialWinners[0];
    }

    // 3. Apply Debt (with netting)
    console.log(`Resolved - Loser: ${loser.name}, Winner: ${winner.name}, Debt: ${gameDebt}`);
    
    if (!winner.debts) winner.debts = {};
    if (!loser.debts) loser.debts = {};

    const winnerOwesLoser = winner.debts[loser.id] || 0;
    
    if (winnerOwesLoser > 0) {
      if (winnerOwesLoser >= gameDebt) {
        // Winner owes more or equal. Reduce winner's debt.
        winner.debts[loser.id] = winnerOwesLoser - gameDebt;
        if (winner.debts[loser.id] === 0) delete winner.debts[loser.id];
        // Loser incurs no new debt to winner.
      } else {
        // Winner owes less. Wipe winner's debt.
        delete winner.debts[loser.id];
        // Loser owes the difference.
        const remaining = gameDebt - winnerOwesLoser;
        const currentLoserDebt = loser.debts[winner.id] || 0;
        loser.debts[winner.id] = currentLoserDebt + remaining;
      }
    } else {
      // Standard case: Loser owes full amount to winner
      const currentLoserDebt = loser.debts[winner.id] || 0;
      loser.debts[winner.id] = currentLoserDebt + gameDebt;
    }

    // Recalculate totalDebt for both
    const calculateTotalDebt = (p: Player) => {
      if (!p.debts) return 0;
      return Object.values(p.debts).reduce((a, b) => a + b, 0);
    };

    loser.totalDebt = calculateTotalDebt(loser);
    winner.totalDebt = calculateTotalDebt(winner);

    await this.playerRepository.save(loser);
    await this.playerRepository.save(winner);

    // Reset all players
    for (const p of players) {
      p.kills = 0;
      p.revives = 0;
      await this.playerRepository.save(p);
    }

    // Save history snapshot
    const allPlayers = await this.getPlayers();
    const snapshot: Record<string, number> = {};
    allPlayers.forEach(p => {
      snapshot[p.name] = p.totalDebt;
    });
    const history = this.historyRepository.create({ debtsSnapshot: snapshot });
    await this.historyRepository.save(history);
    
    this.broadcastUpdate();
    
    const result = {
      status: 'resolved' as const,
      players: await this.getPlayers(),
      result: { losers: [loser.name], winners: [winner.name], debt: gameDebt }
    };

    this.scoreGateway.broadcastGameFinished(result);

    return result;
  }

  async resetAll(): Promise<void> {
    const players = await this.getPlayers();
    for (const player of players) {
      player.kills = 0;
      player.revives = 0;
      player.totalDebt = 0;
      player.debts = {};
      await this.playerRepository.save(player);
    }
    await this.historyRepository.clear();
    this.broadcastUpdate();
  }

  async getHistory(): Promise<GameHistory[]> {
    return this.historyRepository.find({ order: { createdAt: 'ASC' } });
  }

  private async broadcastUpdate() {
    const players = await this.getPlayers();
    this.scoreGateway.broadcastScore(players);
  }

  async incrementKill(id: number): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) throw new Error('Player not found');
    player.kills += 1;
    const saved = await this.playerRepository.save(player);
    this.broadcastUpdate();
    return saved;
  }

  async incrementRevive(id: number): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) throw new Error('Player not found');
    player.revives += 1;
    const saved = await this.playerRepository.save(player);
    this.broadcastUpdate();
    return saved;
  }
}
