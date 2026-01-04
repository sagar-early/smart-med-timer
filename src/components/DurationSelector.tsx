import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Settings, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export interface DurationValue {
  value: number;
  unit: 'days' | 'weeks' | 'months';
}

interface DurationSelectorProps {
  value?: DurationValue;
  onChange: (duration: DurationValue) => void;
  onModeChange?: (mode: 'preset' | 'custom') => void;
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
  onModeChange,
  error,
  className,
}) => {
  const isMobile = useIsMobile();
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
    onModeChange?.('custom');
  };

  const handleBackToPresets = () => {
    setMode('preset');
    setCustomError('');
    setUnitDropdownOpen(false);
    onModeChange?.('preset');
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
    onModeChange?.('preset');
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

  const handleIncrement = () => {
    if (customValue < 999) {
      setCustomValue(prev => prev + 1);
      setCustomError('');
    }
  };

  const handleDecrement = () => {
    if (customValue > 1) {
      setCustomValue(prev => prev - 1);
      setCustomError('');
    }
  };

  const handleUnitSelect = (unit: 'days' | 'weeks' | 'months') => {
    setCustomUnit(unit);
    setUnitDropdownOpen(false);
  };

  // Desktop view with chips
  if (!isMobile) {
    // Custom mode - show inline inputs instead of dropdown
    if (mode === 'custom') {
      return (
        <div ref={containerRef} className={cn("w-full", className)}>
          <div className="p-4 rounded-lg border border-form-border bg-muted/30">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBackToPresets}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to presets
            </button>

            {/* Input row */}
            <div className="flex items-center gap-3">
              {/* Number input with +/- buttons */}
              <div className="flex items-center border border-form-border rounded-lg bg-popover overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={customValue <= 1}
                  className="px-3 py-2.5 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-form-border"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  ref={numberInputRef}
                  type="number"
                  min="1"
                  max="999"
                  value={customValue || ''}
                  onChange={handleNumberChange}
                  className={cn(
                    "w-16 px-2 py-2.5 text-sm text-center bg-popover focus:outline-none",
                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  )}
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={customValue >= 999}
                  className="px-3 py-2.5 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-l border-form-border"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Unit dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border border-form-border bg-popover hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-w-[110px]"
                >
                  <span>{customUnit.charAt(0).toUpperCase() + customUnit.slice(1)}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                </button>

                {unitDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border border-form-border rounded-lg shadow-lg overflow-hidden">
                    {UNIT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleUnitSelect(option.value)}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors",
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
            </div>

            {/* Apply button - full width below */}
            <button
              type="button"
              onClick={handleApplyCustom}
              className="w-full mt-4 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              Apply
            </button>

            {/* Error message */}
            {customError && (
              <p className="mt-2 text-xs text-destructive">{customError}</p>
            )}
          </div>

          {error && (
            <p className="mt-1.5 text-xs text-destructive">{error}</p>
          )}
        </div>
      );
    }

    // Preset mode - show dropdown with chips
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

        {/* Dropdown with chips */}
        {isOpen && (
          <div className="absolute z-50 min-w-[280px] mt-1 bg-popover border border-form-border rounded-lg shadow-lg overflow-hidden animate-slide-down">
            <div className="p-2">
              {/* Preset chips - multiple per row */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PRESET_DURATIONS.map((preset, index) => {
                  const isSelected = value?.value === preset.value.value && value?.unit === preset.value.unit;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={cn(
                        "px-2.5 py-1 text-xs rounded-full border transition-all duration-200 whitespace-nowrap",
                        "hover:border-primary hover:bg-primary/10",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-popover text-foreground border-form-border"
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom option */}
              <button
                type="button"
                onClick={handleCustomClick}
                className="w-full px-2.5 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors flex items-center gap-1.5 border border-dashed border-form-border"
              >
                <Settings className="h-3 w-3" />
                Custom...
              </button>
            </div>
          </div>
        )}

        {/* Field error */}
        {error && (
          <p className="mt-1.5 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }

  // Mobile view - simple dropdown
  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {mode === 'preset' ? (
        <>
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

          {/* Dropdown content - mobile list style */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-form-border rounded-lg shadow-lg overflow-hidden animate-slide-down">
              <div className="py-1 max-h-60 overflow-y-auto">
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
            </div>
          )}
        </>
      ) : (
        /* Custom mode - mobile */
        <div className="p-3 rounded-lg border border-form-border bg-muted/30">
          {/* Back link */}
          <button
            type="button"
            onClick={handleBackToPresets}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to presets
          </button>

          {/* Custom input row */}
          <div className="flex gap-2">
            {/* Number input with +/- */}
            <div className="flex items-center gap-1 flex-1">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={customValue <= 1}
                className="p-2 rounded-md border border-form-border bg-popover hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                ref={numberInputRef}
                type="number"
                min="1"
                max="999"
                value={customValue || ''}
                onChange={handleNumberChange}
                className={cn(
                  "flex-1 px-3 py-2 text-sm text-center rounded-md border bg-popover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                  customError ? "border-destructive" : "border-form-border"
                )}
              />
              <button
                type="button"
                onClick={handleIncrement}
                disabled={customValue >= 999}
                className="p-2 rounded-md border border-form-border bg-popover hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Unit dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-form-border bg-popover hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-w-[90px]"
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
          </div>

          {/* Apply button - full width on mobile */}
          <button
            type="button"
            onClick={handleApplyCustom}
            className="w-full mt-3 px-4 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            Apply
          </button>

          {/* Error message */}
          {customError && (
            <p className="mt-2 text-xs text-destructive">{customError}</p>
          )}
        </div>
      )}

      {/* Field error */}
      {error && mode === 'preset' && (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default DurationSelector;
