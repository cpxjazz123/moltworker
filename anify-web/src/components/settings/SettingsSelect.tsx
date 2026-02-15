interface SettingsSelectOption {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: SettingsSelectOption[];
}

export function SettingsSelect({
  label,
  description,
  value,
  onChange,
  options,
}: SettingsSelectProps) {
  return (
    <div className="py-3 border-b border-white/5 last:border-0">
      <div className="mb-2">
        <div className="text-white">{label}</div>
        {description && (
          <div className="text-sm text-white/50">{description}</div>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
          focus:outline-none focus:ring-2 focus:ring-white/20
          [&>option]:bg-slate-800 [&>option]:text-white"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
