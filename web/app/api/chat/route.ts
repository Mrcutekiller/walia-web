import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are Walia AI, a friendly and knowledgeable study assistant built for students. 
Help with homework, explain concepts, create flashcards, write essays, solve math problems, and anything academic.
Be concise, clear, and encouraging. Always respond in the same language the user writes in.
If asked about trading or stocks, politely redirect to study topics instead.`;

export async function POST(req: NextRequest) {
    try {
        const { message, history = [], attachments = [] } = await req.json();

        if (!message?.trim() && attachments.length === 0) {
            return NextResponse.json({ reply: 'Please send a message or an attachment.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                reply: "I'm Walia AI! To enable real responses, please add your GEMINI_API_KEY to Vercel environment variables."
            });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_PROMPT,
        });

        // Prepare parts for the prompt
        const promptParts: any[] = [{ text: message || "Analyze the attached file." }];

        // Add attachments if present (Simplified for now - Gemini can take inlineData)
        for (const attr of attachments) {
            if (attr.type.startsWith('image/')) {
                promptParts.push({
                    inlineData: {
                        data: attr.base64.split(',')[1],
                        mimeType: attr.type
                    }
                });
            } else if (attr.type === 'application/pdf') {
                // For PDF, we'll assume the client sent extracted text or we'll need a different model config
                // For now, let's just append a note if it's text
                if (attr.text) {
                    promptParts[0].text += `\n\n[PDF Content]:\n${attr.text}`;
                }
            }
        }

        const chat = model.startChat({
            history: history.map((m: { role: string; content: string }) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(promptParts);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { reply: 'I encountered an error. Please ensure your API key is valid and try again.' },
            { status: 200 }
        );
    }
}
