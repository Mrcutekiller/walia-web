/**
 * Walia AI — Multi-provider service
 * Providers in order: Gemini → ChatGPT → DeepSeek
 * Automatically falls back to the next provider on any failure.
 */

// ─── API keys ─────────────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || '';

// ─── System prompt ────────────────────────────────────────────────────────────
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

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AIMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export type AIProvider = 'gemini' | 'chatgpt' | 'deepseek' | 'auto';

export interface AIProviderInfo {
    id: AIProvider;
    name: string;
    icon: string;
    color: string;
    desc: string;
    pro?: boolean;
}

export const PROVIDERS: AIProviderInfo[] = [
    { id: 'auto', name: 'Auto', icon: '⚡', color: '#6C63FF', desc: 'Best available provider' },
    { id: 'gemini', name: 'Gemini', icon: '✨', color: '#4285F4', desc: 'Google Gemini 1.5 Flash' },
    { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', color: '#10A37F', desc: 'OpenAI GPT-4o Mini', pro: true },
    { id: 'deepseek', name: 'DeepSeek', icon: '🌊', color: '#2196F3', desc: 'DeepSeek Chat', pro: true },
];

export const AI_PROVIDERS = PROVIDERS; // legacy alias

// ─── Gemini ───────────────────────────────────────────────────────────────────
async function askGemini(userMessage: string, history: AIMessage[]): Promise<string> {
    const MODELS = [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    const contents: any[] = [];
    if (history.length > 0) {
        contents.push(
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: "Understood." }] },
            ...history.map(m => ({ role: m.role, parts: m.parts }))
        );
    } else {
        contents.push({ role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userMessage }] });
    }
    if (history.length > 0) {
        contents.push({ role: 'user', parts: [{ text: userMessage }] });
    }

    const body = JSON.stringify({ contents });

    for (const model of MODELS) {
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
                { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
            );
            if (!res.ok) { const t = await res.text(); console.warn(`Gemini ${model} failed ${res.status}:`, t); continue; }
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
        } catch (e: any) { console.warn(`Gemini ${model} error:`, e.message); }
    }
    throw new Error('Gemini: all models failed');
}

// ─── ChatGPT ──────────────────────────────────────────────────────────────────
async function askChatGPT(userMessage: string, history: AIMessage[]): Promise<string> {
    // Convert from Gemini format to OpenAI format
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.parts[0]?.text || '' })),
        { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages, temperature: 0.7, max_completion_tokens: 1536 }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`ChatGPT API error ${res.status}: ${errData?.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('ChatGPT: no text in response');
    return text;
}

// ─── DeepSeek ─────────────────────────────────────────────────────────────────
async function askDeepSeek(userMessage: string, history: AIMessage[]): Promise<string> {
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.parts[0]?.text || '' })),
        { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({ model: 'deepseek-chat', messages, temperature: 0.7, max_tokens: 1536 }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`DeepSeek API error ${res.status}: ${errData?.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('DeepSeek: no text in response');
    return text;
}

// ─── Main entry: askAI (auto-fallback) ────────────────────────────────────────
export async function askAI(
    userMessage: string,
    history: AIMessage[] = [],
    preferredProvider: AIProvider = 'auto'
): Promise<{ text: string; provider: AIProvider }> {

    // Provider priority chain
    let chain: AIProvider[];
    if (preferredProvider === 'gemini') chain = ['gemini', 'deepseek', 'chatgpt'];
    else if (preferredProvider === 'chatgpt') chain = ['chatgpt', 'gemini', 'deepseek'];
    else if (preferredProvider === 'deepseek') chain = ['deepseek', 'gemini', 'chatgpt'];
    else chain = ['gemini', 'deepseek', 'chatgpt']; // auto

    const errors: string[] = [];

    for (const provider of chain) {
        try {
            let text: string;
            if (provider === 'gemini') text = await askGemini(userMessage, history);
            else if (provider === 'chatgpt') text = await askChatGPT(userMessage, history);
            else text = await askDeepSeek(userMessage, history);

            console.log(`✅ Responded via ${provider}`);
            return { text, provider };
        } catch (e: any) {
            console.warn(`❌ ${provider} failed:`, e.message);
            // Add user friendly hints for common errors
            let reason = e.message;
            if (reason.includes('429') && provider === 'chatgpt') reason += ' (Quota Exceeded)';
            if (reason.includes('402') && provider === 'deepseek') reason += ' (Insufficient Balance)';
            if (reason.includes('404') && provider === 'gemini') reason += ' (Model Not Found for this API Key)';

            errors.push(`${provider.toUpperCase()}: ${reason}`);
        }
    }

    throw new Error(`All AI providers failed.\n\n${errors.join('\n\n')}`);
}

// Legacy compat
export { AIMessage as GeminiMessage };
export async function askGeminiLegacy(userMessage: string, history: AIMessage[]): Promise<string> {
    const { text } = await askAI(userMessage, history, 'auto');
    return text;
}
