'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/Dialog';
import { Button } from '@/src/components/ui/Button';
import { AvatarGrid } from './AvatarGrid';

type AvatarCustomizerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: string;
  onSave: (avatar: string) => Promise<void> | void;
};

export function AvatarCustomizerDialog({
  open,
  onOpenChange,
  current,
  onSave,
}: AvatarCustomizerDialogProps) {
  const [selected, setSelected] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelected(current);
      setError(null);
    }
  }, [open, current]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(selected);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your avatar. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-kids">
            <Sparkles className="h-5 w-5 text-brand-orange" />
            Customize your avatar
          </DialogTitle>
          <DialogDescription>
            Pick the explorer that represents you. Your choice is saved to your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex flex-col items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border-4 border-white bg-brand-orange/10 text-6xl shadow-lg">
            <span aria-hidden>{selected}</span>
          </div>
          <AvatarGrid value={selected} onChange={setSelected} className="w-full" />
          {error ? (
            <p role="alert" className="text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} isLoading={saving} disabled={saving}>
            Save avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
