import React, { useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import DurationSelector, { DurationValue } from './DurationSelector';

interface Medication {
  id: string;
  medicineType: string;
  medicineName: string;
  dose: string;
  unit: string;
  timing: string;
  frequency: string;
  duration: DurationValue | undefined;
}

const TIMING_OPTIONS = [
  'Before Breakfast',
  'After Breakfast',
  'Before Lunch',
  'After Lunch',
  'Before Dinner',
  'After Dinner',
  'Anytime of the day',
];

const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Once weekly',
];

const MEDICINE_TYPES = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler'];
const UNITS = ['mg', 'ml', 'g', 'mcg', 'IU', 'units'];

export const MedicationForm: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      medicineType: '',
      medicineName: '',
      dose: '',
      unit: '',
      timing: '',
      frequency: '',
      duration: undefined,
    },
  ]);

  const [expandedMedication, setExpandedMedication] = useState<string>('1');
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const updateMedication = (id: string, field: keyof Medication, value: any) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
    
    // Clear error when field is updated
    if (errors[id]?.[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[id]) {
          delete newErrors[id][field];
        }
        return newErrors;
      });
    }
  };

  const addMedication = () => {
    const newId = Date.now().toString();
    setMedications((prev) => [
      ...prev,
      {
        id: newId,
        medicineType: '',
        medicineName: '',
        dose: '',
        unit: '',
        timing: '',
        frequency: '',
        duration: undefined,
      },
    ]);
    setExpandedMedication(newId);
  };

  const validateMedication = (med: Medication): Record<string, string> => {
    const medErrors: Record<string, string> = {};
    if (!med.medicineName) medErrors.medicineName = 'Medicine name is required';
    if (!med.dose) medErrors.dose = 'Dose is required';
    if (!med.unit) medErrors.unit = 'Unit is required';
    if (!med.timing) medErrors.timing = 'Timing is required';
    if (!med.frequency) medErrors.frequency = 'Frequency is required';
    if (!med.duration) medErrors.duration = 'Duration is required';
    return medErrors;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-xl border border-form-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-6">Medications</h2>

        <div className="space-y-6">
          {medications.map((medication) => (
            <div
              key={medication.id}
              className="bg-form-bg rounded-lg border border-form-border p-5"
            >
              {/* Extended form with type, name, dose, unit */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Medicine Type */}
                <div>
                  <label className="block text-sm font-medium text-form-label mb-2">
                    Medicine Type
                  </label>
                  <div className="relative">
                    <select
                      value={medication.medicineType}
                      onChange={(e) => updateMedication(medication.id, 'medicineType', e.target.value)}
                      className="w-full appearance-none px-4 py-3 pr-10 rounded-lg border border-form-border bg-popover text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">Select type</option>
                      {MEDICINE_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Medicine Name */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-form-label mb-2">
                    Medicine Name<span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter medicine name"
                      value={medication.medicineName}
                      onChange={(e) => updateMedication(medication.id, 'medicineName', e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-lg border bg-popover text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors[medication.id]?.medicineName ? "border-destructive" : "border-form-border"
                      )}
                    />
                  </div>
                  {errors[medication.id]?.medicineName && (
                    <p className="mt-1.5 text-xs text-destructive">{errors[medication.id].medicineName}</p>
                  )}
                </div>

                {/* Dose */}
                <div>
                  <label className="block text-sm font-medium text-form-label mb-2">
                    Dose<span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500"
                    value={medication.dose}
                    onChange={(e) => updateMedication(medication.id, 'dose', e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-popover text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                      errors[medication.id]?.dose ? "border-destructive" : "border-form-border"
                    )}
                  />
                  {errors[medication.id]?.dose && (
                    <p className="mt-1.5 text-xs text-destructive">{errors[medication.id].dose}</p>
                  )}
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-form-label mb-2">
                    Unit<span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={medication.unit}
                      onChange={(e) => updateMedication(medication.id, 'unit', e.target.value)}
                      className={cn(
                        "w-full appearance-none px-4 py-3 pr-10 rounded-lg border bg-popover text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors[medication.id]?.unit ? "border-destructive" : "border-form-border"
                      )}
                    >
                      <option value="">Select unit</option>
                      {UNITS.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors[medication.id]?.unit && (
                    <p className="mt-1.5 text-xs text-destructive">{errors[medication.id].unit}</p>
                  )}
                </div>
              </div>

              {/* Timing */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-form-label mb-3">
                  Timing<span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TIMING_OPTIONS.map((timing) => (
                    <label
                      key={timing}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer group"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                          medication.timing === timing
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/40 group-hover:border-primary/60"
                        )}
                      >
                        {medication.timing === timing && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm text-foreground">{timing}</span>
                    </label>
                  ))}
                </div>
                {errors[medication.id]?.timing && (
                  <p className="mt-2 text-xs text-destructive">{errors[medication.id].timing}</p>
                )}
              </div>

              {/* Frequency and Duration row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-form-label mb-2">
                    Frequency<span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={medication.frequency}
                      onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                      className={cn(
                        "w-full appearance-none px-4 py-3 pr-10 rounded-lg border bg-popover text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        errors[medication.id]?.frequency ? "border-destructive" : "border-form-border"
                      )}
                    >
                      <option value="">Select frequency</option>
                      {FREQUENCY_OPTIONS.map((freq) => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors[medication.id]?.frequency && (
                    <p className="mt-1.5 text-xs text-destructive">{errors[medication.id].frequency}</p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-form-label mb-2">
                    Duration<span className="text-destructive">*</span>
                  </label>
                  <DurationSelector
                    value={medication.duration}
                    onChange={(duration) => updateMedication(medication.id, 'duration', duration)}
                    error={errors[medication.id]?.duration}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Medication button */}
        <button
          type="button"
          onClick={addMedication}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary border-2 border-primary/30 rounded-lg hover:bg-primary/5 hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <Plus className="h-4 w-4" />
          Add Medication
        </button>
      </div>
    </div>
  );
};

export default MedicationForm;
