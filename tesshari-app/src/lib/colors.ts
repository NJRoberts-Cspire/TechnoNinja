export const CATEGORY_COLOR: Record<string, string> = {
  capstone: 'bg-orange-500',
  combat: 'bg-red-500',
  defense: 'bg-blue-400',
  control: 'bg-purple-400',
  mobility: 'bg-green-400',
  utility: 'bg-yellow-500',
  passive: 'bg-slate-500',
  power: 'bg-pink-500',
  reaction: 'bg-cyan-400',
  subclass: 'bg-accent-gold',
  misc: 'bg-slate-600',
};

export function categoryColor(colorKey: string): string {
  return CATEGORY_COLOR[colorKey] || 'bg-slate-600';
}
