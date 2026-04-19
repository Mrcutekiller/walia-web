/**
 * Walia AI — Modal GLM-5.1-FP8 Endpoint Integration
 * Replaces existing providers for the time being as requested by user.
 */

const MODAL_API_KEY = "modalresearch_gc3ZzKac6rUxekZyMs4JvzZDBsH85WVNn2lnUywaRYU";

const SYSTEM_PROMPT = `You are Walia AI, an intelligent and friendly AI study companion built into the Walia app for Ethiopian students.
You help students with:
- Explaining complex academic topics clearly and simply
- Solving math, science, and coding problems step by step
- Summarizing study materials and lecture notes
- Creating quizzes, flashcards, and study plans
- Writing assistance, grammar, and essay review
- Career and study advice

Guidelines:
- Be warm, encouraging, and motivating
- Use simple language – avoid jargon unless necessary
- Format longer answers with bullet points or numbered steps
- Keep responses focused and useful
- Respond in the same language the student uses`;

export interface AIMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export type AIProvider = 'modal_glm';

export interface AIProviderInfo {
    id: AIProvider;
    name: string;
    icon: string;
    color: string;
    desc: string;
    pro?: boolean;
}

export const PROVIDERS: AIProviderInfo[] = [
    { id: 'modal_glm', name: 'Walia AI', icon: '⚡', color: '#6C63FF', desc: 'GLM 5.1 FP8 via Modal' }
];

export const AI_PROVIDERS = PROVIDERS;

async function askModalGLM(userMessage: string, history: AIMessage[], systemPrompt: string = SYSTEM_PROMPT): Promise<string> {
    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.parts[0]?.text || '' })),
        { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.us-west-2.modal.direct/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MODAL_API_KEY}` },
        body: JSON.stringify({ model: 'zai-org/GLM-5.1-FP8', messages, max_tokens: 1536 }),
    });

    if (!res.ok) {
        const errData = await res.text();
        throw new Error(`Modal GLM API error ${res.status}: ${errData}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Modal API: no text in response');
    return text;
}

export async function askAI(
    userMessage: string,
    history: AIMessage[] = [],
    preferredProvider: any = 'auto',
    systemPrompt: string = SYSTEM_PROMPT
): Promise<{ text: string; provider: AIProvider }> {
    try {
        const text = await askModalGLM(userMessage, history, systemPrompt);
        console.log(`✅ Responded via Modal GLM`);
        return { text, provider: 'modal_glm' };
    } catch (e: any) {
        console.warn(`❌ Modal GLM failed:`, e.message);
        throw new Error(`AI Provider failed.\n\nModal: ${e.message}`);
    }
}

// Legacy compat
export { AIMessage as GeminiMessage };
export async function askGeminiLegacy(userMessage: string, history: AIMessage[]): Promise<string> {
    const { text } = await askAI(userMessage, history, 'auto');
    return text;
}
