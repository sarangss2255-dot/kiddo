import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  CheckCircle2,
  Database,
  GraduationCap,
  House,
  PieChart as PieChartIcon,
  RefreshCw,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../api/client';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/Alert';
import { Skeleton } from '@/src/components/ui/Skeleton';

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

const tooltipContentStyle = {
  background: '#ffffff',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  boxShadow: '0 12px 32px rgba(27, 58, 75, 0.10)',
  padding: '8px 12px',
  fontSize: 12,
} as const;

function ChartEmptyState({
  icon,
  title,
  hint,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kiddo-warm text-kiddo-muted">
        {icon}
      </div>
      <p className="text-sm font-bold text-kiddo-navy">{title}</p>
      <p className="max-w-xs text-xs font-medium leading-relaxed text-kiddo-muted">{hint}</p>
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTick = useAdminRefresh();

  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<DashboardResponse>('/admin/dashboard')
      .then((response: { data: DashboardResponse }) => {
        setData(response.data);
      })
      .catch(() => {
        setData(null);
        setError('Unable to load dashboard statistics.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshTick]);

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

  const hasScaleData = chartData.some((entry) => entry.value > 0);
  const distributionTotal = pieData.reduce((sum, entry) => sum + entry.value, 0);
  const hasDistributionData = distributionTotal > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor your KidDo ecosystem and family activity."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="border-kiddo-navy/10 bg-white"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Stats
          </Button>
        }
      />

      {error && (
        <Alert
          variant="destructive"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <AlertTitle>{error}</AlertTitle>
              <AlertDescription>
                Check your connection and try again. The rest of the dashboard stays available.
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="shrink-0 border-red-200 bg-white text-red-700 hover:bg-red-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Retry
          </Button>
        </Alert>
      )}

      {/* KPI CARDS */}
      <section
        aria-label="Dashboard key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <MetricCard
          label="Parents"
          value={data?.totals.parents ?? '--'}
          hint="Registered parent accounts"
          icon={<Users size={22} />}
          accent="blue"
          loading={loading}
        />
        <MetricCard
          label="Children"
          value={data?.totals.children ?? '--'}
          hint="Child profiles across families"
          icon={<Award size={22} />}
          accent="orange"
          loading={loading}
        />
        <MetricCard
          label="Teachers"
          value={data?.totals.teachers ?? '--'}
          hint="Academic supervisors"
          icon={<GraduationCap size={22} />}
          accent="green"
          loading={loading}
        />
        <MetricCard
          label="Active Families"
          value={data?.totals.families ?? '--'}
          hint="Registered households"
          icon={<House size={22} />}
          accent="navy"
          loading={loading}
        />
        <MetricCard
          label="Active Users"
          value={data?.totals.activeUsers ?? '--'}
          hint="Enabled accounts platform-wide"
          icon={<Activity size={22} />}
          accent="sky"
          loading={loading}
        />
        <MetricCard
          label="Completed Today"
          value={data?.totals.completedToday ?? '--'}
          hint="Missions completed today"
          icon={<CheckCircle2 size={22} />}
          accent="green"
          loading={loading}
        />
      </section>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="overflow-hidden border border-kiddo-navy/5 bg-white shadow-sm xl:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-kiddo-navy">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kiddo-blue/15 text-kiddo-blue">
                  <BarChart3 size={16} />
                </span>
                Platform Scale
              </CardTitle>
              <CardDescription>Visual snapshot of registered users and system volume</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex h-[300px] items-end gap-3 px-2 pb-8 sm:h-[340px]" aria-hidden>
                {[42, 68, 34, 56, 26, 48].map((height, index) => (
                  <Skeleton
                    key={index}
                    className="flex-1 rounded-t-xl"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            ) : hasScaleData ? (
              <div
                className="h-[300px] w-full sm:h-[340px]"
                role="img"
                aria-label="Platform Scale chart of Parents, Children, Families, Teachers, Classes and Tasks"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="platformScaleBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4FC3F7" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#87CEEB" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#5A7A8A', fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickMargin={8}
                    />
                    <YAxis
                      allowDecimals={false}
                      width={44}
                      tick={{ fill: '#5A7A8A', fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(79, 195, 247, 0.08)' }}
                      contentStyle={tooltipContentStyle}
                      labelStyle={{ color: '#1B3A4B', fontWeight: 700 }}
                      formatter={(value) => Number(value).toLocaleString()}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#platformScaleBar)"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={56}
                      animationDuration={700}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartEmptyState
                icon={<BarChart3 size={20} />}
                title="No platform statistics available yet"
                hint="Platform Scale appears here once registered users and system volume are recorded."
              />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-kiddo-navy/5 bg-white shadow-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-kiddo-navy">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kiddo-orange/15 text-kiddo-orange">
                <PieChartIcon size={16} />
              </span>
              User Distribution
            </CardTitle>
            <CardDescription>Ratios of active user categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex flex-col items-center gap-6" aria-hidden>
                <Skeleton className="h-[190px] w-[190px] rounded-full" />
                <div className="w-full space-y-2.5">
                  {[0, 1, 2].map((index) => (
                    <Skeleton key={index} className="h-3.5 w-full" />
                  ))}
                </div>
              </div>
            ) : hasDistributionData ? (
              <div className="flex flex-col items-center">
                <div
                  className="relative h-[210px] w-full max-w-[250px]"
                  role="img"
                  aria-label="User Distribution chart for Parents, Children and Teachers"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={88}
                        paddingAngle={3}
                        cornerRadius={6}
                        stroke="none"
                        animationDuration={700}
                        animationEasing="ease-out"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipContentStyle}
                        formatter={(value) => Number(value).toLocaleString()}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-extrabold tracking-tight text-kiddo-navy">
                      {distributionTotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-kiddo-muted">
                      Total
                    </span>
                  </div>
                </div>

                <ul className="mt-5 w-full space-y-2.5">
                  {pieData.map((item, index) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-3 text-xs font-semibold text-kiddo-navy"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          aria-hidden
                        />
                        {item.name}:
                      </span>
                      <span className="tabular-nums text-kiddo-muted">
                        {item.value.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ChartEmptyState
                icon={<PieChartIcon size={20} />}
                title="No user distribution data available yet"
                hint="Ratios for Parents, Children and Teachers appear here once accounts are registered."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Event Logs / Activities */}
      <Card className="overflow-hidden border border-kiddo-navy/5 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-kiddo-navy/5 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-kiddo-navy">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kiddo-green/15 text-kiddo-green">
                <Database size={16} />
              </span>
              Recent System Events
            </CardTitle>
            <CardDescription>
              Audit stream logs from active families and background tasks
            </CardDescription>
          </div>
          <Badge
            variant="success"
            className="hidden border-none bg-kiddo-green/10 font-bold normal-case tracking-normal sm:inline-flex"
          >
            System Live
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6" aria-hidden>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-3.5 w-48" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          ) : data?.recentActivity?.length ? (
            <div className="max-h-[320px] divide-y divide-kiddo-navy/5 overflow-y-auto">
              {data.recentActivity.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-kiddo-warm/70"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        entry.type === 'auth'
                          ? 'bg-kiddo-orange/15 text-kiddo-orange'
                          : entry.type === 'task'
                            ? 'bg-kiddo-blue/15 text-kiddo-blue'
                            : entry.type === 'reward'
                              ? 'bg-kiddo-green/15 text-kiddo-green'
                              : 'bg-kiddo-navy/5 text-kiddo-muted'
                      }`}
                    >
                      <Activity size={14} />
                    </span>
                    <span className="truncate text-sm font-semibold text-kiddo-navy">
                      {entry.message}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-kiddo-muted">
                    {new Date(entry.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm font-medium text-kiddo-muted">
              No recent system events available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
