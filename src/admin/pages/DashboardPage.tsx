import { useEffect, useState } from 'react';
import { Activity, Gift, GraduationCap, Trophy, Users, RefreshCw, BarChart3, Database } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { api } from '../api/client';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

interface DashboardResponse {
  totals: {
    parents: number;
    children: number;
    families: number;
    tasks: number;
    completedToday: number;
    teachers: number;
    schoolClasses: number;
    activeUsers: number;
    rewards: number;
  };
  recentActivity: Array<{
    _id: string;
    message: string;
    type: string;
    createdAt: string;
  }>;
}

const COLORS = ['#4FC3F7', '#FFB74D', '#81C784', '#87CEEB'];

export function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTick = useAdminRefresh();

  const fetchDashboardData = () => {
    setLoading(true);
    api.get<DashboardResponse>('/admin/dashboard')
      .then((response: { data: DashboardResponse }) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTick]);

  const chartData = data
    ? [
        { label: 'Parents', value: data.totals.parents },
        { label: 'Children', value: data.totals.children },
        { label: 'Families', value: data.totals.families },
        { label: 'Teachers', value: data.totals.teachers },
        { label: 'Classes', value: data.totals.schoolClasses },
        { label: 'Tasks', value: data.totals.tasks },
      ]
    : [];

  const pieData = data
    ? [
        { name: 'Parents', value: data.totals.parents },
        { name: 'Children', value: data.totals.children },
        { name: 'Teachers', value: data.totals.teachers },
      ]
    : [];

  return (
    <div className="space-y-8 p-1">
      {/* Upper Action Bar */}
      <PageHeader
        title="Admin Dashboard"
        description="Monitor your KidDo ecosystem and family activity."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 border-slate-200"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Stats
          </Button>
        }
      />

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          label="Parents"
          value={data?.totals.parents ?? '--'}
          hint="Registered parent accounts"
          icon={<Users size={22} />}
        />
        <MetricCard
          label="Children"
          value={data?.totals.children ?? '--'}
          hint="Child profiles across families"
          icon={<Trophy size={22} />}
        />
        <MetricCard
          label="Teachers"
          value={data?.totals.teachers ?? '--'}
          hint="Academic supervisors"
          icon={<GraduationCap size={22} />}
        />
        <MetricCard
          label="Active Families"
          value={data?.totals.families ?? '--'}
          hint="Registered households"
          icon={<Users size={22} />}
        />
        <MetricCard
          label="Active Users"
          value={data?.totals.activeUsers ?? '--'}
          hint="Enabled accounts platform-wide"
          icon={<Activity size={22} />}
        />
        <MetricCard
          label="Completed Today"
          value={data?.totals.completedToday ?? '--'}
          hint="Missions completed today"
          icon={<Gift size={22} />}
        />
      </div>

      {/* Main visual widgets section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Activity area (left) */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="text-sky-500" size={18} />
                Platform Scale
              </CardTitle>
              <CardDescription>Visual snapshot of registered users and system volume</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">Loading data...</div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4FC3F7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4FC3F7" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="value" stroke="#4FC3F7" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User distribution pie chart */}
        <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">User Distribution</CardTitle>
            <CardDescription>Ratios of active user categories</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center text-slate-400">Loading...</div>
            ) : (
              <>
                <div className="h-[200px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legends */}
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {item.name}: {item.value}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

      </div>

      {/* System Event Logs / Activities */}
      <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Database className="text-emerald-500" size={18} />
              Recent System Events
            </CardTitle>
            <CardDescription>Audit stream logs from active families and background tasks</CardDescription>
          </div>
          <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50/30">
            System Live
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Fetching feed...</div>
          ) : data?.recentActivity?.length ? (
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {data.recentActivity.map((activity) => (
                <div key={activity._id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      activity.type === 'auth' ? 'bg-amber-400' :
                      activity.type === 'task' ? 'bg-sky-400' :
                      activity.type === 'reward' ? 'bg-emerald-400' : 'bg-slate-400'
                    }`} />
                    <span className="text-sm font-semibold text-slate-700">{activity.message}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">No recent system events available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
