import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are Walia AI, a friendly and knowledgeable study assistant built for students. 
Help with homework, explain concepts, create flashcards, write essays, solve math problems, and anything academic.
Be concise, clear, and encouraging. Always respond in the same language the user writes in.
If asked about trading or stocks, politely redirect to study topics instead.`;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                reply: "I'm Walia AI! I need a GEMINI_API_KEY to work. Please check your environment variables."
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { message, history = [], attachments = [] } = await req.json();

        if (!message?.trim() && attachments.length === 0) {
            return NextResponse.json({ reply: 'Please send a message or an attachment.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_PROMPT,
        });

        // Prepare parts for the prompt
        const promptParts: any[] = [{ text: message || "Analyze the attached file." }];

        // Add attachments if present
        for (const attr of attachments) {
            if (attr.type.startsWith('image/')) {
                promptParts.push({
                    inlineData: {
                        data: attr.base64.split(',')[1],
                        mimeType: attr.type
                    }
                });
            } else if (attr.type === 'application/pdf') {
                if (attr.text) {
                    promptParts[0].text += `\n\n[PDF Snippet]:\n${attr.text}`;
                }
            }
        }

        const chat = model.startChat({
            history: history.map((m: { role: string; content: string }) => ({
                role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(promptParts);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Chat API error:', error);
        const errorMsg = error.message?.includes('API_KEY_INVALID')
            ? 'Your Gemini API key appears to be invalid. Please check your settings.'
            : 'I had trouble connecting to the AI brain. Please try again in a moment.';
        return NextResponse.json({ reply: errorMsg }, { status: 200 });
    }
}
