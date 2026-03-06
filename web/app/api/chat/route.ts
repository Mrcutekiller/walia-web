import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SYSTEM_PROMPT = `You are Walia AI, a friendly and knowledgeable study assistant built for students. 
Help with homework, explain concepts, create flashcards, write essays, solve math problems, and anything academic.
Be concise, clear, and encouraging. Always respond in the same language the user writes in.
If asked about trading or stocks, politely redirect to study topics instead.`;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                reply: "I'm Walia AI! My brain isn't connected yet (Missing API Key). Please check the environment configuration."
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { message, history = [], attachments = [], systemPrompt } = await req.json();

        if (!message?.trim() && attachments.length === 0) {
            return NextResponse.json({ reply: 'Please send a message or an attachment.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemPrompt || DEFAULT_SYSTEM_PROMPT,
        });

        // Prepare parts for the prompt
        const promptParts: any[] = [{ text: message || "Analyze the attached file." }];

        // Add attachments if present
        for (const attr of attachments) {
            if (attr.type?.startsWith('image/')) {
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

        // Better error categorization
        let errorMsg = 'I had trouble connecting to the AI brain. Please try again in a moment.';
        if (error.message?.includes('API_KEY_INVALID')) {
            errorMsg = 'Configuration Error: Invalid Gemini API key.';
        } else if (error.name === 'AbortError' || error.message?.includes('timeout')) {
            errorMsg = 'Request timed out. The AI is taking longer than usual.';
        }

        return NextResponse.json({ reply: errorMsg }, { status: 200 });
    }
}
