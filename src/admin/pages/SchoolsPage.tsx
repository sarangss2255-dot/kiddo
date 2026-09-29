import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Separator } from '../../components/ui/Separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/Dialog';
import { Building2, Plus, Users, GraduationCap, BookOpen, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface School {
  _id: string;
  name: string;
  code: string;
  address?: { city?: string; state?: string; country?: string };
  contact?: { phone?: string; email?: string };
  status: 'active' | 'suspended' | 'archived';
  classCount?: number;
}

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

interface SchoolClass {
  _id: string;
  name: string;
  classCode: string;
  status: string;
  studentCount?: number;
  teacherCount?: number;
  teachers?: { _id: string; name: string }[];
  gradeId?: { name?: string; level?: number };
  sectionId?: { name?: string };
}

interface ClassStudent {
  _id: string;
  firstName: string;
  lastName: string;
  points?: number;
  standard?: number;
}

interface AcademicYear {
  _id: string;
  name: string;
  status: string;
}

interface Grade {
  _id: string;
  name: string;
  level: number;
}

interface Section {
  _id: string;
  name: string;
}

function unwrap<T>(response: any): T {
  const body = response?.data;
  return (body && typeof body === 'object' && 'success' in body ? body.data : body) as T;
}

export function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<School | null>(null);
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const refreshTick = useAdminRefresh();

  // Create school dialog
  const [schoolDialogOpen, setSchoolDialogOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolState, setSchoolState] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');

  // Create class dialog
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [academicYearId, setAcademicYearId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [yearName, setYearName] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [gradeName, setGradeName] = useState('');
  const [gradeLevel, setGradeLevel] = useState(1);
  const [sectionName, setSectionName] = useState('');

  // Students dialog
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [studentsClass, setStudentsClass] = useState<SchoolClass | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    void loadSchools();
  }, [refreshTick]);

  useEffect(() => {
    if (selected) void loadSchoolDetail(selected._id);
  }, [selected]);

  useEffect(() => {
    if (gradeId) void loadSections(gradeId);
    else setSections([]);
  }, [gradeId]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const res = await api.get('/school');
      setSchools(unwrap<School[]>(res) ?? []);
    } catch {
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolDetail = async (schoolId: string) => {
    try {
      const [statsRes, classesRes, yearsRes, gradesRes] = await Promise.all([
        api.get(`/school/${schoolId}/stats`),
        api.get(`/school/${schoolId}/classes`),
        api.get(`/school/${schoolId}/academic-years/active`).catch(() => null),
        api.get(`/school/${schoolId}/grades`).catch(() => null),
      ]);
      setStats(unwrap<SchoolStats>(statsRes));
      setClasses(unwrap<SchoolClass[]>(classesRes) ?? []);
      const activeYear = yearsRes ? unwrap<AcademicYear | null>(yearsRes) : null;
      setAcademicYears(activeYear ? [activeYear] : []);
      if (activeYear) setAcademicYearId(activeYear._id);
      setGrades(gradesRes ? unwrap<Grade[]>(gradesRes) ?? [] : []);
    } catch {
      toast.error('Failed to load school details');
    }
  };

  const loadSections = async (selectedGradeId: string) => {
    try {
      const res = await api.get(`/school/grades/${selectedGradeId}/sections`);
      setSections(unwrap<Section[]>(res) ?? []);
    } catch {
      setSections([]);
    }
  };

  const handleCreateSchool = async (e: FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !schoolCode.trim()) {
      return toast.error('School name and code are required');
    }
    try {
      await api.post('/school', {
        name: schoolName.trim(),
        code: schoolCode.trim().toUpperCase(),
        address: { city: schoolCity.trim(), state: schoolState.trim() },
        contact: { phone: schoolPhone.trim(), email: schoolEmail.trim() },
      });
      toast.success('School created');
      setSchoolDialogOpen(false);
      setSchoolName('');
      setSchoolCode('');
      setSchoolCity('');
      setSchoolState('');
      setSchoolPhone('');
      setSchoolEmail('');
      await loadSchools();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create school');
    }
  };

  const handleCreateYear = async () => {
    if (!selected) return;
    if (!yearName.trim() || !yearStart || !yearEnd) {
      return toast.error('Year name, start and end dates are required');
    }
    try {
      const res = await api.post(`/school/${selected._id}/academic-years`, {
        name: yearName.trim(),
        startDate: new Date(yearStart).toISOString(),
        endDate: new Date(yearEnd).toISOString(),
        status: 'active',
      });
      const year = unwrap<AcademicYear>(res);
      setAcademicYears((prev) => [...prev, year]);
      setAcademicYearId(year._id);
      toast.success('Academic year created');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create academic year');
    }
  };

  const handleCreateGrade = async () => {
    if (!selected || !academicYearId) {
      return toast.error('Create/select an academic year first');
    }
    if (!gradeName.trim() || !gradeLevel) {
      return toast.error('Grade name and level are required');
    }
    try {
      const res = await api.post(`/school/${selected._id}/grades`, {
        academicYearId,
        name: gradeName.trim(),
        level: Number(gradeLevel),
      });
      const grade = unwrap<Grade>(res);
      setGrades((prev) => [...prev, grade]);
      setGradeId(grade._id);
      toast.success('Grade created');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create grade');
    }
  };

  const handleCreateSection = async () => {
    if (!selected || !gradeId) {
      return toast.error('Create/select a grade first');
    }
    if (!sectionName.trim()) {
      return toast.error('Section name is required');
    }
    try {
      const res = await api.post(`/school/${selected._id}/grades/${gradeId}/sections`, {
        name: sectionName.trim(),
      });
      const section = unwrap<Section>(res);
      setSections((prev) => [...prev, section]);
      setSectionId(section._id);
      toast.success('Section created');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create section');
    }
  };

  const handleCreateClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!academicYearId || !gradeId || !sectionId) {
      return toast.error('Academic year, grade and section are required');
    }
    if (!className.trim() || !classCode.trim()) {
      return toast.error('Class name and code are required');
    }
    try {
      await api.post('/school/classes', {
        schoolId: selected._id,
        academicYearId,
        gradeId,
        sectionId,
        name: className.trim(),
        classCode: classCode.trim().toUpperCase(),
      });
      toast.success('Class created');
      setClassDialogOpen(false);
      setClassName('');
      setClassCode('');
      await loadSchoolDetail(selected._id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create class');
    }
  };

  const openStudents = async (cls: SchoolClass) => {
    setStudentsClass(cls);
    setStudentsOpen(true);
    setStudents([]);
    setStudentsLoading(true);
    try {
      const res = await api.get(`/school/classes/${cls._id}/students`);
      setStudents(unwrap<ClassStudent[]>(res) ?? []);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  const reloadSelected = () => selected && loadSchoolDetail(selected._id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Schools"
        description="Manage schools, academic structure, classes and rosters."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={reloadSelected} disabled={!selected}>
              <RefreshCw size={15} />
              Refresh
            </Button>
            <Dialog open={schoolDialogOpen} onOpenChange={setSchoolDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={15} />
                  New School
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create school</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSchool} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="school-name">Name</Label>
                      <Input id="school-name" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Sunrise International" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="school-code">Code</Label>
                      <Input id="school-code" value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} placeholder="SIS-001" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="school-city">City</Label>
                      <Input id="school-city" value={schoolCity} onChange={(e) => setSchoolCity(e.target.value)} placeholder="Pune" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="school-state">State</Label>
                      <Input id="school-state" value={schoolState} onChange={(e) => setSchoolState(e.target.value)} placeholder="MH" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="school-phone">Phone</Label>
                      <Input id="school-phone" value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)} placeholder="+91 ..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="school-email">Email</Label>
                      <Input id="school-email" type="email" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} placeholder="office@school.com" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Create school</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        {/* School list */}
        <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-sm text-slate-400">Loading schools...</div>
            ) : schools.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">No schools yet. Create the first one.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {schools.map((school) => (
                  <button
                    key={school._id}
                    type="button"
                    onClick={() => setSelected(school)}
                    className={`w-full text-left p-4 transition-colors hover:bg-slate-50 ${
                      selected?._id === school._id ? 'bg-sky-50/70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                        <Building2 size={18} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-slate-800 truncate">{school.name}</span>
                        <span className="block text-xs text-slate-500 font-medium">
                          {school.code}
                          {school.address?.city ? ` · ${school.address.city}` : ''}
                          {typeof school.classCount === 'number' ? ` · ${school.classCount} classes` : ''}
                        </span>
                      </span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* School detail */}
        {selected ? (
          <div className="space-y-6">
            <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">{selected.name}</h2>
                    <p className="text-sm text-slate-500 font-medium">
                      {selected.code} · {selected.address?.city || 'No city'} · {selected.status}
                    </p>
                  </div>
                  <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus size={15} />
                        New Class
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create class</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-5">
                        {/* Academic year */}
                        <div className="space-y-2">
                          <Label>Academic year</Label>
                          {academicYears.length > 0 ? (
                            <select
                              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm"
                              value={academicYearId}
                              onChange={(e) => setAcademicYearId(e.target.value)}
                            >
                              <option value="">Select year</option>
                              {academicYears.map((year) => (
                                <option key={year._id} value={year._id}>{year.name}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="2026-27" value={yearName} onChange={(e) => setYearName(e.target.value)} />
                              <Input type="date" value={yearStart} onChange={(e) => setYearStart(e.target.value)} />
                              <Input type="date" value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} />
                              <Button type="button" variant="outline" onClick={handleCreateYear}>Create year</Button>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Grade */}
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          {grades.length > 0 ? (
                            <select
                              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm"
                              value={gradeId}
                              onChange={(e) => setGradeId(e.target.value)}
                            >
                              <option value="">Select grade</option>
                              {grades.map((grade) => (
                                <option key={grade._id} value={grade._id}>
                                  {grade.name} (Level {grade.level})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="Grade 5" value={gradeName} onChange={(e) => setGradeName(e.target.value)} />
                              <Input
                                type="number"
                                min={1}
                                max={12}
                                value={gradeLevel}
                                onChange={(e) => setGradeLevel(Number(e.target.value))}
                              />
                              <Button type="button" variant="outline" className="col-span-2" onClick={handleCreateGrade}>
                                Create grade
                              </Button>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Section */}
                        <div className="space-y-2">
                          <Label>Section</Label>
                          {sections.length > 0 ? (
                            <select
                              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm"
                              value={sectionId}
                              onChange={(e) => setSectionId(e.target.value)}
                            >
                              <option value="">Select section</option>
                              {sections.map((section) => (
                                <option key={section._id} value={section._id}>{section.name}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="grid grid-cols-[1fr_auto] gap-2">
                              <Input placeholder="A" value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
                              <Button type="button" variant="outline" onClick={handleCreateSection}>Create section</Button>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <form onSubmit={handleCreateClass} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="class-name">Class name</Label>
                              <Input id="class-name" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Grade 5 - A" />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="class-code">Class code</Label>
                              <Input id="class-code" value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="G5A-001" />
                            </div>
                          </div>
                          <Button type="submit" className="w-full">Create class</Button>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {stats && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="rounded-2xl bg-sky-50/60 border border-sky-100 p-4">
                      <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wide">
                        <Users size={14} /> Students
                      </div>
                      <div className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalStudents}</div>
                    </div>
                    <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wide">
                        <GraduationCap size={14} /> Teachers
                      </div>
                      <div className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalTeachers}</div>
                    </div>
                    <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-4">
                      <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wide">
                        <BookOpen size={14} /> Classes
                      </div>
                      <div className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalClasses}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardContent className="p-0">
                {classes.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No classes yet. Use “New Class” to add one.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Grade / Section</TableHead>
                        <TableHead>Teachers</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.map((cls) => (
                        <TableRow key={cls._id}>
                          <TableCell>
                            <div className="font-semibold text-slate-800">{cls.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{cls.classCode}</div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {cls.gradeId?.name ?? '—'}
                            {cls.sectionId?.name ? ` · ${cls.sectionId.name}` : ''}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {cls.teacherCount ?? 0}
                            {cls.teachers && cls.teachers.length > 0
                              ? ` (${cls.teachers.map((t) => t.name).join(', ')})`
                              : ''}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">{cls.studentCount ?? 0}</TableCell>
                          <TableCell>
                            <Badge variant={cls.status === 'active' ? 'success' : 'secondary'}>
                              {cls.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => openStudents(cls)}>
                              <Users size={14} />
                              Students
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border border-dashed border-slate-200 bg-white/60">
            <CardContent className="p-12 text-center text-slate-400 text-sm">
              Select a school to view its academic structure and classes.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Students dialog */}
      <Dialog open={studentsOpen} onOpenChange={setStudentsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {studentsClass ? `${studentsClass.name} · Students` : 'Students'}
            </DialogTitle>
          </DialogHeader>
          {studentsLoading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading roster...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No students enrolled in this class yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-semibold text-slate-700">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{student.standard ?? '—'}</TableCell>
                    <TableCell className="text-sm text-slate-600">{student.points ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
