
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGoals, type UserGoalInput } from '@/contexts/GoalsContext';
import { generateGoalImage } from '@/ai/flows/generate-goal-image-flow';
import { Loader2, Trash2, PlusCircle, DollarSign, Image as ImageIcon, Edit3, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import type { Goal } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function GoalsClient() {
  const { t, language } = useLanguage();
  const { goals, addGoal, addFundsToGoal, deleteGoal, updateGoalImage, isLoading: goalsLoading } = useGoals();
  const { currentUser, isSubscriptionActive, isLoadingSubscription } = useAuth();
  const { toast } = useToast();

  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<UserGoalInput>({ name: '', description: '', targetAmount: 0 });

  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [currentGoalForFunds, setCurrentGoalForFunds] = useState<Goal | null>(null);
  const [fundsToAdd, setFundsToAdd] = useState<number>(0);

  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: name === 'targetAmount' ? parseFloat(value) || 0 : value }));
  };

  const handleFundsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFundsToAdd(parseFloat(e.target.value) || 0);
  };

  const handleAddGoal = async () => {
    if (!currentUser || !isSubscriptionActive) {
        toast({ title: t.subscriptionOverlayTitle, description: t.subscriptionOverlayMessage, variant: "destructive" });
        return;
    }
    if (!newGoal.name || newGoal.targetAmount <= 0) {
      toast({ 
        title: t.errorDialogTitle, 
        description: t.errorAddingGoalToast + " " + (newGoal.name ? t.addGoalDialogAmountPlaceholder + " must be positive." : t.addGoalDialogNameLabel + " is required."), 
        variant: "destructive" 
      });
      return;
    }
    try {
      await addGoal(newGoal);
      toast({ title: t.goalAddedToastTitle, description: t.goalAddedToastDescription(newGoal.name) });
      setNewGoal({ name: '', description: '', targetAmount: 0 });
      setIsAddGoalDialogOpen(false);
    } catch (error) {
      toast({ title: t.errorDialogTitle, description: t.errorAddingGoalToast, variant: "destructive" });
      console.error("Error adding goal:", error);
    }
  };

  const handleAddFunds = async () => {
    if (!currentUser || !isSubscriptionActive) {
        toast({ title: t.subscriptionOverlayTitle, description: t.subscriptionOverlayMessage, variant: "destructive" });
        return;
    }
    if (!currentGoalForFunds || fundsToAdd <= 0) {
      toast({ title: t.errorDialogTitle, description: t.errorAddingFundsToast + " Amount must be positive.", variant: "destructive" });
      return;
    }
    try {
      await addFundsToGoal(currentGoalForFunds.id, fundsToAdd);
      toast({ title: t.fundsAddedToastTitle, description: t.fundsAddedToastDescription(formatCurrency(fundsToAdd, language), currentGoalForFunds.name) });
      setFundsToAdd(0);
      setIsAddFundsDialogOpen(false);
      setCurrentGoalForFunds(null);
    } catch (error) {
      toast({ title: t.errorDialogTitle, description: t.errorAddingFundsToast, variant: "destructive" });
      console.error("Error adding funds:", error);
    }
  };

  const handleGenerateImage = async (goal: Goal) => {
    if (!currentUser || !isSubscriptionActive) {
        toast({ title: t.subscriptionOverlayTitle, description: t.subscriptionOverlayMessage, variant: "destructive" });
        return;
    }
    if (!goal.description) {
        toast({ title: t.errorDialogTitle, description: t.errorGeneratingImageToast + " " + t.goalDescriptionNeededForImage, variant: "destructive" });
        return;
    }
    setGeneratingImageId(goal.id);
    try {
      const imageDataUri = await generateGoalImage({ prompt: goal.description, language });
      await updateGoalImage(goal.id, imageDataUri, goal.description);
      toast({ title: t.imageGeneratedToastTitle, description: t.imageGeneratedToastDescription(goal.name) });
    } catch (error) {
      toast({ title: t.errorDialogTitle, description: t.errorGeneratingImageToast, variant: "destructive" });
      console.error("Error generating image:", error);
    } finally {
      setGeneratingImageId(null);
    }
  };

  const handleDeleteGoal = async (goalId: string, goalName: string) => {
    if (!currentUser || !isSubscriptionActive) {
        toast({ title: t.subscriptionOverlayTitle, description: t.subscriptionOverlayMessage, variant: "destructive" });
        return;
    }
    try {
      await deleteGoal(goalId);
      toast({ title: t.goalDeletedToastTitle, description: t.goalDeletedToastDescription(goalName) });
    } catch (error) {
      toast({ title: t.errorDialogTitle, description: t.errorDeletingGoalToast, variant: "destructive"});
      console.error("Error deleting goal:", error);
    }
  };
  
  const openAddFundsDialog = (goal: Goal) => {
    if (!currentUser || !isSubscriptionActive) {
        toast({ title: t.subscriptionOverlayTitle, description: t.subscriptionOverlayMessage, variant: "destructive" });
        return;
    }
    setCurrentGoalForFunds(goal);
    setFundsToAdd(0);
    setIsAddFundsDialogOpen(true);
  };

  const isPageDisabled = !currentUser || isLoadingSubscription || !isSubscriptionActive;


  if (goalsLoading || (isLoadingSubscription && currentUser)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="shadow-lg rounded-xl animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-32 bg-muted rounded-md"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-10 bg-muted rounded w-24"></div>
              <div className="h-10 bg-muted rounded w-24"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!isSubscriptionActive && currentUser && !isLoadingSubscription) {
    return (
        <Card className="text-center py-10">
            <CardHeader><CardTitle>{t.financialGoalsTitle}</CardTitle></CardHeader>
            <CardContent><p>{t.goalsSubscriptionNeeded}</p></CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
          <DialogTrigger asChild>
            <TooltipProvider>
                <Tooltip open={isPageDisabled ? undefined : false}>
                    <TooltipTrigger asChild>
                        <span tabIndex={0}>
                            <Button disabled={isPageDisabled}>
                                <PlusCircle className="mr-2" /> {t.addGoalButtonLabel}
                            </Button>
                        </span>
                    </TooltipTrigger>
                    {isPageDisabled && <TooltipContent><p>{t.subscriptionFeatureDisabledTooltip}</p></TooltipContent>}
                </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t.addGoalDialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t.addGoalDialogNameLabel}</Label>
                <Input id="name" name="name" value={newGoal.name} onChange={handleInputChange} className="col-span-3" placeholder={t.addGoalDialogNamePlaceholder} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">{t.addGoalDialogDescriptionLabel}</Label>
                <Input id="description" name="description" value={newGoal.description || ''} onChange={handleInputChange} className="col-span-3" placeholder={t.addGoalDialogDescriptionPlaceholder} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetAmount" className="text-right">{t.addGoalDialogTargetAmountLabel}</Label>
                <Input id="targetAmount" name="targetAmount" type="number" value={newGoal.targetAmount > 0 ? newGoal.targetAmount.toString() : ""} onChange={handleInputChange} className="col-span-3" placeholder={t.addGoalDialogAmountPlaceholder} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddGoal}>{t.addGoalDialogAddButton}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 && !goalsLoading && currentUser && isSubscriptionActive ? (
        <Card className="text-center py-10">
          <CardHeader>
            <CardTitle>{t.noGoalsYetTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t.noGoalsYetDescription}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <Card key={goal.id} className="shadow-lg rounded-xl flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{goal.name}</CardTitle>
                {goal.description && <CardDescription>{goal.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center relative">
                  {generatingImageId === goal.id ? (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-2 text-sm">{t.goalCardGeneratingImage}</p>
                    </div>
                  ) : goal.imageUrl ? (
                    <Image src={goal.imageUrl} alt={t.goalCardImageAlt(goal.name)} width={400} height={225} className="object-cover w-full h-full" data-ai-hint="goal visualization" />
                  ) : (
                    <div className="text-center text-muted-foreground p-4">
                       <ImageIcon size={48} className="mx-auto mb-2 opacity-50"/>
                      <p className="text-sm">{t.goalCardImagePlaceholder}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">{t.goalCardFundsLabel}</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary">{formatCurrency(goal.currentAmount, language)}</p>
                    <p className="text-sm text-muted-foreground">/ {formatCurrency(goal.targetAmount, language)}</p>
                  </div>
                  <Progress value={goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0} className="h-2 mt-1" />
                </div>

              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                 <TooltipProvider>
                    <Tooltip open={isPageDisabled && generatingImageId !== goal.id ? undefined : false}>
                        <TooltipTrigger asChild>
                            <span tabIndex={0} className="contents"> {/* contents helps TooltipTrigger work with Button correctly */}
                                <Button variant="outline" onClick={() => openAddFundsDialog(goal)} size="sm" disabled={isPageDisabled}>
                                    <DollarSign className="mr-1.5" size={16}/> {t.goalCardAddFundsButton}
                                </Button>
                            </span>
                        </TooltipTrigger>
                         {isPageDisabled && generatingImageId !== goal.id && <TooltipContent><p>{t.subscriptionFeatureDisabledTooltip}</p></TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                     <Tooltip open={isPageDisabled && generatingImageId !== goal.id ? undefined : false}>
                        <TooltipTrigger asChild>
                            <span tabIndex={0} className="contents">
                                <Button variant="outline" onClick={() => handleGenerateImage(goal)} disabled={isPageDisabled || generatingImageId === goal.id || !goal.description} size="sm">
                                  {generatingImageId === goal.id ? <Loader2 className="mr-1.5 animate-spin" size={16}/> : <ImageIcon className="mr-1.5" size={16}/>}
                                  {t.goalCardGenerateImageButton}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {isPageDisabled && generatingImageId !== goal.id &&  <TooltipContent><p>{t.subscriptionFeatureDisabledTooltip}</p></TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip open={isPageDisabled ? undefined : false}>
                        <TooltipTrigger asChild>
                            <span tabIndex={0} className="col-span-2">
                                <Button variant="destructive" onClick={() => handleDeleteGoal(goal.id, goal.name)} size="sm" className="w-full" disabled={isPageDisabled}>
                                   <Trash2 className="mr-1.5" size={16}/> {t.goalCardDeleteGoalButton}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {isPageDisabled && <TooltipContent><p>{t.subscriptionFeatureDisabledTooltip}</p></TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddFundsDialogOpen} onOpenChange={setIsAddFundsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t.addFundsDialogTitle(currentGoalForFunds?.name || '')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
                {t.addFundsDialogCurrentAmount(formatCurrency(currentGoalForFunds?.currentAmount || 0, language))}
            </p>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funds" className="text-right">{t.addFundsDialogAmountLabel}</Label>
              <Input 
                id="funds" 
                type="number" 
                value={fundsToAdd > 0 ? fundsToAdd.toString() : ''}
                onChange={handleFundsInputChange} 
                className="col-span-3" 
                placeholder={t.addGoalDialogAmountPlaceholder}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddFunds}>{t.addFundsDialogAddButton}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
