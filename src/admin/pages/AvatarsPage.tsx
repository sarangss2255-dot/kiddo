import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAdminRefresh } from '../common/useAdminRefresh';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/Dialog';
import { User, Search, Plus, Edit, Trash2, Coins } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rarity: string;
  assetId: string;
  thumbnail: string;
  unlockLevel: number;
  premium: boolean;
  isAvailable: boolean;
}

const CATEGORIES = [
  'hair', 'eyes', 'eyebrows', 'mouth', 'skin',
  'top', 'bottom', 'shoes',
  'hat', 'glasses', 'necklace', 'watch',
  'back', 'pet', 'hand', 'effect', 'pose'
];

export function AvatarsPage() {
  const [items, setItems] = useState<AvatarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AvatarItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('hair');
  const [price, setPrice] = useState(10);
  const [rarity, setRarity] = useState('common');
  const [assetId, setAssetId] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [unlockLevel, setUnlockLevel] = useState(1);
  const [premium, setPremium] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    fetchItems();
  }, [refreshTick]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get<AvatarItem[]>('/admin/avatars');
      setItems(res.data || []);
    } catch (err) {
      toast.error('Failed to load avatar catalog');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('hair');
    setPrice(10);
    setRarity('common');
    setAssetId('');
    setThumbnail('');
    setUnlockLevel(1);
    setPremium(false);
    setIsAvailable(true);
    setEditingItem(null);
  };

  const handleCreateOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Item name is required');
    if (!assetId.trim()) return toast.error('Asset ID is required');

    const payload = {
      name,
      description,
      category,
      price,
      rarity,
      assetId,
      thumbnail: thumbnail || assetId,
      unlockLevel,
      premium,
      isAvailable
    };

    try {
      if (editingItem) {
        await api.patch(`/admin/avatars/${editingItem._id}`, payload);
        toast.success('Avatar accessory updated successfully');
      } else {
        await api.post('/admin/avatars', payload);
        toast.success('Avatar accessory created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (err) {
      toast.error('Failed to save avatar accessory');
    }
  };

  const handleEditClick = (item: AvatarItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setCategory(item.category);
    setPrice(item.price);
    setRarity(item.rarity || 'common');
    setAssetId(item.assetId);
    setThumbnail(item.thumbnail || '');
    setUnlockLevel(item.unlockLevel || 1);
    setPremium(item.premium || false);
    setIsAvailable(item.isAvailable);
    setDialogOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this avatar item?')) return;
    try {
      await api.delete(`/admin/avatars/${id}`);
      toast.success('Avatar item deleted successfully');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete avatar item');
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Avatars"
        description="Manage the avatar catalog kids equip on their profiles."
        action={
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search accessories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-white border-slate-200"
              />
            </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold shadow-sm gap-2">
                <Plus size={16} /> Add Accessory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white border-slate-100 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[85vh]">
              <DialogHeader>
                <DialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <User className="text-sky-500" size={20} />
                  {editingItem ? 'Edit Avatar Item' : 'New Avatar Item'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Accessory Name</label>
                  <Input
                    placeholder="e.g. Laser Glasses"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-slate-200 h-10 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Description</label>
                  <textarea
                    placeholder="Describe item attributes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm font-medium border border-slate-200 rounded-xl p-3 h-20 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Category Type</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-sm font-medium border border-slate-200 rounded-xl p-2.5 h-10 outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Rarity Tier</label>
                    <select
                      value={rarity}
                      onChange={(e) => setRarity(e.target.value)}
                      className="w-full text-sm font-medium border border-slate-200 rounded-xl p-2.5 h-10 outline-none"
                    >
                      <option value="common">Common</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
                      <option value="mythic">Mythic</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Coins size={12} className="text-amber-500 fill-amber-500" /> Coin Price
                    </label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="rounded-xl border-slate-200 h-10 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Unlock Level</label>
                    <Input
                      type="number"
                      value={unlockLevel}
                      onChange={(e) => setUnlockLevel(Number(e.target.value))}
                      className="rounded-xl border-slate-200 h-10 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Asset Reference Identifier</label>
                  <Input
                    placeholder="e.g. hat_laser_01"
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    className="rounded-xl border-slate-200 h-10 font-medium"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Accessory is currently available in shop</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={premium}
                      onChange={(e) => setPremium(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Premium / Subscribed Users Exclusive</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setDialogOpen(false); resetForm(); }}
                    className="h-10 rounded-xl font-bold border-slate-200 hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6"
                  >
                    Save Accessory
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        }
      />

      <Card className="border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-medium">Loading avatar catalog...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">No items found matching filters.</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-600">Accessory Name</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Category</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Price</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Unlock Level</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Rarity</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Premium</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Status</TableHead>
                  <TableHead className="text-right font-extrabold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">
                      <div>
                        <span className="block">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{item.assetId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-bold text-xs uppercase">
                      {item.category}
                    </TableCell>
                    <TableCell className="font-bold text-amber-600">
                      <div className="flex items-center gap-1">
                        <Coins size={14} className="fill-amber-500 text-amber-500" />
                        <span>{item.price} Coins</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700 text-xs">
                      Lvl {item.unlockLevel || 1}
                    </TableCell>
                    <TableCell className="text-xs uppercase font-black text-indigo-500">
                      {item.rarity}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.premium ? 'default' : 'secondary'} className="font-black">
                        {item.premium ? 'Premium' : 'Free Item'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isAvailable ? 'default' : 'destructive'} className="font-black">
                        {item.isAvailable ? 'Active' : 'Archived'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(item)}
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item._id)}
                          className="h-8 w-8 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
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
