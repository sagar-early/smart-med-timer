import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Link2, Eye, Plus, Search } from 'lucide-react';
import { DurationSelector, DurationValue } from '@/components/DurationSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Medication {
  name: string;
  type: string;
  dose: string;
  prescribedDate: string;
}

const TIMING_OPTIONS = [
  { value: 'before-breakfast', label: 'Before Breakfast' },
  { value: 'after-breakfast', label: 'After Breakfast' },
  { value: 'before-lunch', label: 'Before Lunch' },
  { value: 'after-lunch', label: 'After Lunch' },
  { value: 'before-dinner', label: 'Before Dinner' },
  { value: 'after-dinner', label: 'After Dinner' },
  { value: 'anytime', label: 'Anytime of the day' },
];

const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Once daily' },
  { value: 'twice', label: 'Twice daily' },
  { value: 'thrice', label: 'Three times daily' },
  { value: 'four', label: 'Four times daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'asneeded', label: 'As needed' },
];

const NewPrescription: React.FC = () => {
  const [medicationName, setMedicationName] = useState('');
  const [timing, setTiming] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState<DurationValue | undefined>();
  const [durationMode, setDurationMode] = useState<'preset' | 'custom'>('preset');

  const prescribedMedications: Medication[] = [
    {
      name: 'Soft Needle Injection Mounjaro 2.5 mg',
      type: 'Injection',
      dose: '2.5 mg',
      prescribedDate: 'Dec 28, 2025',
    },
    {
      name: 'Tablet Methycobalamin (Vitamin B12) 500 mcg',
      type: 'Tablet',
      dose: '500 mcg',
      prescribedDate: 'Dec 28, 2025',
    },
  ];

  const handleAddMedication = () => {
    console.log({
      medicationName,
      timing,
      frequency,
      duration,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back navigation */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </div>

      {/* Main content - 3 column layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Patient Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Patient Header Card */}
            <div className="bg-primary rounded-xl p-4 text-primary-foreground">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg font-semibold">
                    P
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Pratik Shroff</h2>
                    <p className="text-sm opacity-80">Age: 45, Gender: male</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/20 rounded-lg text-sm hover:bg-primary-foreground/30 transition-colors">
                  <Eye className="h-4 w-4" />
                  Last Prescription
                </button>
              </div>

              {/* Weight Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-primary-foreground/10 rounded-lg p-3">
                  <p className="text-xs opacity-70">27 Dec 2025 (Start)</p>
                  <p className="font-semibold">124.3kg • BMI 42.9</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-3">
                  <p className="text-xs opacity-70">02 Jan 2026 (Current)</p>
                  <p className="font-semibold">124.3kg • BMI 42.9</p>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-primary-foreground/10 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Progress to Goal</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="h-2 bg-primary-foreground/20 rounded-full">
                  <div className="h-full bg-primary-foreground rounded-full" style={{ width: '0%' }} />
                </div>
                <p className="text-xs mt-2 opacity-70">0.0kg lost • -19.3kg to goal</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">
                Health
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Progress
              </button>
            </div>

            {/* Current Medications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Current Medications</h3>
              </div>
              <div className="border border-border rounded-lg p-6 text-center text-muted-foreground">
                No current medications
              </div>
            </div>

            {/* Prescribed Medications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M3 9h6" />
                  <path d="M3 15h6" />
                </svg>
                <h3 className="font-semibold">Prescribed Medications</h3>
              </div>
              <div className="space-y-2">
                {prescribedMedications.map((med, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">Prescribed: {med.prescribedDate}</p>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center column - Video Call */}
          <div className="lg:col-span-4">
            <div className="bg-foreground rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center p-6">
              {/* Doctor info */}
              <div className="text-primary-foreground text-center mb-auto pt-4 w-full text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="font-medium">Dr. Saurav Das</span>
                </div>
                <p className="text-sm opacity-70 ml-4">doctor</p>
              </div>

              {/* Join button */}
              <Button 
                variant="outline" 
                className="bg-primary/80 hover:bg-primary text-primary-foreground border-none px-8 py-6 text-lg"
              >
                Join Session
              </Button>

              <div className="mt-auto" />
            </div>
          </div>

          {/* Right column - Medications Form */}
          <div className="lg:col-span-4">
            <div className="border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Medications</h2>

              <div className="space-y-5">
                {/* Medication Name */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Medication Name*</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medication..."
                      value={medicationName}
                      onChange={(e) => setMedicationName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Timing */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Timing*</Label>
                  <RadioGroup value={timing} onValueChange={setTiming} className="grid grid-cols-3 gap-2">
                    {TIMING_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Frequency and Duration */}
                <div className={durationMode === 'custom' ? 'space-y-4' : 'grid grid-cols-2 gap-4'}>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Frequency*</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Duration*</Label>
                    <DurationSelector
                      value={duration}
                      onChange={setDuration}
                      onModeChange={setDurationMode}
                    />
                  </div>
                </div>

                {/* Add Medication Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddMedication}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPrescription;
