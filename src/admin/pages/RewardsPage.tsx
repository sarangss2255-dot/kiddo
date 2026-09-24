import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DataTable } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Badge } from '@/src/components/ui/Badge';
import { Calendar, Flame } from 'lucide-react';

interface RewardRow {
  _id: string;
  title: string;
  pointsCost: number;
  unlockedAtStreak: number;
  createdAt: string;
}

export function RewardsPage() {
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    setLoading(true);
    api.get<RewardRow[]>('/admin/rewards')
      .then((response: { data: RewardRow[] }) => {
        setRewards(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refreshTick]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Rewards"
        description="Monitor store rewards, streak milestones, and item valuations."
        action={
          <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-bold px-3 py-1">
            {rewards.length} Catalog Items
          </Badge>
        }
      />

      {loading ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 text-slate-400">
          Loading rewards catalog...
        </div>
      ) : (
        <DataTable
          columns={['Reward Item', 'Coins Cost', 'Streak Requirement', 'Creation Date']}
          rows={rewards.map((reward) => [
            <span className="font-semibold text-slate-800" key={`title-${reward._id}`}>{reward.title}</span>,
            <div className="flex items-center gap-1 font-bold text-slate-700" key={`points-${reward._id}`}>
              <span className="text-amber-500">🪙</span> {reward.pointsCost}
            </div>,
            <div className="flex items-center gap-1.5 font-bold text-orange-600" key={`streak-${reward._id}`}>
              <Flame size={14} className="fill-orange-100" />
              <span>{reward.unlockedAtStreak > 0 ? `${reward.unlockedAtStreak} Days` : 'None'}</span>
            </div>,
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium" key={`date-${reward._id}`}>
              <Calendar size={12} />
              {new Date(reward.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>,
          ])}
        />
      )}
    </div>
  );
}
