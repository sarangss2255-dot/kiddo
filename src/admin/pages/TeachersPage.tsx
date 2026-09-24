import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DataTable } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/src/components/ui/Dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/Table';
import { Plus, X, Eye, Lock, ToggleLeft, ToggleRight, Sparkles, GraduationCap, Users, Calendar } from 'lucide-react';

interface TeacherRow {
  _id: string;
  teacherCode: string;
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  status: string;
  totalClasses: number;
  totalStudents: number;
  totalTasksCreated: number;
  createdAt: string;
}

export function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', schoolName: '', phone: '' });
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRow | null>(null);
  const [detail, setDetail] = useState<{
    totalClasses: number;
    totalStudents: number;
    totalTasks: number;
    classes: any[];
    students: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const refreshTick = useAdminRefresh();

  const loadTeachers = () => {
    setLoading(true);
    api.get('/admin/teachers')
      .then((res: any) => {
        setTeachers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTeachers();
  }, [refreshTick]);

  const handleCreate = async () => {
    try {
      await api.post('/admin/teachers', form);
      setShowCreate(false);
      setForm({ fullName: '', email: '', schoolName: '', phone: '' });
      loadTeachers();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to create teacher');
    }
  };

  const handleDisable = async (id: string) => {
    if (!confirm('Disable this teacher account?')) return;
    await api.patch(`/admin/teachers/${id}/disable`);
    loadTeachers();
    if (selectedTeacher?._id === id) {
      setSelectedTeacher(null);
      setDetail(null);
    }
  };

  const handleEnable = async (id: string) => {
    await api.patch(`/admin/teachers/${id}/enable`);
    loadTeachers();
  };

  const handleReset = async (id: string) => {
    if (!confirm('Reset teacher password? Account credentials will revert.')) return;
    await api.post(`/admin/teachers/${id}/reset-password`);
    loadTeachers();
  };

  const viewDetail = async (teacher: TeacherRow) => {
    setSelectedTeacher(teacher);
    try {
      const [statsRes, classesRes, studentsRes] = await Promise.all([
        api.get(`/admin/teachers/${teacher._id}/stats`),
        api.get(`/admin/teachers/${teacher._id}/classes`),
        api.get(`/admin/teachers/${teacher._id}/students`),
      ]);
      setDetail({
        totalClasses: statsRes.data.totalClasses,
        totalStudents: statsRes.data.totalStudents,
        totalTasks: statsRes.data.totalTasks,
        classes: classesRes.data,
        students: studentsRes.data,
      });
    } catch (_) {}
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <PageHeader
        title="Teachers"
        description="Manage school partnerships, classes, and credentials."
        action={
          <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Teacher Account
          </Button>
        }
      />

      {/* Main teacher table list */}
      {loading ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 text-slate-400">
          Loading teachers roster...
        </div>
      ) : (
        <DataTable
          columns={['Code', 'Supervisor Name', 'Email Address', 'School Partnership', 'Status', 'Classes', 'Students', 'Actions']}
          rows={teachers.map((t) => [
            <strong key={`code-${t._id}`} className="font-mono text-sky-600 font-bold">{t.teacherCode}</strong>,
            <span key={`name-${t._id}`} className="font-semibold text-slate-800">{t.fullName}</span>,
            <span key={`email-${t._id}`} className="text-slate-600">{t.email}</span>,
            <span key={`school-${t._id}`} className="text-slate-600 font-medium">{t.schoolName}</span>,
            <Badge
              key={`status-${t._id}`}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border-none ${
                t.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                t.status === 'disabled' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {t.status}
            </Badge>,
            <span key={`classes-${t._id}`} className="font-bold text-slate-600">{t.totalClasses}</span>,
            <span key={`students-${t._id}`} className="font-bold text-slate-600">{t.totalStudents}</span>,
            <div key={`actions-${t._id}`} className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-8 px-2 text-sky-600" onClick={() => viewDetail(t)}>
                <Eye size={14} className="mr-1" /> View
              </Button>
              {t.status === 'active' ? (
                <Button size="sm" variant="ghost" className="h-8 px-2 text-rose-600" onClick={() => handleDisable(t._id)}>
                  Disable
                </Button>
              ) : t.status === 'disabled' ? (
                <Button size="sm" variant="ghost" className="h-8 px-2 text-emerald-600" onClick={() => handleEnable(t._id)}>
                  Enable
                </Button>
              ) : null}
              <Button size="sm" variant="ghost" className="h-8 px-2 text-slate-500" onClick={() => handleReset(t._id)}>
                Reset
              </Button>
            </div>,
          ])}
        />
      )}

      {/* CREATE TEACHER DIALOG MODAL */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="text-sky-500" size={22} />
              Register Teacher
            </DialogTitle>
            <DialogDescription>Create a teacher credentials login and associate them with a school.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="font-semibold text-slate-600">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Dr. Sarah Jenkins"
                value={form.fullName}
                onChange={e => setForm(s => ({ ...s, fullName: e.target.value }))}
                className="border-slate-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-slate-600">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jenkins@school.edu"
                value={form.email}
                onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                className="border-slate-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schoolName" className="font-semibold text-slate-600">School / Academy Name</Label>
              <Input
                id="schoolName"
                placeholder="Oakwood Academy"
                value={form.schoolName}
                onChange={e => setForm(s => ({ ...s, schoolName: e.target.value }))}
                className="border-slate-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="font-semibold text-slate-600">Phone Contact (Optional)</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 019-2834"
                value={form.phone}
                onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
                className="border-slate-200"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-slate-200" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DETAIL DRAWER / SECTION */}
      {selectedTeacher && detail && (
        <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden animate-scale-up">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/20 p-6">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold text-slate-800">{selectedTeacher.fullName}</CardTitle>
                <Badge variant="outline" className="border-slate-200 text-slate-600">{selectedTeacher.schoolName}</Badge>
              </div>
              <p className="text-sm text-slate-400 font-mono mt-1">Teacher Code: {selectedTeacher.teacherCode}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setSelectedTeacher(null); setDetail(null); }}>
              <X size={18} />
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Numeric Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-sky-50/30 rounded-2xl border border-sky-100/30 flex items-center gap-4">
                <div className="p-3 bg-sky-100/50 rounded-xl text-sky-600"><Users size={20} /></div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800">{detail.totalStudents}</div>
                  <div className="text-xs text-slate-500 font-medium">Students Monitored</div>
                </div>
              </div>
              <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/30 flex items-center gap-4">
                <div className="p-3 bg-emerald-100/50 rounded-xl text-emerald-600"><GraduationCap size={20} /></div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800">{detail.totalClasses}</div>
                  <div className="text-xs text-slate-500 font-medium">Active Classes</div>
                </div>
              </div>
              <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100/30 flex items-center gap-4">
                <div className="p-3 bg-purple-100/50 rounded-xl text-purple-600"><Sparkles size={20} /></div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800">{detail.totalTasks}</div>
                  <div className="text-xs text-slate-500 font-medium">Tasks Submissions</div>
                </div>
              </div>
            </div>

            {/* Classes Table */}
            {detail.classes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-slate-700">Assigned Classes</h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Class Name</TableHead>
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Grade</TableHead>
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Class Code</TableHead>
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Students Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.classes.map((c: any) => (
                        <TableRow key={c._id} className="border-slate-100 hover:bg-slate-50/30">
                          <TableCell className="px-4 py-3 font-semibold text-slate-800">{c.className}</TableCell>
                          <TableCell className="px-4 py-3 text-slate-600">Grade {c.grade}</TableCell>
                          <TableCell className="px-4 py-3 font-mono text-xs text-slate-500">{c.classCode}</TableCell>
                          <TableCell className="px-4 py-3 font-bold text-slate-700">{c.totalStudents}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Students Table */}
            {detail.students.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-slate-700">Student Progress Roster</h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Student Name</TableHead>
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Stars Balance</TableHead>
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Streak</TableHead>
                        <TableHead className="font-bold text-slate-600 px-4 py-3">Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.students.map((s: any) => (
                        <TableRow key={s._id} className="border-slate-100 hover:bg-slate-50/30">
                          <TableCell className="px-4 py-3 font-semibold text-slate-800">{s.firstName} {s.lastName || ''}</TableCell>
                          <TableCell className="px-4 py-3 font-bold text-slate-700">★ {s.points}</TableCell>
                          <TableCell className="px-4 py-3 text-orange-500 font-bold">{s.streak} Days</TableCell>
                          <TableCell className="px-4 py-3 font-bold text-slate-600">Lv. {s.level}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
