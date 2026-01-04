import MedicationForm from '@/components/MedicationForm';

const Index = () => {
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Prescription Form</h1>
          <p className="mt-1 text-muted-foreground">Add medications and set dosage instructions</p>
        </header>
        
        <MedicationForm />
      </div>
    </main>
  );
};

export default Index;
