import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DataTable } from '../components/DataTable';

interface TaskRow {
  _id: string;
  title: string;
  category: string;
  status: string;
  points: number;
  createdAt: string;
}

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);

  useEffect(() => {
    api.get<TaskRow[]>('/admin/tasks').then((response: { data: TaskRow[] }) => setTasks(response.data)).catch(() => {});
  }, []);

  return (
    <div className="stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Moderation</p>
          <h2>Task oversight</h2>
        </div>
      </div>
      <DataTable
        columns={['Title', 'Category', 'Status', 'Points', 'Created']}
        rows={tasks.map((task) => [
          task.title,
          task.category,
          task.status,
          task.points,
          new Date(task.createdAt).toLocaleDateString(),
        ])}
      />
    </div>
  );
}
