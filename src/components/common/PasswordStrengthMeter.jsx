import { memo, useMemo } from 'react';
import { Check, X } from 'lucide-react';

const REQUIREMENTS = [
  { key: 'length', label: 'Min. 6 karakter', test: (p) => p.length >= 6 },
  { key: 'upper', label: 'Huruf besar', test: (p) => /[A-Z]/.test(p) },
  { key: 'number', label: 'Angka', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'Karakter khusus', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_CONFIG = [
  { label: '', color: '' },
  { label: 'Lemah', color: 'bg-red-500' },
  { label: 'Sedang', color: 'bg-amber-500' },
  { label: 'Kuat', color: 'bg-emerald-500' },
  { label: 'Sangat Kuat', color: 'bg-emerald-600' },
];

const PasswordStrengthMeter = memo(function PasswordStrengthMeter({ password }) {
  const { strength, checks } = useMemo(() => {
    if (!password) return { strength: 0, checks: {} };

    const checks = {};
    let score = 0;

    REQUIREMENTS.forEach(({ key, test }) => {
      checks[key] = test(password);
      if (checks[key]) score++;
    });

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;

    return { strength: Math.min(4, Math.floor(score / 1.5)), checks };
  }, [password]);

  if (!password) return null;

  const { label, color } = STRENGTH_CONFIG[strength];

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= strength ? color : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
        {label && (
          <span className={`text-xs font-medium ${color.replace('bg-', 'text-')}`}>{label}</span>
        )}
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-2 gap-2">
        {REQUIREMENTS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            {checks[key] ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={`text-xs ${checks[key] ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PasswordStrengthMeter;
