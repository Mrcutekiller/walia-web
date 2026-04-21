import { NextRequest, NextResponse } from 'next/server';

// ─── API Configuration ───────────────────────────────────────────────────────
// Chat: Modal GLM-5.1-FP8
const MODAL_API_URL = "https://api.us-west-2.modal.direct/v1/chat/completions";
const MODAL_API_KEY = process.env.MODAL_API_KEY!;
const MODAL_MODEL   = "zai-org/GLM-5.1-FP8";

const DEFAULT_SYSTEM_PROMPT = `You are Walia AI, a friendly and highly knowledgeable study assistant built for students worldwide.
You help with homework, explain concepts clearly, create flashcards, write essays, solve math and science problems, and anything academic.
Be concise, encouraging, and always respond in the same language the user writes in.
You are powered by Modal GLM-5.1 — a state-of-the-art AI model.
Never claim to be GPT, Claude, or Gemini. You are Walia AI.`;

// ─── POST /api/chat ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        if (!MODAL_API_KEY) {
            console.error("MODAL_API_KEY is not set in environment variables.");
            return NextResponse.json({ reply: "AI service is not configured. Please contact support." }, { status: 500 });
        }

        const { message, history = [], attachments = [], systemPrompt, isAddingEvent } = await req.json();

        if (!message?.trim() && (!attachments || attachments.length === 0)) {
            return NextResponse.json({ reply: 'Please send a message or an attachment.' }, { status: 400 });
        }

        // Build system prompt
        let currentSystemPrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;
        if (isAddingEvent) {
            currentSystemPrompt += `\n\nCRITICAL INSTRUCTION: The user is trying to add an event. You MUST reply ONLY with a valid JSON object in this exact structure: {"eventDetails": {"title": "string", "time": "HH:MM", "date": "YYYY-MM-DD"}, "reply": "A short friendly confirmation."}. No other text.`;
        }

        // Assemble messages array
        const messages: any[] = [{ role: "system", content: currentSystemPrompt }];

        // Add conversation history
        for (const msg of history) {
            messages.push({
                role: msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user',
                content: msg.content,
            });
        }

        // Current user message — support multimodal (text + images)
        let currentContent: any = message || "Analyze the attached file.";
        let hasImages = false;

        if (attachments && attachments.length > 0) {
            const parts: any[] = [];
            parts.push({ type: "text", text: message?.trim() || "Analyze the attached file." });

            for (const attr of attachments) {
                if (attr.type?.startsWith('image/')) {
                    hasImages = true;
                    parts.push({ type: "image_url", image_url: { url: attr.base64 } });
                } else if (attr.type === 'application/pdf' && attr.text) {
                    parts.push({ type: "text", text: `\n\n[PDF Content]:\n${attr.text}` });
                }
            }
            currentContent = hasImages ? parts : parts.map((p: any) => p.text).join("\n");
        }

        messages.push({ role: "user", content: currentContent });

        // ── Call Modal GLM-5.1 ──────────────────────────────────────────────
        const response = await fetch(MODAL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MODAL_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODAL_MODEL,
                messages,
                max_tokens: 2000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error("Modal GLM API Error:", response.status, errBody);
            throw new Error(`Modal API failed with status ${response.status}`);
        }

        const data = await response.json();
        const replyText: string = data.choices?.[0]?.message?.content || "";

        // ── Event extraction mode ───────────────────────────────────────────
        if (isAddingEvent) {
            try {
                const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                return NextResponse.json({
                    reply: parsed.reply || "Event scheduled successfully!",
                    eventDetails: parsed.eventDetails,
                });
            } catch {
                console.error("Failed to parse event JSON from AI response.");
                return NextResponse.json({ reply: replyText });
            }
        }

        return NextResponse.json({ reply: replyText });

    } catch (error: any) {
        console.error('Chat API error:', error.message);
        return NextResponse.json(
            { reply: "I'm having trouble connecting right now. Please try again in a moment." },
            { status: 200 }
        );
    }
}
