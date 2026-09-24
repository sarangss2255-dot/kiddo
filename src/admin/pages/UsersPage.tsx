import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DataTable } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Badge } from '@/src/components/ui/Badge';
import { User, ShieldAlert } from 'lucide-react';

interface UserRow {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  username?: string;
  points?: number;
}

export function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    setLoading(true);
    api.get<UserRow[]>('/users/all')
      .then((response: { data: UserRow[] }) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refreshTick]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="All Users"
        description="Roster of all parent, child, and teacher accounts."
        action={
          <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-bold px-3 py-1">
            {users.length} Users Total
          </Badge>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center p-12 border border-slate-100 bg-white rounded-2xl text-slate-400">
          Fetching users list...
        </div>
      ) : (
        <DataTable
          columns={['User Profile', 'Account Role', 'Identifier', 'Points Accumulated']}
          rows={users.map((user) => [
            <div className="flex items-center gap-3" key={user._id}>
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-100 uppercase">
                {user.firstName[0]}
              </div>
              <div>
                <div className="font-semibold text-slate-800">{user.firstName} {user.lastName}</div>
                <div className="text-[10px] text-slate-400 font-medium">ID: {user._id}</div>
              </div>
            </div>,
            <Badge
              key={`role-${user._id}`}
              variant={
                user.role === 'admin' ? 'accent' :
                user.role === 'parent' ? 'default' : 'secondary'
              }
              className={`font-semibold capitalize rounded-full px-3 py-0.5 text-xs ${
                user.role === 'admin' ? 'bg-amber-100 text-amber-800 border-none' :
                user.role === 'parent' ? 'bg-emerald-100 text-emerald-800 border-none' :
                'bg-sky-100 text-sky-800 border-none'
              }`}
            >
              {user.role}
            </Badge>,
            <span className="font-mono text-xs text-slate-600" key={`email-${user._id}`}>
              {user.email ?? user.username ?? '-'}
            </span>,
            <div className="flex items-center gap-1.5 font-bold text-slate-700" key={`points-${user._id}`}>
              <span className="text-amber-500">★</span> {user.points ?? 0}
            </div>
          ])}
        />
      )}
    </div>
  );
}
