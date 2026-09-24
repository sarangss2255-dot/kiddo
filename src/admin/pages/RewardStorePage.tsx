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
import { ShoppingBag, Search, Plus, Edit, Trash2, Coins } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface RewardStoreItem {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  coinCost: number;
  rewardPointCost: number;
  category: Category | string;
  rarity: string;
  isAvailable: boolean;
  isFeatured: boolean;
  unlockLevel: number;
  parentApprovalRequired: boolean;
}

export function RewardStorePage() {
  const [items, setItems] = useState<RewardStoreItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RewardStoreItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [coinCost, setCoinCost] = useState(5);
  const [rewardPointCost, setRewardPointCost] = useState(0);
  const [rarity, setRarity] = useState('common');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [unlockLevel, setUnlockLevel] = useState(1);
  const [parentApprovalRequired, setParentApprovalRequired] = useState(false);
  const refreshTick = useAdminRefresh();

  useEffect(() => {
    fetchData();
  }, [refreshTick]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get<RewardStoreItem[]>('/reward-store/admin/items'),
        api.get<Category[]>('/reward-store/categories/all'),
      ]);
      setItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setCategory(categoriesRes.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImageUrl('');
    if (categories.length > 0) setCategory(categories[0]._id);
    setCoinCost(5);
    setRewardPointCost(0);
    setRarity('common');
    setIsAvailable(true);
    setIsFeatured(false);
    setUnlockLevel(1);
    setParentApprovalRequired(false);
    setEditingItem(null);
  };

  const handleCreateOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Item name is required');
    if (!category) return toast.error('Category is required');

    const payload = {
      name,
      description,
      imageUrl,
      category,
      coinCost,
      rewardPointCost,
      rarity,
      isAvailable,
      isFeatured,
      unlockLevel,
      parentApprovalRequired,
    };

    try {
      if (editingItem) {
        await api.patch(`/reward-store/items/${editingItem._id}`, payload);
        toast.success('Reward store item updated successfully');
      } else {
        await api.post('/reward-store/items', payload);
        toast.success('Reward store item created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error('Failed to save store item');
    }
  };

  const handleEditClick = (item: RewardStoreItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setCategory(typeof item.category === 'object' ? item.category._id : item.category);
    setCoinCost(item.coinCost);
    setRewardPointCost(item.rewardPointCost);
    setRarity(item.rarity || 'common');
    setIsAvailable(item.isAvailable);
    setIsFeatured(item.isFeatured);
    setUnlockLevel(item.unlockLevel || 1);
    setParentApprovalRequired(item.parentApprovalRequired);
    setDialogOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store item?')) return;
    try {
      await api.delete(`/reward-store/items/${id}`);
      toast.success('Store item deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete store item');
    }
  };

  const getCategoryName = (cat: Category | string) => {
    if (typeof cat === 'object') return cat.name;
    const match = categories.find((c) => c._id === cat);
    return match ? match.name : 'Unknown';
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Marketplace"
        description="Configure items available in the KidDo reward store."
        action={
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-white border-slate-200"
              />
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold shadow-sm gap-2">
                <Plus size={16} /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white border-slate-100 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[85vh]">
              <DialogHeader>
                <DialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="text-sky-500" size={20} />
                  {editingItem ? 'Modify Store Item' : 'New Reward Store Item'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Item Name</label>
                  <Input
                    placeholder="e.g. Space Shuttle Bed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-slate-200 h-10 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Description</label>
                  <textarea
                    placeholder="Description of shop goodies..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm font-medium border border-slate-200 rounded-xl p-3 h-20 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-sm font-medium border border-slate-200 rounded-xl p-2.5 h-10 outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Rarity</label>
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
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1 text-slate-600">
                      <Coins size={12} className="text-amber-500 fill-amber-500" /> Coin Cost
                    </label>
                    <Input
                      type="number"
                      value={coinCost}
                      onChange={(e) => setCoinCost(Number(e.target.value))}
                      className="rounded-xl border-slate-200 h-10 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Unlock Level Required</label>
                    <Input
                      type="number"
                      value={unlockLevel}
                      onChange={(e) => setUnlockLevel(Number(e.target.value))}
                      className="rounded-xl border-slate-200 h-10 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Image Asset URL</label>
                  <Input
                    placeholder="https://imageUrl.png"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="rounded-xl border-slate-200 h-10 font-medium"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Item is available for purchase</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Feature this item on shop landing</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parentApprovalRequired}
                      onChange={(e) => setParentApprovalRequired(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Require parent approval before redemption</span>
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
                    Save Item
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
            <div className="p-8 text-center text-slate-400 font-medium">Loading store items...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">No items found matching filters.</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-600">Item Image</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Item Name</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Category</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Coin Cost</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Unlock Level</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Rarity</TableHead>
                  <TableHead className="font-extrabold text-slate-600">Availability</TableHead>
                  <TableHead className="text-right font-extrabold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">
                      <div>
                        <span className="block">{item.name}</span>
                        {item.isFeatured && (
                          <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 font-black text-[9px] px-1.5 py-0 rounded border-none">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-bold text-xs">
                      {getCategoryName(item.category)}
                    </TableCell>
                    <TableCell className="font-bold text-amber-600">
                      <div className="flex items-center gap-1.5">
                        <Coins size={14} className="fill-amber-500 text-amber-500" />
                        <span>{item.coinCost} Coins</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700 text-xs">
                      Lvl {item.unlockLevel || 1} Required
                    </TableCell>
                    <TableCell className="text-xs uppercase font-black text-indigo-500">
                      {item.rarity}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isAvailable ? 'default' : 'destructive'} className="font-black">
                        {item.isAvailable ? 'In Store' : 'Unavailable'}
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
