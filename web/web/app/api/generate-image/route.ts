import { NextRequest, NextResponse } from 'next/server';

// ─── Google Gemini Image Generation ─────────────────────────────────────────
// Uses Gemini 2.0 Flash (imagen) for image generation
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent`;

export async function POST(req: NextRequest) {
    try {
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
        }

        const { prompt, style = "photorealistic" } = await req.json();

        if (!prompt?.trim()) {
            return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
        }

        // Build an enhanced prompt with style
        const enhancedPrompt = `${prompt.trim()}. Style: ${style}. High quality, detailed, professional image.`;

        const response = await fetch(`${GEMINI_IMAGE_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: enhancedPrompt
                    }]
                }],
                generationConfig: {
                    responseModalities: ["TEXT", "IMAGE"],
                }
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Gemini Image API Error:", response.status, err);
            return NextResponse.json({ error: "Image generation failed. Please try again." }, { status: 500 });
        }

        const data = await response.json();

        // Extract the image data from the response
        const parts = data.candidates?.[0]?.content?.parts || [];
        let imageBase64 = '';
        let mimeType = 'image/png';
        let textResponse = '';

        for (const part of parts) {
            if (part.inlineData) {
                imageBase64 = part.inlineData.data;
                mimeType = part.inlineData.mimeType || 'image/png';
            }
            if (part.text) {
                textResponse = part.text;
            }
        }

        if (!imageBase64) {
            return NextResponse.json({ error: "No image was generated. Try a different prompt." }, { status: 500 });
        }

        return NextResponse.json({
            imageUrl: `data:${mimeType};base64,${imageBase64}`,
            mimeType,
            description: textResponse || `Generated: ${prompt}`,
        });

    } catch (error: any) {
        console.error("Image generation error:", error.message);
        return NextResponse.json({ error: "Image generation failed. Please try again." }, { status: 500 });
    }
}
