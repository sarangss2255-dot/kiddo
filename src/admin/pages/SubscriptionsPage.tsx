import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function SubscriptionsPage() {
  const [parents, setParents] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    fetchParents();
  }, [refreshTick]);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const res = await api.get<UserRow[]>('/users/all');
      setParents((res.data || []).filter((u) => u.role === 'parent'));
    } catch (err) {
      toast.error('Failed to load parent records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subscriptions"
        description="Monitor platform billing structures and active package tiers."
      />

      {/* Premium Platform Info */}
      <Card className="border-sky-200 bg-sky-50/40 rounded-2xl p-5 shadow-sm">
        <CardContent className="p-0 flex items-start gap-4">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl border border-sky-200">
            <ShieldCheck size={24} className="fill-sky-100" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-sky-950">Default Platform Policy</h3>
            <p className="text-xs text-sky-800/80 font-bold leading-relaxed max-w-2xl">
              All active family dashboards are configured with complimentary premium tier access. Advertising filters are set to disabled across all child companion applications.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-medium">Loading subscriber list...</div>
          ) : parents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">No parent accounts registered.</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-600">Subscriber Name</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Billing Email</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Active Tier</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Plan Term</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Payment Status</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.map((parent) => (
                  <TableRow key={parent._id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">
                      {parent.firstName} {parent.lastName}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{parent.email}</TableCell>
                    <TableCell className="font-extrabold text-indigo-600 text-xs">
                      Complimentary Premium
                    </TableCell>
                    <TableCell className="font-bold text-slate-600 text-xs">
                      Lifetime License
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-700 font-black border-none text-[9px] px-2.5 rounded-full">
                        Active (Ad-free)
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs font-semibold">
                      {new Date(parent.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
