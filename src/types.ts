export type UserRole = 'kid' | 'parent' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  familyId?: string;
  avatar?: string;
  photoURL?: string;
  createdAt?: number | string;
  points?: number; // For kids
  chessWins?: number;
  chessGamesPlayed?: number;
  lastChessRewardAt?: number | string | Date;
}

export interface Family {
  id: string;
  name: string;
  parentIds: string[];
  kidIds: string[];
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  assignedTo: string; // kidId
  createdBy: string; // parentId
  familyId: string;
  status: 'pending' | 'completed' | 'approved';
  category?: string;
  dueDate?: number | string | Date | null;
  createdAt: number | string | Date;
  completedAt?: number | string | Date;
  approvedAt?: number | string | Date;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  familyId: string;
  createdAt: number;
}

export interface Redemption {
  id: string;
  rewardId: string;
  kidId: string;
  familyId: string;
  status: 'pending' | 'fulfilled';
  createdAt: number;
}

export interface ChessRewardResponse {
  awarded: boolean;
  pointsAwarded: number;
  totalPoints: number;
  cooldownEndsAt: string | null;
  moves: number | null;
  stats: {
    chessWins: number;
    chessGamesPlayed: number;
  };
}
