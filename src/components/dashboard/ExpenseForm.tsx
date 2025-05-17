
"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useExpenses } from '@/contexts/ExpenseContext';
import { parseExpenseInput, formatCurrency } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';

export function ExpenseForm() {
  const [input, setInput] = useState('');
  const { addExpense } = useExpenses();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsed = parseExpenseInput(input);
    if (parsed) {
      addExpense(parsed);
      toast({
        title: "✅ Pengeluaran Tercatat",
        description: `${parsed.category}: ${formatCurrency(parsed.amount)} (${parsed.description})`,
      });
      setInput('');
    } else {
      toast({
        variant: "destructive",
        title: "❌ Format Salah",
        description: "Tidak dapat memproses input. Contoh: 'Makan siang 50rb'",
      });
    }
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Catat Pengeluaran Baru</CardTitle>
        <CardDescription>Masukkan detail pengeluaran dalam format bebas, misal: "Makan siang 50rb" atau "Transport 20k ke kantor".</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Contoh: Kopi pagi 15rb"
            className="flex-grow text-base"
          />
          <Button type="submit" className="px-4 py-2 text-base">
            <Send size={18} className="mr-2" />
            Kirim
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
