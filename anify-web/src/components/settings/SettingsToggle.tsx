interface SettingsToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SettingsToggle({
  label,
  description,
  value,
  onChange,
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <div className="text-white">{label}</div>
        {description && (
          <div className="text-sm text-white/50">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          value ? 'bg-white/60' : 'bg-white/20'
        }`}
        aria-label={`Toggle ${label}`}
        aria-pressed={value}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
            value ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
