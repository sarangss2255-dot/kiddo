import { motion } from 'motion/react';
import type { ReactNode } from 'react';

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
      whileHover={{ scale: 1.02, translateY: -4 }}
      className="metric-card"
    >
      <div className="metric-card__icon">{icon}</div>
      <div>
        <p className="eyebrow">{label}</p>
        <h3>{value}</h3>
        <p className="muted">{hint}</p>
      </div>
    </motion.div>
  );
}
