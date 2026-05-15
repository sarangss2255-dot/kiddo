import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DataTable } from '../components/DataTable';

interface RewardRow {
  _id: string;
  title: string;
  pointsCost: number;
  unlockedAtStreak: number;
  createdAt: string;
}

export function RewardsPage() {
  const [rewards, setRewards] = useState<RewardRow[]>([]);

  useEffect(() => {
    api.get<RewardRow[]>('/admin/rewards').then((response: { data: RewardRow[] }) => setRewards(response.data)).catch(() => {});
  }, []);

  return (
    <div className="stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Rewards</p>
          <h2>Catalog moderation</h2>
        </div>
      </div>
      <DataTable
        columns={['Reward', 'Points', 'Streak Unlock', 'Created']}
        rows={rewards.map((reward) => [
          reward.title,
          reward.pointsCost,
          reward.unlockedAtStreak,
          new Date(reward.createdAt).toLocaleDateString(),
        ])}
      />
    </div>
  );
}
