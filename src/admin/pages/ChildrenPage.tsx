import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/Sheet';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Award, Flame, Star, Trophy, Search, UserCheck, UserX, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  familyId?: string;
  isActive: boolean;
  points: number;
  level: number;
  streak: number;
  avatar: string;
  createdAt: string;
  equipped?: {
    hat?: any;
    cape?: any;
    glasses?: any;
    pet?: any;
    suit?: any;
    background?: any;
  };
}

export function ChildrenPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChild, setSelectedChild] = useState<UserRow | null>(null);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    fetchUsers();
  }, [refreshTick]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<UserRow[]>('/users/all');
      setUsers(res.data || []);
    } catch (err) {
      toast.error('Failed to load children catalog');
    } finally {
      setLoading(false);
    }
  };

  const children = users.filter((u) => u.role === 'child');

  const filteredChildren = children.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query);
  });

  const getParentName = (familyId?: string) => {
    if (!familyId) return 'No Parent Link';
    const parent = users.find((u) => u.role === 'parent' && u.familyId === familyId);
    if (!parent) return 'Family Unlinked';
    return `${parent.firstName} ${parent.lastName}`;
  };

  const handleViewChild = (child: UserRow) => {
    setSelectedChild(child);
  };

  const toggleStatus = async (child: UserRow) => {
    try {
      const newStatus = !child.isActive;
      await api.patch(`/users/${child._id}`, { isActive: newStatus });
      toast.success(`Account status updated for ${child.firstName}`);
      setSelectedChild(selectedChild?._id === child._id ? { ...child, isActive: newStatus } : selectedChild);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update account status');
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Children"
        description="View child profiles, track points, streaks, and equipped avatar sets."
        action={
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search by child's name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-white border-slate-200"
            />
          </div>
        }
      />

      <Card className="border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-medium">Loading children catalog...</div>
          ) : filteredChildren.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">No children found matching filters.</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-600">Child Name</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Parent Account</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Points</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Streak</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Level</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Status</TableHead>
                  <TableHead className="text-right font-extrabold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child) => (
                  <TableRow key={child._id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-extrabold text-indigo-600 text-xs">
                          {child.firstName[0]}
                        </div>
                        <div>
                          <span className="block">{child.firstName} {child.lastName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Avatar: {child.avatar}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-semibold text-xs">
                      {getParentName(child.familyId)}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span>{child.points || 0} RP</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-orange-600 font-bold text-xs">
                        <Flame size={14} className="fill-orange-500 text-orange-500" />
                        <span>{child.streak || 0} days</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-extrabold text-slate-700">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] uppercase font-black">
                        Lvl {child.level || 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={child.isActive ? 'default' : 'destructive'} className="font-black">
                        {child.isActive ? 'Active' : 'Deactivated'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewChild(child)}
                        className="rounded-xl border-slate-200 font-bold hover:bg-slate-100 text-slate-700"
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DETAIL DRAWER */}
      <Sheet open={!!selectedChild} onOpenChange={(open) => !open && setSelectedChild(null)}>
        <SheetContent className="sm:max-w-md bg-white border-l border-slate-200 p-6 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Award className="text-indigo-500" size={20} />
              Child Profile Details
            </SheetTitle>
          </SheetHeader>

          {selectedChild && (
            <div className="space-y-6">
              {/* Header profile info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg">
                  {selectedChild.firstName[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800">
                    {selectedChild.firstName} {selectedChild.lastName}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">MEMBER SINCE {new Date(selectedChild.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Stats card grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-center">
                  <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block mb-1">Points</span>
                  <div className="flex items-center justify-center gap-1 text-sm font-black text-amber-800">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    {selectedChild.points || 0}
                  </div>
                </div>

                <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl text-center">
                  <span className="text-[9px] font-black text-orange-700 uppercase tracking-wider block mb-1">Streak</span>
                  <div className="flex items-center justify-center gap-1 text-sm font-black text-orange-800">
                    <Flame size={12} className="fill-orange-500 text-orange-500" />
                    {selectedChild.streak || 0}
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-center">
                  <span className="text-[9px] font-black text-indigo-700 uppercase tracking-wider block mb-1">Level</span>
                  <div className="flex items-center justify-center gap-1 text-sm font-black text-indigo-800">
                    <Trophy size={12} className="text-indigo-500" />
                    {selectedChild.level || 1}
                  </div>
                </div>
              </div>

              {/* Avatar inventory preview */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <Sparkles size={14} className="text-indigo-500" />
                  Currently Equipped Avatar
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Hat Accessory</span>
                    <span className="text-slate-700 font-extrabold">{selectedChild.equipped?.hat?.name || 'Standard'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Cape / Back</span>
                    <span className="text-slate-700 font-extrabold">{selectedChild.equipped?.cape?.name || 'Standard'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Glasses / Face</span>
                    <span className="text-slate-700 font-extrabold">{selectedChild.equipped?.glasses?.name || 'Standard'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Companion Pet</span>
                    <span className="text-slate-700 font-extrabold">{selectedChild.equipped?.pet?.name || 'Standard'}</span>
                  </div>
                </div>
              </div>

              {/* Status Action */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Administrative Actions</h4>
                <Button
                  variant="outline"
                  className={`w-full font-bold rounded-xl justify-start ${
                    selectedChild.isActive 
                      ? 'text-rose-600 hover:bg-rose-50 border-rose-200' 
                      : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                  }`}
                  onClick={() => toggleStatus(selectedChild)}
                >
                  {selectedChild.isActive ? (
                    <>
                      <UserX size={16} className="mr-2" /> Deactivate Child Profile
                    </>
                  ) : (
                    <>
                      <UserCheck size={16} className="mr-2" /> Activate Child Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
