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

export type AIProvider = string;

export interface AIProviderInfo {
    id: AIProvider;
    name: string;
    icon: string;
    color: string;
    desc: string;
    pro?: boolean;
    category?: 'Coding' | 'Fast' | 'Reasoning' | 'General' | 'Creative';
}

export const PROVIDERS: AIProviderInfo[] = [
    { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen Coder 32B', icon: '💻', color: '#0070f3', desc: 'Best for coding', category: 'Coding' },
    { id: 'google/gemini-2.5-flash:free', name: 'Gemini 2.5 Flash', icon: '⚡', color: '#10a37f', desc: 'Fast & capable', category: 'Fast' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', icon: '🌪️', color: '#f39c12', desc: 'Fast general assistant', category: 'Fast' },
    { id: 'nvidia/llama-3.1-nemotron-70b-instruct:free', name: 'Nvidia Nemotron 70B', icon: '🟢', color: '#76B900', desc: 'Great for general reasoning', category: 'Reasoning', pro: true },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B', icon: '💎', color: '#8e44ad', desc: 'Creative & balanced', category: 'Creative', pro: true },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', icon: '🐋', color: '#2b5bf4', desc: 'Advanced reasoning', category: 'Reasoning', pro: true },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', icon: '🦙', color: '#045ee6', desc: 'Powerful general assistant', category: 'General', pro: true },
    { id: 'modal_glm', name: 'Walia AI (GLM)', icon: '🧠', color: '#6C63FF', desc: 'GLM 5.1 FP8 via Modal', category: 'General', pro: true }
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

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "AIzaSyDcjYJTpqOQiHpI9SW995mPUkcSVbNhxGE";
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || "sk-eb738d76c19d4affa38e7a87513fe52b";

async function askGemini(userMessage: string, history: AIMessage[], systemPrompt: string): Promise<string> {
    const formattedHistory = history.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: m.parts
    }));

    const body = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [...formattedHistory, { role: 'user', parts: [{ text: userMessage }] }]
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errData = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${errData}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini API: no text in response');
    return text;
}

async function askDeepSeek(userMessage: string, history: AIMessage[], systemPrompt: string): Promise<string> {
    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.parts[0]?.text || '' })),
        { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({ model: 'deepseek-reasoner', messages, max_tokens: 2048 }),
    });

    if (!res.ok) {
        const errData = await res.text();
        throw new Error(`DeepSeek API error ${res.status}: ${errData}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('DeepSeek API: no text in response');
    return text;
}

export async function askAI(
    userMessage: string,
    history: AIMessage[] = [],
    preferredProvider: AIProvider = 'google/gemini-2.5-flash:free',
    systemPrompt: string = SYSTEM_PROMPT
): Promise<{ text: string; provider: AIProvider }> {
    try {
        let text = "";
        if (preferredProvider.includes('deepseek')) {
            text = await askDeepSeek(userMessage, history, systemPrompt);
        } else {
            text = await askGemini(userMessage, history, systemPrompt);
        }
        return { text, provider: preferredProvider };
    } catch (e: any) {
        if (e.message.includes('401') || e.message.includes('403') || e.message.includes('UNAUTHORIZED') || e.message.includes('PERMISSION_DENIED')) {
            console.warn(`❌ API Key Invalid or Leaked. Using Mock Response for testing.`);
            const mockResponse = `This is a mock response from Walia AI!\n\nYour API key was invalid or leaked (403/401). Please update your API key.\n\nMeanwhile, you can use the buttons below to **Copy** this text or **Share** it to your chats.`;
            await new Promise(r => setTimeout(r, 1500));
            return { text: mockResponse, provider: preferredProvider };
        }
        console.warn(`❌ Provider ${preferredProvider} failed:`, e.message);
        throw new Error(`AI Provider failed.\n\n${e.message}`);
    }
}

// Legacy compat
export { AIMessage as GeminiMessage };
export async function askGeminiLegacy(userMessage: string, history: AIMessage[]): Promise<string> {
    const { text } = await askAI(userMessage, history, 'auto');
    return text;
}
