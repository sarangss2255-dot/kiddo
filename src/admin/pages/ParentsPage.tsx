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
import { Users, Mail, Calendar, UserCheck, UserX, Search, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  familyId?: string;
  isActive: boolean;
  createdAt: string;
}

export function ParentsPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<UserRow | null>(null);
  const [familyChildren, setFamilyChildren] = useState<UserRow[]>([]);
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
      toast.error('Failed to load parents catalog');
    } finally {
      setLoading(false);
    }
  };

  const parents = users.filter((u) => u.role === 'parent');

  const filteredParents = parents.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const email = (p.email || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const getChildrenCount = (familyId?: string) => {
    if (!familyId) return 0;
    return users.filter((u) => u.role === 'child' && u.familyId === familyId).length;
  };

  const handleViewParent = (parent: UserRow) => {
    setSelectedParent(parent);
    if (parent.familyId) {
      const kids = users.filter((u) => u.role === 'child' && u.familyId === parent.familyId);
      setFamilyChildren(kids);
    } else {
      setFamilyChildren([]);
    }
  };

  const toggleStatus = async (parent: UserRow) => {
    try {
      const newStatus = !parent.isActive;
      await api.patch(`/users/${parent._id}`, { isActive: newStatus });
      toast.success(`Account status updated for ${parent.firstName}`);
      setSelectedParent(selectedParent?._id === parent._id ? { ...parent, isActive: newStatus } : selectedParent);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update account status');
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Parents"
        description="Manage KidDo family accounts."
        action={
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search by name or email..."
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
            <div className="p-8 text-center text-slate-400 font-medium">Loading parents catalog...</div>
          ) : filteredParents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">No parents found matching filters.</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-600">Parent Name</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Email Address</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Children Count</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Status</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Registered</TableHead>
                  <TableHead className="text-right font-extrabold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent) => (
                  <TableRow key={parent._id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">
                      {parent.firstName} {parent.lastName}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{parent.email}</TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                        {getChildrenCount(parent.familyId)} Kids
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={parent.isActive ? 'default' : 'destructive'} className="font-black">
                        {parent.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs font-semibold">
                      {new Date(parent.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewParent(parent)}
                        className="rounded-xl border-slate-200 font-bold hover:bg-slate-100 text-slate-700"
                      >
                        Manage
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
      <Sheet open={!!selectedParent} onOpenChange={(open) => !open && setSelectedParent(null)}>
        <SheetContent className="sm:max-w-md bg-white border-l border-slate-200 p-6 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Users className="text-sky-500" size={20} />
              Parent Configuration
            </SheetTitle>
          </SheetHeader>

          {selectedParent && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-black text-base">
                    {selectedParent.firstName[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800">
                      {selectedParent.firstName} {selectedParent.lastName}
                    </h3>
                    <Badge variant={selectedParent.isActive ? 'default' : 'destructive'} className="font-black mt-1">
                      {selectedParent.isActive ? 'Active Parent' : 'Suspended'}
                    </Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/50 space-y-2 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span>{selectedParent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Joined {new Date(selectedParent.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedParent.familyId && (
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={14} className="text-slate-400" />
                      <span>Family Reference: {selectedParent.familyId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Children List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Children Registered</h4>
                {familyChildren.length === 0 ? (
                  <p className="text-xs text-slate-500 font-semibold p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                    No children added to this family dashboard yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {familyChildren.map((kid) => (
                      <div key={kid._id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs uppercase">
                            {kid.firstName[0]}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-800 text-xs">{kid.firstName}</span>
                            <span className="text-[10px] text-slate-400 font-medium block">Child Profile</span>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 hover:bg-purple-100 text-purple-700 font-black text-[10px] rounded-full border-none">
                          Registered
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Administrative Settings</h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className={`font-bold rounded-xl justify-start ${
                      selectedParent.isActive 
                        ? 'text-rose-600 hover:bg-rose-50 border-rose-200' 
                        : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                    }`}
                    onClick={() => toggleStatus(selectedParent)}
                  >
                    {selectedParent.isActive ? (
                      <>
                        <UserX size={16} className="mr-2" /> Suspend Parent Account
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} className="mr-2" /> Activate Parent Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
