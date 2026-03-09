import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

<<<<<<< HEAD
const DEFAULT_SYSTEM_PROMPT = `You are Walia AI, a friendly and knowledgeable study assistant built for students. 
=======
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are Walia AI, a friendly and knowledgeable study assistant built for students. 
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
Help with homework, explain concepts, create flashcards, write essays, solve math problems, and anything academic.
Be concise, clear, and encouraging. Always respond in the same language the user writes in.
If asked about trading or stocks, politely redirect to study topics instead.`;

export async function POST(req: NextRequest) {
    try {
<<<<<<< HEAD
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                reply: "I'm Walia AI! My brain isn't connected yet (Missing API Key). Please check the environment configuration."
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { message, history = [], attachments = [], systemPrompt } = await req.json();
=======
        const { message, history = [], attachments = [] } = await req.json();
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)

        if (!message?.trim() && attachments.length === 0) {
            return NextResponse.json({ reply: 'Please send a message or an attachment.' }, { status: 400 });
        }

<<<<<<< HEAD
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemPrompt || DEFAULT_SYSTEM_PROMPT,
=======
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                reply: "I'm Walia AI! To enable real responses, please add your GEMINI_API_KEY to Vercel environment variables."
            });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_PROMPT,
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
        });

        // Prepare parts for the prompt
        const promptParts: any[] = [{ text: message || "Analyze the attached file." }];

<<<<<<< HEAD
        // Add attachments if present
        for (const attr of attachments) {
            if (attr.type?.startsWith('image/')) {
=======
        // Add attachments if present (Simplified for now - Gemini can take inlineData)
        for (const attr of attachments) {
            if (attr.type.startsWith('image/')) {
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                promptParts.push({
                    inlineData: {
                        data: attr.base64.split(',')[1],
                        mimeType: attr.type
                    }
                });
            } else if (attr.type === 'application/pdf') {
<<<<<<< HEAD
                if (attr.text) {
                    promptParts[0].text += `\n\n[PDF Snippet]:\n${attr.text}`;
=======
                // For PDF, we'll assume the client sent extracted text or we'll need a different model config
                // For now, let's just append a note if it's text
                if (attr.text) {
                    promptParts[0].text += `\n\n[PDF Content]:\n${attr.text}`;
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                }
            }
        }

        const chat = model.startChat({
            history: history.map((m: { role: string; content: string }) => ({
<<<<<<< HEAD
                role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
=======
                role: m.role === 'assistant' ? 'model' : 'user',
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
                parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(promptParts);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Chat API error:', error);
<<<<<<< HEAD

        // Better error categorization
        let errorMsg = 'I had trouble connecting to the AI brain. Please try again in a moment.';
        if (error.message?.includes('API_KEY_INVALID')) {
            errorMsg = 'Configuration Error: Invalid Gemini API key.';
        } else if (error.name === 'AbortError' || error.message?.includes('timeout')) {
            errorMsg = 'Request timed out. The AI is taking longer than usual.';
        }

        return NextResponse.json({ reply: errorMsg }, { status: 200 });
=======
        return NextResponse.json(
            { reply: 'I encountered an error. Please ensure your API key is valid and try again.' },
            { status: 200 }
        );
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
    }
}
