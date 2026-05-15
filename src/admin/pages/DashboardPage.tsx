import { useEffect, useState } from 'react';
import { Activity, Gift, Trophy, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api/client';
import { MetricCard } from '../components/MetricCard';

interface DashboardResponse {
  totals: {
    parents: number;
    children: number;
    families: number;
    tasks: number;
    completedToday: number;
  };
  recentActivity: Array<{
    _id: string;
    message: string;
    type: string;
    createdAt: string;
  }>;
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    api.get<DashboardResponse>('/admin/dashboard').then((response: { data: DashboardResponse }) => setData(response.data)).catch(() => {});
  }, []);

  const chartData = data
    ? [
        { label: 'Parents', value: data.totals.parents },
        { label: 'Children', value: data.totals.children },
        { label: 'Families', value: data.totals.families },
        { label: 'Tasks', value: data.totals.tasks },
      ]
    : [];

  return (
    <div className="stack">
      <section className="metric-grid">
        <MetricCard label="Families" value={data?.totals.families ?? '--'} hint="Active households" icon={<Users size={20} />} />
        <MetricCard label="Children" value={data?.totals.children ?? '--'} hint="Competing on leaderboard" icon={<Trophy size={20} />} />
        <MetricCard label="Tasks" value={data?.totals.tasks ?? '--'} hint="Across all families" icon={<Activity size={20} />} />
        <MetricCard label="Completed today" value={data?.totals.completedToday ?? '--'} hint="Daily momentum" icon={<Gift size={20} />} />
      </section>

      <section className="card chart-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Platform Analytics</p>
            <h2>Usage snapshot</h2>
          </div>
        </div>
        <div className="chart-area">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1f7ae0" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Activity Feed</p>
            <h2>Latest system events</h2>
          </div>
        </div>
        <div className="activity-list">
          {data?.recentActivity?.map((item) => (
            <div key={item._id} className="activity-item">
              <strong>{item.message}</strong>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </div>
          )) ?? <p className="muted">No activity available yet.</p>}
        </div>
      </section>
    </div>
  );
}
