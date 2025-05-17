
import { AIPredictionDisplay } from '@/components/predictions/AIPredictionDisplay';
import { AppPageHeader } from '@/components/layout/AppPageHeader';
import { Sparkles } from 'lucide-react';

export default function PredictionsPage() {
  return (
    <div>
      <AppPageHeader 
        title="Prediksi Pengeluaran AI"
        icon={Sparkles}
        description="Manfaatkan kecerdasan buatan untuk memprediksi pengeluaran Anda di masa mendatang dan dapatkan tips hemat yang dipersonalisasi."
      />
      <AIPredictionDisplay />
    </div>
  );
}
