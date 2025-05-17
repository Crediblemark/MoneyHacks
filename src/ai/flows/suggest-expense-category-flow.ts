
'use server';
/**
 * @fileOverview An AI flow to suggest an expense category based on its description.
 *
 * - suggestExpenseCategory - A function that suggests a category.
 * - SuggestExpenseCategoryInput - The input type.
 * - SuggestExpenseCategoryOutput - The return type (the suggested category string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_CATEGORIES } from '@/lib/types';

const SuggestExpenseCategoryInputSchema = z.object({
  description: z.string().describe('The description of the expense item.'),
  language: z.enum(['id', 'en']).describe('The language for the AI response and category suggestion if a new one is made. "id" for Indonesian, "en" for English.'),
  existingCategories: z.array(z.string()).describe('A list of existing categories to prefer. These are typically the default categories.'),
});
export type SuggestExpenseCategoryInput = z.infer<typeof SuggestExpenseCategoryInputSchema>;

// Output is just the suggested category string
const SuggestExpenseCategoryOutputSchema = z.string().describe("The suggested category name. This could be one of the existing categories or a new one if appropriate. If a new category is generated, it should be concise (1-2 words).");
export type SuggestExpenseCategoryOutput = z.infer<typeof SuggestExpenseCategoryOutputSchema>;

export async function suggestExpenseCategory(input: SuggestExpenseCategoryInput): Promise<SuggestExpenseCategoryOutput> {
  return suggestExpenseCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExpenseCategoryPrompt',
  input: {schema: SuggestExpenseCategoryInputSchema},
  output: {schema: z.object({ suggestedCategory: SuggestExpenseCategoryOutputSchema })}, // AI needs to output an object
  prompt: `You are an AI assistant that helps categorize expenses.
Given the expense description and a list of existing categories, suggest the most appropriate category.
Your goal is to be accurate and helpful.

Expense Description: "{{{description}}}"
Existing Categories: {{#each existingCategories}} "{{this}}"{{#if @last}}{{else}}, {{/if}}{{/each}}
Language for new category (if any): {{{language}}}

Instructions:
1.  Analyze the description.
2.  **Strongly prefer using one of the "Existing Categories"** if the description clearly fits. For example, if description is "Nasi Gorek" and "Makanan" is an existing category, suggest "Makanan". If description is "Bensin Mobil" and "Transport" is an existing category, suggest "Transport".
3.  If the description does not clearly fit any existing category, and the description is specific enough, generate a NEW, concise category name (1-2 words, in the specified language: {{{language}}}). For example, if description is "Langganan Netflix", a good new category might be "Langganan" or "Hiburan Digital". If description is "Bayar Listrik", a new category could be "Tagihan Rumah".
4.  If the description is too vague (e.g., "Lain-lain", "Sesuatu", "Pembayaran") or doesn't provide enough information to create a specific new category, and it doesn't fit an existing one, suggest "Lainnya" (if 'id') or "Others" (if 'en').
5.  Your final output must be JUST the category name.

Respond with the suggested category in the specified language.
`,
});

const suggestExpenseCategoryFlow = ai.defineFlow(
  {
    name: 'suggestExpenseCategoryFlow',
    inputSchema: SuggestExpenseCategoryInputSchema,
    outputSchema: SuggestExpenseCategoryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.suggestedCategory) {
        // Fallback to a default category if AI fails or returns empty
        return input.language === 'id' ? 'Lainnya' : 'Others';
    }
    // Ensure the suggested category is not empty
    return output.suggestedCategory.trim() || (input.language === 'id' ? 'Lainnya' : 'Others');
  }
);
