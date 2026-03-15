import { enableFirebaseTelemetry } from '@genkit-ai/firebase';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// Enable Firebase telemetry for Genkit
enableFirebaseTelemetry();

// Configure a Genkit instance
export const ai = genkit({
    plugins: [googleAI()],
    model: gemini15Flash, // set default model
});

// Define the helloFlow
export const helloFlow = ai.defineFlow('helloFlow', async (name: string) => {
    // make a generation request
    const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
    console.log(text);
    return text;
});
