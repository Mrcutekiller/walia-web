import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
//  AI JOB ASSIGNMENT
//  ┌─────────────────────────────┬───────────────────────────────────────────┐
//  │ Job                         │ Model                                     │
//  ├─────────────────────────────┼───────────────────────────────────────────┤
//  │ Chat / text replies         │ Modal GLM-5.1-FP8   (MODAL_API_KEY)      │
//  │ Image analysis (scanner)    │ Google Gemini Flash  (GEMINI_API_KEY)    │
//  └─────────────────────────────┴───────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

// ── Modal GLM-5.1 (text chat) ─────────────────────────────────────────────
const MODAL_API_URL = "https://api.us-west-2.modal.direct/v1/chat/completions";
const MODAL_API_KEY = process.env.MODAL_API_KEY!;
const MODAL_MODEL   = "zai-org/GLM-5.1-FP8";

// ── Google Gemini (image analysis) ───────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

// ─────────────────────────────────────────────────────────────────────────────
//  SYSTEM PROMPTS
// ─────────────────────────────────────────────────────────────────────────────

const BASE_SYSTEM_PROMPT = `You are Walia AI, a friendly and highly knowledgeable study assistant built for students worldwide.
Help with homework, explain concepts clearly, create flashcards, write essays, solve math and science problems, and anything academic.
Be concise, encouraging, and always respond in the same language the user writes in.
You are powered by GLM-5.1 — a state-of-the-art AI model. Never claim to be GPT, Claude, or Gemini.`;

