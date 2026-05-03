import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
//  AI JOB ASSIGNMENT
//  ┌─────────────────────────────┬───────────────────────────────────────────┐
//  │ Job                         │ Model                                     │
//  ├─────────────────────────────┼───────────────────────────────────────────┤
//  │ Chat / text replies         │ OpenRouter API (user-selectable)         │
//  │ Image analysis (scanner)    │ Google Gemini Flash  (GEMINI_API_KEY)    │
//  └─────────────────────────────┴───────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

// ── OpenRouter API ──────────────────────────────────────────────────────────
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_ALLOWED_MODELS = [
    'gpt-4o-mini',
    'mistralai/mistral-7b-instruct',
    'google/gemma-7b-it:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'microsoft/wizardlm-2-8x22b:free',
    'anthropic/claude-3-haiku:free',
    'nvidia/llama-3.1-nemotron-70b-instruct:free',
    'qwen/qwen-2.5-7b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'google/gemma-2-9b-it:free',
];
const DEFAULT_OPENROUTER_MODEL = 'gpt-4o-mini';

// ── Google Gemini (image analysis) ───────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

// ─────────────────────────────────────────────────────────────────────────────
//  SYSTEM PROMPTS
// ─────────────────────────────────────────────────────────────────────────────

const BASE_SYSTEM_PROMPT = `You are Walia AI, a premium professional assistant. Provide clear, polished, and trustworthy guidance for business, productivity, learning, and planning tasks.
Maintain a confident yet friendly tone, avoid casual slang, and do not identify as GPT, Claude, Gemini, or any branded model.
Deliver concise, high-quality responses with useful next steps and a professional presentation.`;

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
//  HELPER: Call OpenRouter for text chat
// ─────────────────────────────────────────────────────────────────────────────
async function chatWithOpenRouter(messages: any[], model: string = DEFAULT_OPENROUTER_MODEL): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error("Missing OpenRouter API key.");
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://walia.app",
            "X-Title": "Walia AI Assistant"
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: 2000,
            temperature: 0.7,
        }),
    });

    const resultText = await response.text();
    if (!response.ok) {
        console.error("OpenRouter API Error:", response.status, resultText);
        throw new Error(`OpenRouter failed: ${response.status} - ${resultText}`);
    }

    const data = JSON.parse(resultText);
    return data.choices?.[0]?.message?.content || "";
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN ROUTE HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        // Validate keys
        if (!OPENROUTER_API_KEY) {
            console.error("MISSING: OPENROUTER_API_KEY environment variable");
            return NextResponse.json({ reply: "Chat AI is not configured. Please contact support.", error: "Missing OpenRouter API key." }, { status: 500 });
        }

        const { message, history = [], attachments = [], systemPrompt, mode, isAddingEvent, model } = await req.json();

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

        // ── ROUTE: Text chat / all other tools → OpenRouter ──────────────

        // Build system prompt: priority = explicit mode → caller-provided → default
        const detectedMode = mode || "Study";
        const modeSystemPrompt = MODE_PROMPTS[detectedMode] || BASE_SYSTEM_PROMPT;
        let finalSystemPrompt = systemPrompt || modeSystemPrompt;

        // Event extraction mode
        if (isAddingEvent) {
            finalSystemPrompt += `\n\nCRITICAL INSTRUCTION: Extract event details. Reply ONLY with valid JSON: {"eventDetails": {"title": "string", "time": "HH:MM", "date": "YYYY-MM-DD"}, "reply": "A short friendly confirmation."}. No other text outside the JSON.`;
        }

        // Assemble messages
        const openRouterMessages: any[] = [{ role: "system", content: finalSystemPrompt }];

        for (const msg of history) {
            openRouterMessages.push({
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

        openRouterMessages.push({ role: "user", content: userContent });

        // Validate selected model and use OpenRouter default if none selected
        const selectedModel = model || DEFAULT_OPENROUTER_MODEL;
        if (!OPENROUTER_ALLOWED_MODELS.includes(selectedModel)) {
            return NextResponse.json({ reply: "Selected model is unavailable. Please choose a supported OpenRouter model.", error: "Model not permitted." }, { status: 400 });
        }

        const replyText = await chatWithOpenRouter(openRouterMessages, selectedModel);

        // Event extraction: parse JSON response
        if (isAddingEvent) {
            try {
                const cleanJson = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(cleanJson);
                return NextResponse.json({
                    reply: parsed.reply || "Event scheduled successfully!",
                    eventDetails: parsed.eventDetails,
                    model: selectedModel,
                    job: "event_extraction",
                });
            } catch {
                console.error("Failed to parse event JSON from OpenRouter response.");
                return NextResponse.json({ reply: replyText, model: selectedModel });
            }
        }

        return NextResponse.json({ reply: replyText, model: selectedModel, job: "text_chat" });

    } catch (error: any) {
        console.error("Chat API Error:", error.message);
        return NextResponse.json(
            { reply: "I'm having trouble connecting right now. Please try again in a moment.", error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
