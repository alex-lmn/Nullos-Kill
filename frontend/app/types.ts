export interface Player {
  id: number;
  name: string;
  kills: number;
  revives: number;
  totalDebt: number;
  debts?: Record<string, number>;
  scoreMultiplier: number;
  avatarUrl?: string;
}

export interface GameHistory {
  id: number;
  createdAt: string;
  debtsSnapshot: Record<string, number>;
}
