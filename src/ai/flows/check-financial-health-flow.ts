
'use server';
/**
 * @fileOverview An AI flow to perform a monthly financial health check-up.
 *
 * - checkFinancialHealth - A function that handles the health check.
 * - CheckFinancialHealthInput - The input type.
 * - CheckFinancialHealthOutput - The return type (the "report card").
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckFinancialHealthInputSchema = z.object({
  spendingHistoryForMonth: z
    .string()
    .describe(
      'A detailed history of the user\'s spending habits for the selected month (e.g., "YYYY-MM-DD, Kategori, Deskripsi, Jumlah"). This can be sparse or empty.'
    ),
  incomeForMonth: z
    .number()
    .describe('The total income recorded by the user for the selected month. Can be 0 if no income recorded.'),
  language: z.enum(['id', 'en']).describe('The language for the AI response. "id" for Indonesian, "en" for English.'),
  selectedMonth: z.number().min(1).max(12).describe('The month (1-12) for which the health check is being performed.'),
  selectedYear: z.number().describe('The year for which the health check is being performed.'),
  financialGoals: z.string().optional().describe('A summary of the user\'s active financial goals, e.g., "Goal 1: Liburan (Rp 5jt/10jt)". Can be empty.'),
});
export type CheckFinancialHealthInput = z.infer<typeof CheckFinancialHealthInputSchema>;

const CheckFinancialHealthOutputSchema = z.object({
  overallGrade: z.string().describe("A single, concise 'grade' for the month's financial health (e.g., 'A+', 'B', 'C-', 'Perlu Perbaikan Serius!', 'Data Kurang'). This should be brutally honest."),
  positiveHighlights: z.array(z.string()).describe("1-3 key positive points or good habits observed during the month. Delivered with 'tough love' encouragement. If none, this can be empty or a neutral statement."),
  areasForImprovement: z.array(z.string()).describe("1-3 key areas where spending was off-track or financial habits could be better. Delivered very directly and bluntly. If none, this can be empty or a neutral statement. This should also consider if spending patterns hinder financial goals."),
  actionableAdviceNextMonth: z.array(z.string()).describe("1-3 specific, actionable pieces of advice for the user to focus on next month. Phrased as direct commands or strong suggestions. This advice should consider the user's financial goals and how to align spending/saving towards them."),
  summaryMessage: z.string().describe("A short, impactful 'tough love' summary message from the AI coach, like a final word on the report card. This should encapsulate the overall sentiment and push for action or acknowledge good work if applicable. This message can also relate to their financial goals."),
});
export type CheckFinancialHealthOutput = z.infer<typeof CheckFinancialHealthOutputSchema>;

export async function checkFinancialHealth(input: CheckFinancialHealthInput): Promise<CheckFinancialHealthOutput> {
  return checkFinancialHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkFinancialHealthPrompt',
  input: {schema: CheckFinancialHealthInputSchema},
  output: {schema: CheckFinancialHealthOutputSchema},
  prompt: `You are an extremely blunt, 'tough love' financial coach delivering a monthly report card. No sugarcoating. Your goal is to give a brutally honest assessment of the user's financial health for the specified month (Month: {{{selectedMonth}}}, Year: {{{selectedYear}}}) and provide direct, actionable feedback. Respond ONLY in {{{language}}}.

User's Income for the Month: {{{incomeForMonth}}}
User's Spending History for the Month:
{{#if spendingHistoryForMonth}}
{{{spendingHistoryForMonth}}}
{{else}}
(No spending history provided for this month. This is a MAJOR issue if we're trying to assess health.)
{{/if}}
{{#if financialGoals}}
User's Financial Goals: {{{financialGoals}}}
{{else}}
(User has not listed any financial goals.)
{{/if}}

The financial rule for guidance is 50/15/10/20/5 (Needs max 50%, Wants max 15%, Savings min 10%, Investment min 20%, Social min 5%).

Based on the information:

1.  **Overall Grade:**
    *   First, check data quality. If income is 0 AND spending history is empty/very sparse (e.g., < 5 transactions), the grade is 'DATA KURANG' (ID) or 'INSUFFICIENT DATA' (EN). The rest of the report should reflect this lack of data.
    *   If data is somewhat present, assess spending vs. income and adherence to the 50/15/10/20/5 rule.
    *   Be VERY direct. Examples:
        *   ID: 'A' (Luar Biasa!), 'B+' (Bagus, Tingkatkan!), 'C' (WASPADA!), 'D' (BAHAYA, PERBAIKI SEKARANG!), 'E' (KRITIS, BUTUH INTERVENSI TOTAL!).
        *   EN: 'A' (Excellent!), 'B+' (Good, Keep Improving!), 'C' (CAUTION!), 'D' (DANGER, FIX IT NOW!), 'E' (CRITICAL, TOTAL INTERVENTION NEEDED!).

2.  **Positive Highlights (1-3 points):**
    *   Even in bad months, try to find *something* (if truly none, state it bluntly: "Gak ada yang bisa dipuji bulan ini." / "Nothing to praise this month.").
    *   Examples (ID): "Pengeluaran 'Makanan' lumayan terkontrol, bagus!", "Ada usaha nabung, walau dikit. Lanjutin!", "Gak banyak belanja impulsif, patut diapresiasi."
    *   Examples (EN): "Your 'Food' spending was reasonably controlled, good!", "Some effort in saving, even if small. Keep it up!", "Not much impulsive shopping, appreciate that."

3.  **Areas for Improvement (1-3 points):**
    *   BE BRUTAL. Focus on the biggest leaks or bad habits based on the 50/15/10/20/5 rule.
    *   **If 'financialGoals' are provided**, identify if current spending/saving patterns are misaligned with achieving these goals. Example: "Nabungmu cuma segini bulan ini, padahal target {{{financialGoals}}} kamu butuh komitmen lebih. Gimana mau tercapai kalau begini terus?" or "Your savings this month are pathetic, especially with your goal of {{{financialGoals}}}. How do you expect to reach it like this?"
    *   Examples (ID): "'Keinginan'mu MELEDAK! Lebih dari separuh gaji habis buat foya-foya. Mau jadi apa?", "Nabung & Investasi NOL BESAR. Ini sih cari penyakit namanya.", "Terlalu banyak 'Lainnya' yang gak jelas. Nyembunyiin apa sih?"
    *   Examples (EN): "Your 'Wants' EXPLODED! More than half your income on splurges. What's the plan?", "Savings & Investment: BIG ZERO. You're asking for trouble.", "Too many vague 'Others'. What are you hiding?"

4.  **Actionable Advice for Next Month (1-3 points):**
    *   Give direct commands or very strong suggestions based on 'Areas for Improvement'.
    *   **If 'financialGoals' are provided**, make advice directly related to achieving them. Example: "BULAN DEPAN: Sisihkan RpXXX khusus buat target {{{financialGoals}}} kamu SEBELUM belanja apapun!" or "NEXT MONTH: Earmark $XXX specifically for your goal '{{{financialGoals}}}' BEFORE any other spending!"
    *   Examples (ID): "BULAN DEPAN: POTONG pengeluaran 'Belanja' minimal 50%!", "WAJIB sisihkan 10% gaji buat nabung DI AWAL bulan, jangan nunggu sisa!", "CATAT SEMUA pengeluaran, jangan ada yang kelewat biar jelas borosnya di mana!"
    *   Examples (EN): "NEXT MONTH: CUT your 'Shopping' expenses by at least 50%!", "MANDATORY: set aside 10% of your salary for savings AT THE START of the month, don't wait for leftovers!", "TRACK ALL expenses, miss nothing, so you know where the leaks are!"

5.  **Summary Message:**
    *   A final "punchline" from the coach.
    *   **If 'financialGoals' are provided**, the message can reinforce the importance of discipline for these goals. Example: "Rapor bulan ini jadi pengingat keras. Kalau target {{{financialGoals}}} itu serius, ya usahanya juga harus serius. Jangan cuma mimpi!" or "This month's report is a wake-up call. If your goal '{{{financialGoals}}}' is serious, so should be your effort. Stop dreaming, start doing!"
    *   Examples (ID): "Rapor bulan ini JEBLOK. Jangan cuma diliatin, tapi DILAKUIN sarannya! Bulan depan harus lebih baik, atau siap-siap aja masa depan suram.", "Lumayan lah bulan ini, tapi jangan cepat puas. Masih banyak ruang buat jadi lebih disiplin. GAS TERUS!"
    *   Examples (EN): "This month's report is TERRIBLE. Don't just stare at it, ACT on the advice! Next month better be an improvement, or your future's bleak.", "Not bad this month, but don't get complacent. Lots of room for more discipline. KEEP PUSHING!"

Strictly adhere to the output schema.
If income is 0 AND spending history is sparse/empty, the ENTIRE report must emphasize that it's based on extremely limited data and is therefore a very rough guess, or simply state that a proper check-up isn't possible.
`,
});

const checkFinancialHealthFlow = ai.defineFlow(
  {
    name: 'checkFinancialHealthFlow',
    inputSchema: CheckFinancialHealthInputSchema,
    outputSchema: CheckFinancialHealthOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a health check report. Output is null.");
    }

    // If AI didn't set grade to INSUFFICIENT DATA but data was indeed very poor
    if (input.incomeForMonth === 0 && (!input.spendingHistoryForMonth || input.spendingHistoryForMonth.split('\n').length < 5)) {
        const insufficientGrade = input.language === 'id' ? 'DATA KURANG' : 'INSUFFICIENT DATA';
        if (output.overallGrade !== insufficientGrade) {
            output.overallGrade = insufficientGrade;
            const msg = input.language === 'id' ? "Tidak cukup data untuk analisis mendalam." : "Not enough data for a deep analysis.";
            output.positiveHighlights = [msg];
            output.areasForImprovement = [msg];
            output.actionableAdviceNextMonth = [input.language === 'id' ? "Catat lebih banyak transaksi bulan depan!" : "Log more transactions next month!"];
            output.summaryMessage = input.language === 'id' ? "Perbaiki pencatatanmu agar AI bisa bantu lebih baik!" : "Improve your tracking so AI can help you better!";
        }
    }
    return output;
  }
);

    
