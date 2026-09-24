import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Coins, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ConversionDay {
  _id: string; // date key
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  totalPointsUsed: number;
  totalCoinsAwarded: number;
}

interface ConversionTrends {
  days: number;
  daily: ConversionDay[];
  totals: {
    totalConversions: number;
    totalApproved: number;
    totalRejected: number;
    totalPointsUsed: number;
    totalCoinsAwarded: number;
  };
  economy: {
    totalCoinsSpent: number;
  };
}

interface ApprovalItem {
  _id: string; // status: approved, pending, rejected
  count: number;
}

interface ApprovalStats {
  purchaseApprovals: ApprovalItem[];
  conversionRequests: ApprovalItem[];
}

export function ReportsPage() {
  const [trends, setTrends] = useState<ConversionTrends | null>(null);
  const [approvals, setApprovals] = useState<ApprovalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTick]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [trendsRes, approvalsRes] = await Promise.all([
        api.get<ConversionTrends>('/analytics/admin/conversion-trends?days=30'),
        api.get<ApprovalStats>('/analytics/admin/approval-stats'),
      ]);
      setTrends(trendsRes.data);
      setApprovals(approvalsRes.data);
    } catch (err) {
      toast.error('Failed to load platform reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (list: ApprovalItem[] | undefined, status: string) => {
    if (!list) return 0;
    const match = list.find((item) => item._id === status);
    return match ? match.count : 0;
  };

  const chartData = trends?.daily.map((day) => ({
    name: day._id,
    'Points Used': day.totalPointsUsed,
    'Coins Issued': day.totalCoinsAwarded * 10, // Scale for comparison
    CoinsActual: day.totalCoinsAwarded,
  })) || [];

  const approvalChartData = [
    {
      name: 'Purchases',
      Approved: getStatusCount(approvals?.purchaseApprovals, 'approved'),
      Pending: getStatusCount(approvals?.purchaseApprovals, 'pending'),
      Rejected: getStatusCount(approvals?.purchaseApprovals, 'rejected'),
    },
    {
      name: 'Conversions',
      Approved: getStatusCount(approvals?.conversionRequests, 'approved'),
      Pending: getStatusCount(approvals?.conversionRequests, 'pending'),
      Rejected: getStatusCount(approvals?.conversionRequests, 'rejected'),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Growth Reports"
        description="Monitor conversion rates, reward coin circulation, and task approval statistics."
      />

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-medium">Aggregating platform reports...</div>
      ) : (
        <div className="space-y-6">
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-200/80 shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Points Redeemed</span>
                  <strong className="text-lg font-black text-slate-800">{trends?.totals.totalPointsUsed || 0} RP</strong>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                  <Coins size={20} className="fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Coins Issued</span>
                  <strong className="text-lg font-black text-slate-800">{trends?.totals.totalCoinsAwarded || 0} RC</strong>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Approved Transactions</span>
                  <strong className="text-lg font-black text-slate-800">{trends?.totals.totalApproved || 0}</strong>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Rejected Transactions</span>
                  <strong className="text-lg font-black text-slate-800">{trends?.totals.totalRejected || 0}</strong>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Point to Coin Conversion Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="h-72 w-full">
                  {!chartData || chartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">No conversion trends recorded in the last 30 days.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="Points Used" stroke="#0ea5e9" fill="rgba(14, 165, 233, 0.15)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Approval Workflow Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={approvalChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Rejected" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
