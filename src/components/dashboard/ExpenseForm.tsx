
"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseExpenseInput, formatCurrency } from '@/lib/utils';
import { getTranslatedCategory } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';

export function ExpenseForm() {
  const [input, setInput] = useState('');
  const { addExpense } = useExpenses();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsedExpense = parseExpenseInput(input);
    if (parsedExpense) {
      addExpense(parsedExpense);
      
      toast({
        title: t.toastExpenseRecordedTitle,
        description: t.toastExpenseRecordedDescription(
            getTranslatedCategory(parsedExpense.category, t), 
            formatCurrency(parsedExpense.amount, language), 
            parsedExpense.description
        ),
      });
      setInput('');
    } else {
      toast({
        variant: "destructive",
        title: t.toastIncorrectFormatTitle,
        description: t.toastIncorrectFormatDescription(t.exampleExpenseInput),
      });
    }
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>{t.expenseFormCardTitle}</CardTitle>
        <CardDescription>{t.expenseFormCardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.expenseFormInputPlaceholder}
              className="flex-grow text-base"
            />
            <Button type="submit" className="px-4 py-2 text-base shrink-0">
              <Send size={18} className="mr-2" />
              {t.expenseFormSubmitButton}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
