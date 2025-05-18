
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
import { useAuth } from '@/contexts/AuthContext'; // Added

export function IncomeForm() {
  const [input, setInput] = useState('');
  const { addIncome } = useIncome();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { currentUser, isLoading: authLoading } = useAuth(); // Added

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) { // Check for currentUser
         if (!currentUser) {
            toast({
                title: t.authRequiredTitle,
                description: t.authRequiredDescription,
                variant: "destructive"
            });
        }
        return;
    }

    const parsed = parseIncomeInput(input);
    if (parsed) {
      addIncome(parsed); // The context's addIncome should handle the !currentUser check again
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

  const isDisabled = authLoading || !currentUser;

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="text-primary"/>
          {t.incomeFormCardTitle}
        </CardTitle>
        <CardDescription>
            {currentUser ? t.incomeFormCardDescription : t.authRequiredDescription}
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
            disabled={isDisabled}
          />
          <Button type="submit" className="px-4 py-2 text-base" disabled={isDisabled}>
            <Send size={18} className="mr-2" />
            {t.incomeFormSubmitButton}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
