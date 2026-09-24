import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Gamepad2, Trophy, Star, Play, CircleDot } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  role: string;
  chessWins?: number;
  chessGamesPlayed?: number;
  memoryWins?: number;
  memoryGamesPlayed?: number;
  mathWins?: number;
  mathGamesPlayed?: number;
  patternWins?: number;
  patternGamesPlayed?: number;
  puzzleWins?: number;
  puzzleGamesPlayed?: number;
}

interface GameStats {
  id: string;
  name: string;
  baseReward: number;
  played: number;
  won: number;
  cooldown: string;
  status: 'active' | 'maintenance';
}

export function GamesPage() {
  const [loading, setLoading] = useState(true);
  const [gameStatsList, setGameStatsList] = useState<GameStats[]>([]);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    fetchGameStats();
  }, [refreshTick]);

  const fetchGameStats = async () => {
    try {
      setLoading(true);
      const res = await api.get<UserRow[]>('/users/all');
      
      const children = (res.data || []).filter((u) => u.role === 'child');

      // Aggregate game stats
      const aggregated = [
        {
          id: 'chess',
          name: 'Chess Academy',
          baseReward: 10,
          played: children.reduce((sum, c) => sum + (c.chessGamesPlayed || 0), 0),
          won: children.reduce((sum, c) => sum + (c.chessWins || 0), 0),
          cooldown: '6 hours',
          status: 'active' as const
        },
        {
          id: 'memory',
          name: 'Memory Match',
          baseReward: 10,
          played: children.reduce((sum, c) => sum + (c.memoryGamesPlayed || 0), 0),
          won: children.reduce((sum, c) => sum + (c.memoryWins || 0), 0),
          cooldown: '3 hours',
          status: 'active' as const
        },
        {
          id: 'math',
          name: 'Math Blitz',
          baseReward: 12,
          played: children.reduce((sum, c) => sum + (c.mathGamesPlayed || 0), 0),
          won: children.reduce((sum, c) => sum + (c.mathWins || 0), 0),
          cooldown: '3 hours',
          status: 'active' as const
        },
        {
          id: 'pattern',
          name: 'Pattern Tap',
          baseReward: 11,
          played: children.reduce((sum, c) => sum + (c.patternGamesPlayed || 0), 0),
          won: children.reduce((sum, c) => sum + (c.patternWins || 0), 0),
          cooldown: '3 hours',
          status: 'active' as const
        },
        {
          id: 'puzzle',
          name: 'Jigsaw Puzzle',
          baseReward: 9,
          played: children.reduce((sum, c) => sum + (c.puzzleGamesPlayed || 0), 0),
          won: children.reduce((sum, c) => sum + (c.puzzleWins || 0), 0),
          cooldown: '3 hours',
          status: 'active' as const
        }
      ];

      setGameStatsList(aggregated);
    } catch (err) {
      toast.error('Failed to load game metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Games"
        description="Monitor mini-game usage statistics across child profiles."
      />

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-medium">Aggregating game statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameStatsList.map((game) => (
            <Card key={game.id} className="border-slate-200/80 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 pb-3.5 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                    <Gamepad2 size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black text-slate-800 leading-tight">{game.name}</CardTitle>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wider">GAME ENGINE</span>
                  </div>
                </div>
                <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-700 font-black border-none text-[9px] px-2 rounded-full uppercase">
                  {game.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Stats block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Playthroughs</span>
                    <strong className="text-base font-black text-slate-800 flex items-center gap-1.5">
                      <Play size={14} className="text-slate-500 fill-slate-500" />
                      {game.played} times
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Success Win Rate</span>
                    <strong className="text-base font-black text-slate-800 flex items-center gap-1.5">
                      <Trophy size={14} className="text-indigo-500" />
                      {game.played > 0 ? `${Math.round((game.won / game.played) * 100)}%` : '0%'}
                    </strong>
                  </div>
                </div>

                {/* Configuration items */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Base Points Reward:</span>
                    <span className="text-amber-600 font-black flex items-center gap-1 text-xs">
                      <Star size={13} className="fill-amber-500 text-amber-500" />
                      {game.baseReward} Points
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Claim Cooldown Period:</span>
                    <span className="text-slate-700 font-extrabold flex items-center gap-1 text-xs">
                      <CircleDot size={12} className="text-sky-500" />
                      {game.cooldown}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
