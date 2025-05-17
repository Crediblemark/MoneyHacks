
"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseExpenseInput, formatCurrency } from '@/lib/utils';
import { getTranslatedCategory, DEFAULT_CATEGORY_ICONS } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from 'lucide-react';
import { suggestExpenseCategory } from '@/ai/flows/suggest-expense-category-flow';
import { DEFAULT_CATEGORIES, type ParsedExpenseForContext } from '@/lib/types';

export function ExpenseForm() {
  const [input, setInput] = useState('');
  const { addExpense } = useExpenses();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsedInfo = parseExpenseInput(input);
    if (parsedInfo) {
      setIsCategorizing(true);
      try {
        const suggestedCategory = await suggestExpenseCategory({
          description: parsedInfo.description,
          language: language,
          existingCategories: [...DEFAULT_CATEGORIES]
        });

        const expenseData: ParsedExpenseForContext = {
          description: parsedInfo.description,
          amount: parsedInfo.amount,
          category: suggestedCategory || (language === 'id' ? "Lainnya" : "Others"), // Fallback if AI returns empty
        };
        
        addExpense(expenseData);
        
        toast({
          title: t.toastExpenseRecordedTitle,
          description: t.toastExpenseRecordedDescription(
              getTranslatedCategory(expenseData.category, t), 
              formatCurrency(expenseData.amount, language), 
              expenseData.description
          ),
        });
        setInput('');
      } catch (aiError) {
        console.error("AI Category Suggestion Error:", aiError);
        toast({
          variant: "destructive",
          title: t.errorDialogTitle,
          description: language === 'id' ? "Gagal mendapatkan saran kategori dari AI. Pengeluaran dicatat sebagai 'Lainnya'." : "Failed to get category suggestion from AI. Expense logged as 'Others'.",
        });
        // Log as "Lainnya" or "Others" on AI error
        const fallbackExpenseData: ParsedExpenseForContext = {
            description: parsedInfo.description,
            amount: parsedInfo.amount,
            category: language === 'id' ? "Lainnya" : "Others",
        };
        addExpense(fallbackExpenseData);
        setInput('');
      } finally {
        setIsCategorizing(false);
      }
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
              disabled={isCategorizing}
            />
            <Button type="submit" className="px-4 py-2 text-base shrink-0" disabled={isCategorizing}>
              {isCategorizing ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <Send size={18} className="mr-2" />
              )}
              {isCategorizing ? (language === 'id' ? "Memproses..." : "Processing...") : t.expenseFormSubmitButton}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
