
"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIncome } from '@/contexts/IncomeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseIncomeInput, formatCurrency } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Send, Banknote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// Tooltip imports removed

export function IncomeForm() {
  const [input, setInput] = useState('');
  const { addIncome } = useIncome();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { currentUser, isLoading: authLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
         toast({ title: t.authRequiredTitle, description: t.authRequiredDescription, variant: "destructive" });
        return;
    }
    if (!input.trim()) return;

    const parsed = parseIncomeInput(input);
    if (parsed) {
      addIncome(parsed);
      toast({
        title: t.toastIncomeRecordedTitle,
        description: t.toastIncomeRecordedDescription(
            formatCurrency(parsed.amount, language), 
            parsed.description
        ),
      });
      setInput('');
    } else {
      toast({
        variant: "destructive",
        title: t.toastIncorrectFormatTitle, 
        description: t.toastIncorrectFormatDescription(t.exampleIncomeInput),
      });
    }
  };

  const isFormDisabled = authLoading || !currentUser;
  const cardDescription = !currentUser && !authLoading ? t.authRequiredDescription : t.incomeFormCardDescription;

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="text-primary"/>
          {t.incomeFormCardTitle}
        </CardTitle>
        <CardDescription>
            {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.incomeFormInputPlaceholder}
            className="flex-grow text-base"
            disabled={isFormDisabled}
          />
          <Button type="submit" className="px-4 py-2 text-base" disabled={isFormDisabled}>
            <Send size={18} className="mr-2" />
            {t.incomeFormSubmitButton}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
