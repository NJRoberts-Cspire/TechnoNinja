import { CLASS_FLAVOR, CLASS_PRIMARY_STATS, SUBCLASS_BY_CLASS, SUBCLASS_FLAVOR } from '@/data/generated';
import { TierSummary, classAbilityCount } from '@/components/SkillTree';
import { cn } from '@/lib/utils';

interface Props {
  className: string;
  compact?: boolean;
}

export function ClassDetail({ className, compact }: Props) {
  const flavor = CLASS_FLAVOR[className] || '';
  const primary = CLASS_PRIMARY_STATS[className] || [];
  const subclasses = SUBCLASS_BY_CLASS[className] || [];
  const abilityCount = classAbilityCount(className);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400">Class</div>
        <h3 className="font-display text-2xl text-accent-gold">{className}</h3>
      </div>

      {flavor && (
        <p className="text-sm text-slate-300 leading-relaxed">{flavor}</p>
      )}

      {primary.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Primary Stats</div>
          <div className="flex gap-2">
            {primary.map((s) => (
              <span key={s} className="px-2 py-1 rounded bg-ink-700 border border-ink-600 font-display text-xs font-bold text-accent-gold">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Card Roster</div>
        <div className="text-sm text-slate-200">
          <span className="font-display font-bold text-accent-gold">{abilityCount}</span>
          <span className="text-slate-400"> total abilities</span>
        </div>
        <div className="mt-1.5">
          <TierSummary className={className} />
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
          Subclass Paths ({subclasses.length})
        </div>
        <ul className={cn('space-y-1', compact ? 'text-xs' : 'text-sm')}>
          {subclasses.map((s) => {
            const flavor = SUBCLASS_FLAVOR[`${className} — ${s}`];
            return (
              <li key={s} className="flex flex-col">
                <span className="font-display font-bold text-slate-200">{s}</span>
                {flavor && !compact && (
                  <span className="text-xs text-slate-500 leading-snug">{flavor}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
