import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SYSTEM_PROMPT = `You are Walia AI, a friendly and knowledgeable study assistant built for students. 
Help with homework, explain concepts, create flashcards, write essays, solve math problems, and anything academic.
Be concise, clear, and encouraging. Always respond in the same language the user writes in.
If asked about trading or stocks, politely redirect to study topics instead.`;

export async function POST(req: NextRequest) {
    try {
        const { message, history = [], attachments = [], systemPrompt, isAddingEvent } = await req.json();

        if (!message?.trim() && (!attachments || attachments.length === 0)) {
            return NextResponse.json({ reply: 'Please send a message or an attachment.' }, { status: 400 });
        }

        let currentSystemPrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;
        
        if (isAddingEvent) {
            currentSystemPrompt += `\n\nCRITICAL INSTRUCTION: The user is trying to add an event based on this message. You must act as an event extractor. DO NOT reply with conversational text. You MUST reply ONLY with a valid JSON object matching this exact structure: {"eventDetails": {"title": "string", "time": "HH:MM", "date": "YYYY-MM-DD"}, "reply": "A short, friendly confirmation message saying the event was scheduled."}. If you cannot deduce a time or date, use a logical default (e.g., today's date, or 12:00 PM).`;
        }

        const messages = [];
        messages.push({ role: "system", content: currentSystemPrompt });

        // Map history to standard payload
        for (const msg of history) {
            messages.push({
                role: msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user',
                content: msg.content
            });
        }

        // Construct current user message content
        let currentContent: any = message || "Analyze the attached file.";
        
        let hasImages = false;
        if (attachments && attachments.length > 0) {
            const parts: any[] = [];
            if (message?.trim()) {
                parts.push({ type: "text", text: message });
            } else {
                parts.push({ type: "text", text: "Analyze the attached file." });
            }

            for (const attr of attachments) {
                if (attr.type?.startsWith('image/')) {
                    hasImages = true;
                    // Format for base64 image_url assuming it's standard OpenAI format payload
                    parts.push({
                        type: "image_url",
                        image_url: { url: attr.base64 }
                    });
                } else if (attr.type === 'application/pdf' && attr.text) {
                    parts.push({
                        type: "text",
                        text: `\n\n[PDF Snippet]:\n${attr.text}`
                    });
                }
            }
            
            // Note: If GLM-5.1 fails with image arrays, it might ignore or error out. 
            // We pass the array structure only if there are images.
            currentContent = hasImages ? parts : parts.map(p => p.text).join("");
        }

        messages.push({ role: "user", content: currentContent });

        // Use the requested API
        const response = await fetch("https://api.us-west-2.modal.direct/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer modalresearch_gc3ZzKac6rUxekZyMs4JvzZDBsH85WVNn2lnUywaRYU"
            },
            body: JSON.stringify({
                model: "zai-org/GLM-5.1-FP8",
                messages,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error("Upstream API Error:", response.status, errBody);
            throw new Error(`Upstream API failed: ${response.status}`);
        }

        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content || "";

        // If in event mode, attempt to parse the JSON response
        if (isAddingEvent) {
            try {
                // Strip out markdown code blocks if the model wrapped the JSON
                const cleanJsonStr = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
                const jsonResponse = JSON.parse(cleanJsonStr);
                
                return NextResponse.json({ 
                    reply: jsonResponse.reply || "Event scheduled successfully!",
                    eventDetails: jsonResponse.eventDetails
                });
            } catch (e) {
                console.error("Failed to parse event JSON from AI:", e);
                // Fallback if parsing fails
                return NextResponse.json({ reply: replyText });
            }
        }

        return NextResponse.json({ reply: replyText });

    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json({ reply: 'I had trouble connecting to my brain! Please try again in a moment.' }, { status: 200 });
    }
}
