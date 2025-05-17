
'use server';
/**
 * @fileOverview An AI flow to generate an image for a financial goal.
 *
 * - generateGoalImage - A function that handles the image generation.
 * - GenerateGoalImageInput - The input type.
 * - GenerateGoalImageOutput - The return type (imageDataUri).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGoalImageInputSchema = z.object({
  prompt: z.string().describe('A description of the financial goal to visualize. This will be used as the prompt for image generation.'),
  language: z.enum(['id', 'en']).describe('The language for any text that might be subtly incorporated or considered by the model, though the primary output is an image.'),
});
export type GenerateGoalImageInput = z.infer<typeof GenerateGoalImageInputSchema>;

// Output is just the image data URI string
const GenerateGoalImageOutputSchema = z.string().describe("The generated image as a data URI (e.g., 'data:image/png;base64,...').");
export type GenerateGoalImageOutput = z.infer<typeof GenerateGoalImageOutputSchema>;


export async function generateGoalImage(input: GenerateGoalImageInput): Promise<GenerateGoalImageOutput> {
  return generateGoalImageFlow(input);
}

const generateGoalImageFlow = ai.defineFlow(
  {
    name: 'generateGoalImageFlow',
    inputSchema: GenerateGoalImageInputSchema,
    outputSchema: GenerateGoalImageOutputSchema,
  },
  async (input) => {
    const fullPrompt = input.language === 'id' 
      ? `Sebuah gambar yang memotivasi dan menginspirasi untuk mencapai target keuangan: "${input.prompt}". Gaya visual: cerah, positif, sedikit abstrak namun jelas. Tidak ada teks dalam gambar.`
      : `A motivating and inspiring image for achieving a financial goal: "${input.prompt}". Visual style: bright, positive, slightly abstract yet clear. No text in the image.`;

    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Ensure this is the correct model for image generation
        prompt: fullPrompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'], // TEXT is often required even if not primarily used
        },
      });

      if (!media || !media.url) {
        throw new Error('AI did not return an image.');
      }
      return media.url; // This should be the data URI
    } catch (error) {
      console.error('Error generating goal image with AI:', error);
      // Consider if a default placeholder or specific error message should be returned
      // For now, re-throwing the error to be handled by the caller
      if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
      }
      throw new Error('An unknown error occurred during image generation.');
    }
  }
);
