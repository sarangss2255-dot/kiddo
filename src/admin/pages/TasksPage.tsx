import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DataTable } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Badge } from '@/src/components/ui/Badge';
import { Calendar, Layers } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    setLoading(true);
    api.get<TaskRow[]>('/admin/tasks')
      .then((response: { data: TaskRow[] }) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refreshTick]);

  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'morning': return '🌅';
      case 'bedtime': return '🛌';
      case 'homework': return '📚';
      case 'chores': return '🧹';
      case 'learning': return '🧠';
      default: return '⚙️';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Missions"
        description="Monitor child missions, categories, and point allocations."
        action={
          <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-bold px-3 py-1">
            {tasks.length} Missions
          </Badge>
        }
      />

      {loading ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 text-slate-400">
          Loading tasks database...
        </div>
      ) : (
        <DataTable
          columns={['Mission Title', 'Category', 'Workflow Status', 'Points Value', 'Creation Date']}
          rows={tasks.map((task) => [
            <span className="font-semibold text-slate-800" key={`title-${task._id}`}>{task.title}</span>,
            <span key={`cat-${task._id}`} className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="text-base">{getCategoryEmoji(task.category)}</span>
              <span className="capitalize">{task.category}</span>
            </span>,
            <Badge
              key={`status-${task._id}`}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border-none ${
                task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                task.status === 'review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {task.status}
            </Badge>,
            <div className="flex items-center gap-1 font-bold text-slate-700" key={`points-${task._id}`}>
              <span className="text-amber-500">★</span> {task.points}
            </div>,
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium" key={`date-${task._id}`}>
              <Calendar size={12} />
              {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>,
          ])}
        />
      )}
    </div>
  );
}
