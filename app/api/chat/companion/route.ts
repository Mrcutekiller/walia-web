import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const getSystemPrompt = (mode: string, level: string) => {
    let base = `You are Walia AI, participating in a group or private chat as a smart companion. 
    You must adopt the persona of: Mode=${mode}, Level=${level}.
    Be helpful, conversational, and stay in character. Do not roboticize your responses. 
    Respond as if you are a human expert acting under this persona.`;

    if (mode === 'Study') base += ` Focus on explaining academic concepts clearly at the ${level} level.`;
    if (mode === 'Debate') base += ` Take a ${level} stance in debates. Argue points logically but passionately.`;
    if (mode === 'Rizz') base += ` Act with ${level} charm and charisma. Be smooth and witty.`;
    if (mode === 'Teacher') base += ` Act as a ${level} teacher. Ask guiding questions, don't just give answers directly.`;

    return base + '\nDo not include "Walia:" at the start of your message, the system handles that.';
};

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ reply: 'Walia AI is offline. Please configure GEMINI_API_KEY.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { message, history = [], mode, level } = await req.json();

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: getSystemPrompt(mode || 'Study', level || 'Beginner'),
        });

        const chat = model.startChat({
            history: history.map((m: { role: string; content: string }) => ({
                role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Companion API error:', error);
        const errorMsg = error.message?.includes('API_KEY_INVALID')
            ? 'API Key Invalid. Please check your setup.'
            : 'AI Connection unstable. retrying...';
        return NextResponse.json({ reply: errorMsg }, { status: 200 });
    }
}
