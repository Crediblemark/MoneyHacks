
'use server';
/**
 * @fileOverview An AI flow to analyze user spending patterns and provide reflective questions.
 *
 * - analyzeSpendingPatterns - A function that handles the spending analysis.
 * - AnalyzeSpendingInput - The input type for the analyzeSpendingPatterns function.
 * - AnalyzeSpendingOutput - The return type for the analyzeSpendingPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PreviousInteractionSchema = z.object({
  question: z.string().describe("The question previously asked by the AI."),
  userAnswer: z.string().describe("The user's answer to that question."),
});
export type PreviousInteraction = z.infer<typeof PreviousInteractionSchema>;

// Changed: Removed 'export' from AnalyzeSpendingInputSchema
const AnalyzeSpendingInputSchema = z.object({
  spendingHistory: z
    .string()
    .describe(
      'A detailed history of the user\'s spending habits, including dates, amounts, and categories (e.g., "YYYY-MM-DD, Kategori, Deskripsi, Jumlah"). This can be empty.'
    ),
  previousInteractions: z
    .array(PreviousInteractionSchema)
    .optional()
    .describe("An optional list of previous questions asked by the AI and the user's answers to them. Used for iterative analysis."),
  language: z.enum(['id', 'en']).describe('The language for the AI response. "id" for Indonesian, "en" for English.'),
});
export type AnalyzeSpendingInput = z.infer<typeof AnalyzeSpendingInputSchema>;

// Changed: Removed 'export' from AnalyzeSpendingOutputSchema
const AnalyzeSpendingOutputSchema = z.object({
  keyObservations: z.array(z.string()).describe("1-2 key observations AI made from the spending history or previous interactions. These should be neutral and factual."),
  reflectiveQuestions: z.array(z.string()).describe("1-3 open-ended, reflective questions for the user. These questions should be inspired by NLP meta-model patterns (challenge generalizations, deletions, distortions) to help the user think critically about their spending. Questions should directly relate to their spending history or previous answers if provided."),
  guidanceText: z.string().describe("A short, encouraging guidance text (1-2 sentences) on how to use the reflective questions or general advice on distinguishing needs vs. wants."),
});
export type AnalyzeSpendingOutput = z.infer<typeof AnalyzeSpendingOutputSchema>;


export async function analyzeSpendingPatterns(input: AnalyzeSpendingInput): Promise<AnalyzeSpendingOutput> {
  return analyzeSpendingPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingPatternsPrompt',
  input: {schema: AnalyzeSpendingInputSchema},
  output: {schema: AnalyzeSpendingOutputSchema},
  prompt: `You are a thoughtful financial coach specializing in helping users understand their spending habits and distinguish between needs and wants through self-reflection. Your goal is NOT to judge or give definitive answers, but to ask insightful questions that trigger the user's own thinking process. Respond in the language specified: {{{language}}}.

User's Spending History:
{{#if spendingHistory}}
{{{spendingHistory}}}
{{else}}
(No spending history provided for this interaction)
{{/if}}

{{#if previousInteractions.length}}
Previous User Interactions (Questions from you, Answers from user):
{{#each previousInteractions}}
  AI Question: {{this.question}}
  User Answer: {{this.userAnswer}}
{{/each}}
{{/if}}

Based on the information above:

1.  **Key Observations (1-2 observations):**
    *   If spending history is provided, identify 1-2 neutral, factual patterns or notable points. Examples: "A significant portion of 'Makanan' expenses are for dining out," or "There are several 'Belanja' items over Rp 500.000 this month."
    *   If previous interactions are provided, one observation could be about the user's response style or a theme emerging from their answers.
    *   If no history and no previous interactions, state that observations are limited. Keep this section very brief.

2.  **Reflective Questions (1-3 questions):**
    *   Generate 1-3 open-ended questions designed to make the user think more deeply.
    *   These questions should be directly inspired by their spending history (if available) or their previous answers (if available).
    *   Crucially, frame these questions using principles from NLP meta-models to gently challenge assumptions or explore underlying motivations. Examples:
        *   Challenging generalizations (e.g., "always," "never," "need to"): "You mentioned you 'always' grab coffee out. What happens on days you don't? What makes those days different?"
        *   Unpacking nominalizations (abstract nouns into processes): "You listed 'entertainment' as an expense. What specific activities does 'entertainment' involve for you, and what feeling are you seeking from them?"
        *   Exploring deletions (missing information): "Regarding the 'Lainnya Rp 200rb' expense, what specifically was that for, and what did it enable you to do or feel?"
        *   Challenging modal operators of necessity/possibility (e.g., "must," "can't"): "You said you 'had to' buy X. What would have happened if you hadn't?"
    *   If there's no spending history and no previous interactions, you can ask very general reflective questions about financial habits or one's relationship with money.

3.  **Guidance Text (1-2 sentences):**
    *   Provide a short, encouraging message. Example: "Use these questions as a starting point for your reflection. There are no right or wrong answers, only opportunities for deeper understanding." Or, if it's a follow-up: "Continuing this reflection can lead to valuable insights."

**Important Considerations:**
*   Maintain a supportive and non-judgmental tone.
*   Ensure questions are open-ended and encourage introspection.
*   If spending history is sparse or absent, acknowledge this limitation in your observations and tailor questions accordingly (more general financial reflection).
*   Keep responses concise and focused.
*   Strictly adhere to the output schema.
*   Respond ONLY in the specified language: {{{language}}}.
`,
});

const analyzeSpendingPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingPatternsFlow',
    inputSchema: AnalyzeSpendingInputSchema,
    outputSchema: AnalyzeSpendingOutputSchema,
  },
  async (input) => {
    // Basic validation: if no spending history AND no previous interactions, the AI might struggle.
    // The prompt handles this, but we can provide a default if AI fails.
    if (!input.spendingHistory && (!input.previousInteractions || input.previousInteractions.length === 0)) {
        // The prompt should still generate something, but as a fallback:
        // return {
        //   keyObservations: [],
        //   reflectiveQuestions: input.language === 'id' 
        //     ? ["Apa hubungan Anda dengan uang saat ini?", "Apa satu hal yang ingin Anda ubah terkait kebiasaan finansial Anda?"] 
        //     : ["What is your current relationship with money?", "What is one thing you'd like to change about your financial habits?"],
        //   guidanceText: input.language === 'id' 
        //     ? "Refleksi adalah langkah pertama menuju perubahan positif." 
        //     : "Reflection is the first step towards positive change."
        // };
    }

    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate an analysis response. Output is null.");
    }
    return output;
  }
);

