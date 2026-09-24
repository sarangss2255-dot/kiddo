import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';

export function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, translateY: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full border border-slate-100 hover:border-sky-200 transition-colors shadow-sm bg-white overflow-hidden">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">{label}</span>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
            <p className="text-[11px] text-slate-500 font-medium">{hint}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
