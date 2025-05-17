
"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { Label } from "@/components/ui/label"; // Added Label
import { useExpenses } from '@/contexts/ExpenseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseExpenseInput, formatCurrency } from '@/lib/utils';
import { getTranslatedCategory } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';

export function ExpenseForm() {
  const [input, setInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(false); // State for private checkbox
  const { addExpense } = useExpenses();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsedBase = parseExpenseInput(input);
    if (parsedBase) {
      const parsedExpense = { ...parsedBase, isPrivate }; // Add isPrivate to the parsed object
      addExpense(parsedExpense);
      
      const categoryToDisplay = parsedExpense.isPrivate ? t.privateExpenseLabel : getTranslatedCategory(parsedExpense.category, t);
      const descriptionToDisplay = parsedExpense.isPrivate ? t.privateExpenseLabel : parsedExpense.description;

      toast({
        title: t.toastExpenseRecordedTitle,
        description: t.toastExpenseRecordedDescription(
            categoryToDisplay, 
            formatCurrency(parsedExpense.amount, language), 
            descriptionToDisplay
        ),
      });
      setInput('');
      setIsPrivate(false); // Reset checkbox
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
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPrivateExpense" 
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
            />
            <Label htmlFor="isPrivateExpense" className="text-sm font-medium text-muted-foreground cursor-pointer">
              {t.markAsPrivateLabel}
            </Label>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