const MODE_PROMPTS: Record<string, string> = {
    scanner:    "You are an expert OCR and document analysis AI. The user has uploaded an image. Extract ALL visible text, equations, diagrams descriptions, and data from the image accurately. Format clearly using markdown.",
    summarizer: "You are a document summarization expert. Create concise, structured summaries with key points, main arguments, and actionable insights. Use bullet points and headers.",
    quiz:       "You are a quiz generation expert. Create well-structured multiple choice, true/false, and short answer questions based on the provided content. Include answer keys.",
    flashcards: "You are a flashcard generation expert. Create spaced-repetition optimized Q&A flashcard pairs. Format as: **Q:** [question]\n**A:** [answer]",
    code:       "You are a senior software engineer and code reviewer. Analyze code for bugs, security issues, performance problems, and style improvements. Be specific and actionable.",
    translate:  "You are a professional academic translator. Translate accurately while preserving technical terminology and cultural nuances. State the detected source language.",
    grammar:    "You are a professional writing editor. Fix grammar, improve clarity, eliminate passive voice, and enhance academic tone. Show a corrected version with explanations.",
    cite:       "You are an academic citation expert. Generate properly formatted citations in APA, MLA, and Chicago styles based on the provided source information.",
    Study:      "You are a friendly study tutor. Break down complex subjects into digestible explanations. Use examples, analogies, and step-by-step reasoning.",
    Work:       "You are a productivity and workflow assistant. Help with professional tasks, planning, analysis, and communication.",
    Debate:     "You are a critical thinking and debate coach. Present balanced arguments, identify logical fallacies, and strengthen reasoning.",
    Fun:        "You are a witty and entertaining conversational AI. Keep things fun, engaging, and light-hearted while still being helpful.",
};

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER: Call Google Gemini for image analysis
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeWithGemini(imageBase64: string, mimeType: string, textPrompt: string): Promise<string> {
    const prompt = textPrompt?.trim() || "Analyze this image. Extract all visible text, equations, diagrams, and any other information. Format the output clearly using markdown.";

    const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: mimeType || "image/jpeg",
                            data: imageBase64.replace(/^data:[^;]+;base64,/, ""),
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2000,
            }
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Gemini Vision API Error:", response.status, err);
        throw new Error(`Gemini image analysis failed: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I could not analyze the image.";
}

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER: Call Modal GLM-5.1 for text chat
// ─────────────────────────────────────────────────────────────────────────────
async function chatWithGLM(messages: any[]): Promise<string> {
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
        throw new Error(`Modal GLM-5.1 failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN ROUTE HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        // Validate keys
        if (!MODAL_API_KEY) {
            console.error("MISSING: MODAL_API_KEY environment variable");
            return NextResponse.json({ reply: "Chat AI is not configured. Please contact support." }, { status: 500 });
        }

        const { message, history = [], attachments = [], systemPrompt, mode, isAddingEvent } = await req.json();

        if (!message?.trim() && (!attachments || attachments.length === 0)) {
            return NextResponse.json({ reply: "Please send a message or attachment." }, { status: 400 });
        }

        // ── ROUTE: Image analysis → Gemini ──────────────────────────────────
        const imageAttachments = attachments?.filter((a: any) => a.type?.startsWith("image/")) ?? [];
        const isImageMode = imageAttachments.length > 0 || mode === "scanner";

        if (isImageMode && imageAttachments.length > 0) {
            if (!GEMINI_API_KEY) {
                console.error("MISSING: GEMINI_API_KEY environment variable");
                return NextResponse.json({ reply: "Image analysis AI is not configured. Please contact support." }, { status: 500 });
            }

            // Use the first image for analysis (Gemini handles one at a time cleanly)
            const img = imageAttachments[0];
            const imgBase64 = img.base64 || img.data || "";
            const imgMime   = img.type || "image/jpeg";

            const analysisPrompt = MODE_PROMPTS["scanner"];
            const userText = message?.trim()
                ? `${message}\n\n${analysisPrompt}`
                : analysisPrompt;

            const reply = await analyzeWithGemini(imgBase64, imgMime, userText);
            return NextResponse.json({ reply, model: "gemini-2.0-flash", job: "image_analysis" });
        }

        // ── ROUTE: Text chat / all other tools → Modal GLM-5.1 ──────────────

        // Build system prompt: priority = explicit mode → caller-provided → default
        const detectedMode = mode || "Study";
        const modeSystemPrompt = MODE_PROMPTS[detectedMode] || BASE_SYSTEM_PROMPT;
        let finalSystemPrompt = systemPrompt || modeSystemPrompt;

        // Event extraction mode
        if (isAddingEvent) {
            finalSystemPrompt += `\n\nCRITICAL INSTRUCTION: Extract event details. Reply ONLY with valid JSON: {"eventDetails": {"title": "string", "time": "HH:MM", "date": "YYYY-MM-DD"}, "reply": "A short friendly confirmation."}. No other text outside the JSON.`;
        }

        // Assemble messages
        const glmMessages: any[] = [{ role: "system", content: finalSystemPrompt }];

        for (const msg of history) {
            glmMessages.push({
                role: msg.role === "assistant" || msg.role === "model" ? "assistant" : "user",
                content: msg.content,
            });
        }

        // Handle PDF attachments (extracted text gets appended)
        const pdfParts = attachments
            ?.filter((a: any) => a.type === "application/pdf" && a.text)
            .map((a: any) => `[PDF Content]:\n${a.text}`)
            .join("\n\n") ?? "";

        const userContent = [message?.trim(), pdfParts].filter(Boolean).join("\n\n")
            || "Please help me with this request.";

        glmMessages.push({ role: "user", content: userContent });

        const replyText = await chatWithGLM(glmMessages);

        // Event extraction: parse JSON response
        if (isAddingEvent) {
            try {
                const cleanJson = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(cleanJson);
                return NextResponse.json({
                    reply: parsed.reply || "Event scheduled successfully!",
                    eventDetails: parsed.eventDetails,
                    model: "glm-5.1",
                    job: "event_extraction",
                });
            } catch {
                console.error("Failed to parse event JSON from GLM response.");
                return NextResponse.json({ reply: replyText, model: "glm-5.1" });
            }
        }

        return NextResponse.json({ reply: replyText, model: "glm-5.1", job: "text_chat" });

    } catch (error: any) {
        console.error("Chat API Error:", error.message);
        return NextResponse.json(
            { reply: "I'm having trouble connecting right now. Please try again in a moment." },
            { status: 200 }
        );
    }
}
