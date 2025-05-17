
'use server';
/**
 * @fileOverview An AI flow to generate a personalized spending challenge for the user.
 *
 * - generateSpendingChallenge - A function that handles the challenge generation.
 * - GenerateSpendingChallengeInput - The input type.
 * - GenerateSpendingChallengeOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpendingChallengeInputSchema = z.object({
  spendingHistory: z
    .string()
    .describe(
      'A detailed history of the user\'s recent spending habits (e.g., last 30 days), including dates, amounts, and categories (e.g., "YYYY-MM-DD, Kategori, Deskripsi, Jumlah"). This can be empty.'
    ),
  language: z.enum(['id', 'en']).describe('The language for the AI response. "id" for Indonesian, "en" for English.'),
});
export type GenerateSpendingChallengeInput = z.infer<typeof GenerateSpendingChallengeInputSchema>;

const GenerateSpendingChallengeOutputSchema = z.object({
  challengeTitle: z.string().describe("A short, catchy, and direct title for the 7-day spending challenge (max 5-7 words). Example (ID): 'Stop Jajan Kopi Seminggu!' or (EN): 'No Coffee Runs This Week!'."),
  challengeDescription: z.string().describe("A detailed description of the 7-day spending challenge. This should be specific, measurable, actionable, relevant, and time-bound. It must use a 'tough love' and direct tone, like a close friend giving a wake-up call. It should clearly state what the user needs to do or avoid. If spending history is sparse, the challenge can be more general, like tracking every single expense for a week. Example (ID): 'Pengeluaran 'Jajan Kopi'-mu minggu lalu RpXXX.XXX! Gila ya? Tantangan buatmu: selama 7 hari ke depan, NOL RUPIAH buat kopi di luar. Masak sendiri atau tahan! Katanya mau hemat, kan? Buktiin dong!' or (EN): 'Your 'Coffee Runs' last week cost $XX.XX! Seriously? Your challenge: for the next 7 days, ZERO DOLLARS on takeout coffee. Make it at home or skip it! You said you wanted to save, right? Prove it!'"),
});
export type GenerateSpendingChallengeOutput = z.infer<typeof GenerateSpendingChallengeOutputSchema>;

export async function generateSpendingChallenge(input: GenerateSpendingChallengeInput): Promise<GenerateSpendingChallengeOutput> {
  return generateSpendingChallengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSpendingChallengePrompt',
  input: {schema: GenerateSpendingChallengeInputSchema},
  output: {schema: GenerateSpendingChallengeOutputSchema},
  prompt: `You are a brutally honest, 'tough love' financial coach. Your task is to analyze the user's recent spending history and devise a specific, actionable 7-DAY SPENDING CHALLENGE. This challenge must be designed to help them cut unnecessary expenses or build better financial habits. Your tone must be direct, blunt, and motivating, like a close friend who's fed up but wants to see them succeed. Respond in the language specified: {{{language}}}.

User's Recent Spending History:
{{#if spendingHistory}}
{{{spendingHistory}}}
{{else}}
(No recent spending history provided. This is a problem. If so, the challenge should be about meticulous tracking for a week: "Data pengeluaranmu KOSONG! Tantanganmu: selama 7 hari ke depan, CATAT SETIAP RUPIAH yang keluar. Gak ada alasan. Biar kita lihat borosnya di mana!" or "Your expense data is EMPTY! Your challenge: for the next 7 days, TRACK EVERY SINGLE DOLLAR spent. No excuses. Let's see where the leaks are!")
{{/if}}

Based on the information:

1.  **Identify a Key Area for Improvement:** Look for high-frequency discretionary spending (e.g., coffee, snacks, impulse buys), a category with consistently high spending that could be reduced (e.g., eating out, shopping), or lack of tracking if history is empty.

2.  **Create a Challenge Title (max 5-7 words):** Make it catchy, direct, and clearly state the core challenge.
    *   Example (ID): "Stop Boros Makan Luar!" or "Minggu Tanpa Belanja Online!"
    *   Example (EN): "No More Takeout Waste!" or "Online Shopping Freeze Week!"

3.  **Craft a Challenge Description:**
    *   **Be Specific:** What exactly should the user do or not do? (e.g., "Tidak ada pengeluaran untuk makan di restoran atau kafe." vs "Kurangi makan di luar.")
    *   **Be Measurable:** How will they know if they succeeded? (e.g., "Target: Rp0 untuk kategori X" or "Bawa bekal makan siang minimal 3 kali.")
    *   **Be Actionable:** Is it something they can realistically do?
    *   **Be Relevant:** Does it address a clear pattern in their spending?
    *   **Be Time-bound:** The challenge is for 7 days.
    *   **Use "Tough Love" Tone:** Be direct, blunt, and motivating. Don't be afraid to call them out if their spending is clearly excessive in one area.
        *   Example (ID): "Minggu lalu kamu ngabisin Rp YYY.YYY buat 'Belanja Baju'. Lemarimu udah mau jebol kali! Tantangan: MINGGU INI, GAK ADA BELANJA BAJU SAMA SEKALI. Tahan dulu itu napsu belanjamu. Bisa, kan?!"
        *   Example (EN): "Last week you blew $YYY.YY on 'Clothes Shopping'. Your closet must be exploding! Challenge: THIS WEEK, ABSOLUTELY NO CLOTHES SHOPPING. Control that urge. You can do it, right?!"
    *   If spending history is sparse/empty, the challenge should be about meticulous tracking:
        *   Example (ID): "Karena datamu dikit banget, tantanganmu simpel tapi penting: selama 7 HARI PENUH, catat SEMUA pengeluaranmu, sekecil apapun. Gak ada yang kelewat. Kalau gak gitu, gimana mau tahu duitmu lari ke mana aja?"
        *   Example (EN): "Since your data is so scarce, your challenge is simple but crucial: for 7 FULL DAYS, track ALL your expenses, no matter how small. Miss nothing. Otherwise, how will you ever know where your money is going?"

Strictly adhere to the output schema.
`,
});

const generateSpendingChallengeFlow = ai.defineFlow(
  {
    name: 'generateSpendingChallengeFlow',
    inputSchema: GenerateSpendingChallengeInputSchema,
    outputSchema: GenerateSpendingChallengeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a spending challenge. Output is null.");
    }
    return output;
  }
);
