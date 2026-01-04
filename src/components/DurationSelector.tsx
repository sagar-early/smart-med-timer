import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DurationValue {
  value: number;
  unit: 'days' | 'weeks' | 'months';
}

interface DurationSelectorProps {
  value?: DurationValue;
  onChange: (duration: DurationValue) => void;
  error?: string;
  className?: string;
}

const PRESET_DURATIONS: { label: string; value: DurationValue }[] = [
  { label: '2 Days', value: { value: 2, unit: 'days' } },
  { label: '5 Days', value: { value: 5, unit: 'days' } },
  { label: '1 Week', value: { value: 1, unit: 'weeks' } },
  { label: '2 Weeks', value: { value: 2, unit: 'weeks' } },
  { label: '1 Month', value: { value: 1, unit: 'months' } },
  { label: '3 Months', value: { value: 3, unit: 'months' } },
  { label: '6 Months', value: { value: 6, unit: 'months' } },
];

const UNIT_OPTIONS: { label: string; value: 'days' | 'weeks' | 'months' }[] = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
];

const formatDuration = (duration: DurationValue): string => {
  const unitLabel = duration.unit.charAt(0).toUpperCase() + duration.unit.slice(1);
  const displayUnit = duration.value === 1 ? unitLabel.slice(0, -1) : unitLabel;
  return `${duration.value} ${displayUnit}`;
};

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  value,
  onChange,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [customValue, setCustomValue] = useState<number>(1);
  const [customUnit, setCustomUnit] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [customError, setCustomError] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setUnitDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus number input when entering custom mode
  useEffect(() => {
    if (mode === 'custom' && numberInputRef.current) {
      numberInputRef.current.focus();
    }
  }, [mode]);

  const handlePresetSelect = (preset: { label: string; value: DurationValue }) => {
    onChange(preset.value);
    setIsOpen(false);
    setMode('preset');
  };

  const handleCustomClick = () => {
    setMode('custom');
    setCustomError('');
  };

  const handleBackToPresets = () => {
    setMode('preset');
    setCustomError('');
    setUnitDropdownOpen(false);
  };

  const handleApplyCustom = () => {
    if (customValue < 1) {
      setCustomError('Value must be at least 1');
      return;
    }
    if (customValue > 999) {
      setCustomError('Value must be less than 1000');
      return;
    }
    
    onChange({ value: customValue, unit: customUnit });
    setIsOpen(false);
    setMode('preset');
    setCustomError('');
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setCustomValue(val);
      setCustomError('');
    } else if (e.target.value === '') {
      setCustomValue(0);
    }
  };

  const handleUnitSelect = (unit: 'days' | 'weeks' | 'months') => {
    setCustomUnit(unit);
    setUnitDropdownOpen(false);
  };

  const isPresetValue = value && PRESET_DURATIONS.some(
    p => p.value.value === value.value && p.value.unit === value.unit
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Main trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-popover text-left transition-all duration-200",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          error ? "border-destructive" : "border-form-border",
          isOpen && "ring-2 ring-primary/20 border-primary"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "text-sm",
          value ? "text-foreground" : "text-muted-foreground"
        )}>
          {value ? formatDuration(value) : "Select duration"}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-form-border rounded-lg shadow-lg overflow-hidden animate-slide-down">
          {mode === 'preset' ? (
            /* Preset mode */
            <div className="py-1">
              {PRESET_DURATIONS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-colors",
                    "hover:bg-accent focus:bg-accent focus:outline-none",
                    value?.value === preset.value.value && value?.unit === preset.value.unit
                      ? "bg-accent text-primary font-medium"
                      : "text-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
              
              {/* Separator */}
              <div className="my-1 border-t border-form-border" />
              
              {/* Custom option */}
              <button
                type="button"
                onClick={handleCustomClick}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Custom...
              </button>
            </div>
          ) : (
            /* Custom mode */
            <div className="p-4 bg-muted/50">
              {/* Back link */}
              <button
                type="button"
                onClick={handleBackToPresets}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to presets
              </button>

              {/* Custom input row */}
              <div className="flex gap-2">
                {/* Number input */}
                <input
                  ref={numberInputRef}
                  type="number"
                  min="1"
                  max="999"
                  value={customValue || ''}
                  onChange={handleNumberChange}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm rounded-md border bg-popover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                    customError ? "border-destructive" : "border-form-border"
                  )}
                  placeholder="Enter value"
                />

                {/* Unit dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-form-border bg-popover hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-w-[100px]"
                  >
                    <span>{customUnit.charAt(0).toUpperCase() + customUnit.slice(1)}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
                  </button>

                  {unitDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border border-form-border rounded-md shadow-lg overflow-hidden">
                      {UNIT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleUnitSelect(option.value)}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm transition-colors",
                            "hover:bg-accent focus:bg-accent focus:outline-none",
                            customUnit === option.value
                              ? "bg-accent text-primary font-medium"
                              : "text-foreground"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Apply button */}
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  Apply
                </button>
              </div>

              {/* Error message */}
              {customError && (
                <p className="mt-2 text-xs text-destructive">{customError}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Field error */}
      {error && (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default DurationSelector;
