import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DataTable } from '../components/DataTable';

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

  useEffect(() => {
    api.get<UserRow[]>('/users/all').then((response: { data: UserRow[] }) => setUsers(response.data)).catch(() => {});
  }, []);

  return (
    <div className="stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">User Management</p>
          <h2>Parents and children</h2>
        </div>
      </div>
      <DataTable
        columns={['Name', 'Role', 'Identifier', 'Points']}
        rows={users.map((user) => [
          `${user.firstName} ${user.lastName}`,
          user.role,
          user.email ?? user.username ?? '-',
          user.points ?? 0,
        ])}
      />
    </div>
  );
}
