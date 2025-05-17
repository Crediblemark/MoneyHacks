
import { config } from 'dotenv';
config();

import '@/ai/flows/predict-expenses.ts';
import '@/ai/flows/analyze-spending-flow.ts';
import '@/ai/flows/generate-goal-image-flow.ts';
import '@/ai/flows/generate-spending-challenge-flow.ts';
import '@/ai/flows/check-financial-health-flow.ts'; // Added new flow
