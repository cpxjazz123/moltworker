import type { ReactNode } from 'react';

interface SettingsSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: ReactNode;
  showValue?: boolean;
  unit?: string;
}

export function SettingsSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  icon,
  showValue = true,
  unit = '%',
}: SettingsSliderProps) {
  return (
    <div className="space-y-2 py-3 border-b border-white/5 last:border-0">
      <div className="flex justify-between items-center">
        <span className="text-white/80 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        {showValue && (
          <span className="text-white font-medium">
            {value}{unit}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0"
        aria-label={label}
      />
    </div>
  );
}
