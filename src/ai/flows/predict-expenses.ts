
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
  feedback: z.string().describe('Feedback or advice related to this category, explaining the alignment or deviation from the target.'),
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
  overallFeedback: z.string().describe('Overall feedback and actionable steps to help the user achieve the financial plan. This should be comprehensive, encouraging, and delivered in a friendly, casual tone.'),
});
export type PredictExpensesOutput = z.infer<typeof PredictExpensesOutputSchema>;

export async function predictExpenses(input: PredictExpensesInput): Promise<PredictExpensesOutput> {
  return predictExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictExpensesPrompt',
  input: {schema: PredictExpensesInputSchema},
  output: {schema: PredictExpensesOutputSchema},
  prompt: `You are an expert personal finance advisor, but you're also a friendly, approachable, and super encouraging money-savvy best friend! Your goal is to help the user manage their finances according to a specific rule. Please provide amounts (like recommendedAmount and estimatedMonthlyIncome) as clearly formatted currency strings (e.g., "Rp 5.000.000" or "$500").

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
    -   If 'monthlyIncome' is NOT provided, then you must estimate their monthly income. Use their total monthly spending from the 'spendingHistory' as a proxy for their income for this analysis. If their spending history is sparse or very short (e.g., less than 2 weeks of data or very few transactions), state that the estimation might be less accurate but proceed with an estimation based on available data.
    Provide the determined or estimated income as 'estimatedMonthlyIncome' in the output.

2.  Analyze their spending history ({{{spendingHistory}}}). Classify expenses categorized as "Makanan" and "Transportasi" as 'Kebutuhan (Needs)'. Classify expenses categorized as "Belanja" and "Lainnya" as 'Keinginan (Wants)'.

3.  For each category in the financial plan (Needs, Wants, Savings, Investments, Social):
    a.  Set the 'targetPercentage' according to the rule (e.g., 50 for Needs, 15 for Wants, etc.).
    b.  Calculate the 'actualPercentage' of their 'estimatedMonthlyIncome'. For Needs and Wants, use their historical spending from the 'spendingHistory'. For Savings, Investments, and Social, if the 'spendingHistory' doesn't show these specific categories, assume 0% actual for now and focus recommendations on how to start allocating.
    c.  Calculate the 'recommendedAmount' for this category based on the 'targetPercentage' and the 'estimatedMonthlyIncome'.
    d.  Provide specific 'feedback'. This should compare their actual spending (if available) to the target. If they are overspending in Needs/Wants, suggest ways to reduce it casually. If underspending in Savings/Investments/Social, encourage allocation positively. Be practical and provide actionable advice.

4.  Provide 'overallFeedback' with actionable steps. This should be a summary of how to adjust their spending and allocation to meet all targets. Your tone should be friendly, casual, and super encouraging.
    *   If their current Needs + Wants (sum of actualPercentage for Needs and Wants) are significantly over the 65% target (e.g., > 70-75%), you can be a bit more direct (but still friendly and playful!) to help them see it. For example: "Whoa there, superstar! Looks like our 'Needs' and 'Wants' had a bit of a party this month, gobbling up [Actual Combined Percentage]% of the budget. Let's brainstorm how we can nudge that closer to our 65% goal so your savings and investments can get some love too!" (Replace [Actual Combined Percentage] with the calculated sum).
    *   If things are generally on track or close, be super positive: "Looking good! You're doing a great job with your budget. Just a few small tweaks here and there, and you'll be a financial rockstar!" or "Awesome work! You're really getting the hang of this. Keep it up!"
    *   Always be practical with your advice. If spending history is too short for a robust analysis (and income was estimated), mention this limitation in a lighthearted way but still provide general guidance based on the rule. For instance: "We're still getting to know your spending style since the history is a bit new, but here's the general game plan based on the 50/15/10/20/5 rule to get you started..."

Important: Respond in the language specified by the 'language' field: {{{language}}}. If 'id', respond in Indonesian. If 'en', respond in English.
Ensure all monetary values in 'recommendedAmount' and 'estimatedMonthlyIncome' are presented as clear, formatted strings (e.g., "Rp 1.250.000" or "$125.00").
For 'actualPercentage' and 'targetPercentage', use numerical values representing percentages (e.g., 50 for 50%, 15 for 15%).
The feedback for each category and the overall feedback should be user-friendly, clear, actionable, and maintain that casual, supportive friend vibe.
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

