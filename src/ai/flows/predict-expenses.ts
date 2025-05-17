
'use server';

/**
 * @fileOverview Predicts expenses for the upcoming month and provides saving recommendations based on past spending habits,
 * aligning with a 50/15/10/20/5 (Needs/Wants/Savings/Investments/Social) budgeting rule.
 * It can use provided monthly income or estimate it from spending history.
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
  monthlyIncome: z
    .number()
    .optional()
    .describe('The user\'s total monthly income. If provided, this will be used for calculations. If not, income will be estimated from spending history.'),
  language: z.enum(['id', 'en']).describe('The language for the AI response. "id" for Indonesian, "en" for English.'),
});
export type PredictExpensesInput = z.infer<typeof PredictExpensesInputSchema>;

const BudgetCategoryAnalysisSchema = z.object({
  targetPercentage: z.number().describe('The target percentage for this category according to the rule (e.g., 50 for 50%).'),
  actualPercentage: z.number().describe('The actual percentage spent/allocated based on user data or recommendations (e.g., 45 for 45%).'),
  recommendedAmount: z.string().describe('The recommended monetary amount for this category (e.g., "Rp 5.000.000"). The AI should format this string clearly.'),
  feedback: z.string().describe('Feedback or advice related to this category, explaining the alignment or deviation from the target. This feedback should be direct and "to the point".'),
});

const PredictExpensesOutputSchema = z.object({
  financialPlan: z.object({
    estimatedMonthlyIncome: z.string().describe('The monthly income used for calculations. This will be the user-provided monthlyIncome if available, otherwise it\'s estimated from spending. Formatted as currency string.'),
    needs: BudgetCategoryAnalysisSchema.describe('Analysis and recommendations for essential needs (target: max 50%). Examples: Food, Transportation.'),
    wants: BudgetCategoryAnalysisSchema.describe('Analysis and recommendations for discretionary wants (target: max 15%). Examples: Shopping, Others.'),
    savings: BudgetCategoryAnalysisSchema.describe('Recommendations for savings (target: min 10%).'),
    investments: BudgetCategoryAnalysisSchema.describe('Recommendations for investments (target: min 20%).'),
    social: BudgetCategoryAnalysisSchema.describe('Recommendations for social contributions/ZIS (target: min 5%).'),
  }),
  overallFeedback: z.string().describe('Overall feedback and actionable steps to help the user achieve the financial plan. This should be brutally honest, "tough love" style, direct, and push the user to take action. No sugarcoating.'),
});
export type PredictExpensesOutput = z.infer<typeof PredictExpensesOutputSchema>;

export async function predictExpenses(input: PredictExpensesInput): Promise<PredictExpensesOutput> {
  return predictExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictExpensesPrompt',
  input: {schema: PredictExpensesInputSchema},
  output: {schema: PredictExpensesOutputSchema},
  prompt: `You are a brutally honest, 'tough love' personal finance advisor, like a close friend who's fed up with the user's bad money habits and is giving them a much-needed wake-up call. Your goal is to force the user to confront their financial reality and stick to a specific rule. Be direct, blunt, and don't sugarcoat anything. Provide amounts (like recommendedAmount and estimatedMonthlyIncome) as clearly formatted currency strings (e.g., "Rp 5.000.000" or "$500").

The financial rule is:
- Kebutuhan (Needs): Maximum 50% of income. (Examples: Makanan, Transportasi from user's spending history)
- Keinginan (Wants): Maximum 15% of income. (Examples: Belanja, Lainnya from user's spending history)
- Tabungan (Savings): Minimum 10% of income.
- Investasi (Investment): Minimum 20% of income.
- Sosial/ZIS (Charity/Tithe): Minimum 5% of income.

User's Spending History: {{{spendingHistory}}}
{{#if monthlyIncome}}User's Provided Monthly Income: {{{monthlyIncome}}}{{/if}}

Based on the provided information:
1.  First, determine the monthly income to be used for analysis.
    -   If a 'monthlyIncome' value ({{{monthlyIncome}}}) is provided by the user, use that value directly as the 'estimatedMonthlyIncome' for all calculations.
    -   If 'monthlyIncome' is NOT provided, then you must estimate their monthly income. Use their total monthly spending from the 'spendingHistory' as a proxy for their income for this analysis. If their spending history is sparse or very short (e.g., less than 2 weeks of data or very few transactions), state bluntly that the estimation is a wild guess but proceed.
    Provide the determined or estimated income as 'estimatedMonthlyIncome' in the output.

2.  Analyze their spending history ({{{spendingHistory}}}). Classify expenses categorized as "Makanan" and "Transportasi" as 'Kebutuhan (Needs)'. Classify expenses categorized as "Belanja" and "Lainnya" as 'Keinginan (Wants)'.

3.  For each category in the financial plan (Needs, Wants, Savings, Investments, Social):
    a.  Set the 'targetPercentage' according to the rule (e.g., 50 for Needs, 15 for Wants, etc.).
    b.  Calculate the 'actualPercentage' of their 'estimatedMonthlyIncome'. For Needs and Wants, use their historical spending from the 'spendingHistory'. For Savings, Investments, and Social, if the 'spendingHistory' doesn't show these specific categories, assume 0% actual and call them out for neglecting these areas.
    c.  Calculate the 'recommendedAmount' for this category based on the 'targetPercentage' and the 'estimatedMonthlyIncome'.
    d.  Provide specific 'feedback'. This should compare their actual spending (if available) to the target. If they are overspending in Needs/Wants, tell them to cut it out, no excuses. If underspending in Savings/Investments/Social, tell them they are failing and need to start immediately. Be brutally direct.

4.  Provide 'overallFeedback' with actionable steps. This must be a summary of how to fix their spending and allocation to meet all targets. Your tone must be extremely direct, blunt, and like a "tough love" intervention. No coddling.
    *   If their current Needs + Wants (sum of actualPercentage for Needs and Wants) are significantly over the 65% target (e.g., > 70-75%), be extremely blunt and almost aggressive. For example (ID): "Woi, sadar gak sih?! Kebutuhan sama Keinginanmu itu udah ngabisin [Actual Combined Percentage]% dari duitmu! Ini udah lampu merah, bukan kuning lagi! Dompetmu itu udah teriak minta ampun! Kapan mau berubah kalau boros terus?!" (EN): "Hey, wake up! Your Needs and Wants are devouring [Actual Combined Percentage]% of your money! This is a red alert, not a drill! Your wallet is screaming! When are you going to change if you keep splurging like this?!" (Replace [Actual Combined Percentage] with the calculated sum).
    *   If things are generally on track or close, give them a very short, direct acknowledgement, but immediately pivot to what still needs fixing. Example: "Oke, lumayan. Tapi jangan seneng dulu, masih ada yang harus dibenerin. Jangan kendor!" or "Okay, not bad. But don't get complacent, there's still work to do. No slacking!"
    *   Always be brutally practical with your advice. If spending history is too short for a robust analysis (and income was estimated), say the analysis is basically a guess but the rules still apply and they better start tracking properly. Example: "Datamu minim banget, jadi analisis ini kayak nebak-nebak buah manggis. Tapi aturan 50/15/10/20/5 itu harga mati. Mulai catet yang bener, atau janganharap keuanganmu beres!" or "Your data is pathetic, so this analysis is a shot in the dark. But the 50/15/10/20/5 rule is non-negotiable. Start tracking properly, or don't expect your finances to ever be in order!"

Important: Respond in the language specified by the 'language' field: {{{language}}}. If 'id', respond in Indonesian. If 'en', respond in English.
Ensure all monetary values in 'recommendedAmount' and 'estimatedMonthlyIncome' are presented as clear, formatted strings (e.g., "Rp 1.250.000" or "$125.00").
For 'actualPercentage' and 'targetPercentage', use numerical values representing percentages (e.g., 50 for 50%, 15 for 15%).
The feedback for each category and the overall feedback must be brutally honest, pushy, and maintain that "tough love" friend vibe who's had enough of excuses.
`,
});

const predictExpensesFlow = ai.defineFlow(
  {
    name: 'predictExpensesFlow',
    inputSchema: PredictExpensesInputSchema,
    outputSchema: PredictExpensesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a response. Output is null.");
    }
    return output;
  }
);

