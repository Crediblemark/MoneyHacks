
'use server';

/**
 * @fileOverview Predicts expenses for the upcoming month and provides saving recommendations based on past spending habits.
 *
 * - predictExpenses - A function that handles the expense prediction and recommendation process.
 * - PredictExpensesInput - The input type for the predictExpenses function.
 * - PredictExpensesOutput - The return type for the predictExpenses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictExpensesInputSchema = z.object({
  spendingHistory: z
    .string()
    .describe(
      'A detailed history of the user\'s spending habits, including dates, amounts, and categories.'
    ),
  language: z.enum(['id', 'en']).describe('The language for the AI response. "id" for Indonesian, "en" for English.'),
});
export type PredictExpensesInput = z.infer<typeof PredictExpensesInputSchema>;

const PredictExpensesOutputSchema = z.object({
  predictedExpenses: z
    .string()
    .describe('Predicted expenses for the upcoming month, broken down by category.'),
  savingRecommendations: z
    .string()
    .describe('Personalized saving recommendations based on spending habits.'),
});
export type PredictExpensesOutput = z.infer<typeof PredictExpensesOutputSchema>;

export async function predictExpenses(input: PredictExpensesInput): Promise<PredictExpensesOutput> {
  return predictExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictExpensesPrompt',
  input: {schema: PredictExpensesInputSchema},
  output: {schema: PredictExpensesOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending history and provide a prediction of their expenses for the upcoming month, broken down by category. Also, give personalized saving recommendations based on their spending habits.
Please provide your response in the language specified by the 'language' field. If 'id' is specified, respond in Indonesian. If 'en' is specified, respond in English.

Language: {{{language}}}
Spending History: {{{spendingHistory}}}`,
});

const predictExpensesFlow = ai.defineFlow(
  {
    name: 'predictExpensesFlow',
    inputSchema: PredictExpensesInputSchema,
    outputSchema: PredictExpensesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
