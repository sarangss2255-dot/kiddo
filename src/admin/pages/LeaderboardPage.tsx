import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Trophy, Flame, Swords, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardEntry {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  points?: number;
  streak?: number;
  school?: string;
}

interface UserRow {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  points?: number;
  streak?: number;
  chessWins?: number;
  chessGamesPlayed?: number;
  familyId?: string;
}

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<LeaderboardEntry[]>('/leaderboard?type=global'),
      api.get<UserRow[]>('/users/all'),
    ])
      .then(([rankings, roster]) => {
        setEntries(rankings.data || []);
        setUsers(roster.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refreshTick]);

  const children = useMemo(() => users.filter((user) => user.role === 'child'), [users]);

  const totals = useMemo(() => {
    const totalChessWins = children.reduce((sum, child) => sum + (child.chessWins ?? 0), 0);
    const totalChessGames = children.reduce((sum, child) => sum + (child.chessGamesPlayed ?? 0), 0);
    return {
      activeChildren: children.length,
      totalChessWins,
      totalChessGames,
    };
  }, [children]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <PageHeader
        title="Leaderboard"
        description="Monitor student rankings, gamification statistics, and mini-game logs."
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ translateY: -4 }} className="h-full">
          <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                <Trophy size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Ranked Children</span>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{totals.activeChildren}</h3>
                <p className="text-[11px] text-slate-500 font-medium">Currently competing</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ translateY: -4 }} className="h-full">
          <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <Swords size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Chess Wins</span>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{totals.totalChessWins}</h3>
                <p className="text-[11px] text-slate-500 font-medium">Wins recorded in mini-game</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ translateY: -4 }} className="h-full">
          <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Chess Games Played</span>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{totals.totalChessGames}</h3>
                <p className="text-[11px] text-slate-500 font-medium">Sessions logged on system</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Leaderboard Table List */}
      <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="text-amber-500" size={18} />
              Leaderboard Standings
            </CardTitle>
            <CardDescription>Global child rankings computed by the KidDo leaderboard engine</CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-bold">
            Global · All time
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading standings...</div>
          ) : entries.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {entries.map((child, index) => (
                <div key={child._id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Rank Indicator */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                      index === 0 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      index === 1 ? 'bg-slate-100 text-slate-800 border-slate-200' :
                      index === 2 ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      #{index + 1}
                    </div>
                    {/* User info */}
                    <div>
                      <div className="font-bold text-slate-800">{child.firstName} {child.lastName || ''}</div>
                      <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                        <span>{child.avatar || 'Child Profile'}</span>
                        <span>•</span>
                        <span className="text-orange-500 font-bold flex items-center gap-0.5">
                          <Flame size={12} className="fill-orange-100" /> {child.streak ?? 0} Day Streak
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Stats columns */}
                  <div className="flex items-center gap-8 text-right font-bold text-slate-700">
                    <div>
                      <div className="text-base text-slate-800 flex items-center gap-1 justify-end">
                        <Star size={14} className="fill-amber-500 text-amber-500" /> {child.points ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Points Balance</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">No child leaderboard data available yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
