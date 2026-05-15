import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

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
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    api.get<UserRow[]>('/users/all').then((response: { data: UserRow[] }) => setUsers(response.data)).catch(() => {});
  }, []);

  const children = useMemo(
    () =>
      users
        .filter((user) => user.role === 'child')
        .sort((a, b) => (b.points ?? 0) - (a.points ?? 0) || (b.streak ?? 0) - (a.streak ?? 0)),
    [users],
  );

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
    <div className="stack">
      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-card__icon">#</div>
          <div>
            <p className="eyebrow">Leaderboard</p>
            <h3>{totals.activeChildren}</h3>
            <span className="muted">Children ranked</span>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-card__icon">W</div>
          <div>
            <p className="eyebrow">Chess Wins</p>
            <h3>{totals.totalChessWins}</h3>
            <span className="muted">Rewarded wins tracked</span>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-card__icon">G</div>
          <div>
            <p className="eyebrow">Chess Games</p>
            <h3>{totals.totalChessGames}</h3>
            <span className="muted">Mini-game sessions logged</span>
          </div>
        </article>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Leaderboard Monitoring</p>
            <h2>Top children by points and streak</h2>
          </div>
        </div>

        <div className="leaderboard-list">
          {children.map((child, index) => (
            <article key={child._id} className="leaderboard-item">
              <div className="leaderboard-rank">#{index + 1}</div>
              <div className="leaderboard-main">
                <strong>{child.firstName} {child.lastName}</strong>
                <span>Family: {child.familyId ?? 'Unknown'} | Streak: {child.streak ?? 0} days</span>
              </div>
              <div className="leaderboard-stats">
                <span>{child.points ?? 0} pts</span>
                <span>{child.chessWins ?? 0} chess wins</span>
                <span>{child.chessGamesPlayed ?? 0} games</span>
              </div>
            </article>
          ))}
          {children.length === 0 ? <p className="muted">No child leaderboard data available yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
