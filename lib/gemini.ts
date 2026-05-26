import { GoogleGenAI } from '@google/genai'

// ── Embedding — always Gemini (sirf Gemini embedding support karta hai) ──
export async function generateEmbedding(text: string, apiKey?: string): Promise<number[]> {
  const key = apiKey || process.env.GEMINI_API_KEY!
  const genAI = new GoogleGenAI({ apiKey: key })

  const result = await genAI.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  })
  return result.embeddings![0].values!
}

// ── Answer — provider ke hisaab se ──
export async function generateAnswer(
  context: string,
  question: string,
  provider: string = 'gemini',
  apiKey?: string
): Promise<string> {

  const prompt = `You are a smart, friendly assistant embedded on a website. Your job is to help visitors by answering questions based strictly on the provided document context.

CORE RULES:
1. Answer ONLY from the provided context. Never use outside knowledge.
2. If the answer is not in the context, say: "I don't have information about this in the provided documents."
3. Be concise but complete.
4. Format answers clearly — use bullet points for lists, short paragraphs for explanations.

LANGUAGE & TONE RULES:
5. ALWAYS respond in the exact same language as the question.
6. Match the tone — casual question = casual answer, formal = formal.
7. Never start with "Based on the context..." — just answer directly.

CONTEXT:
${context}

QUESTION: ${question}

ANSWER:`

  if (provider === 'gemini') {
    const key = apiKey || process.env.GEMINI_API_KEY!
    const genAI = new GoogleGenAI({ apiKey: key })
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    return result.text!
  }

  if (provider === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    })
    const data = await res.json()
    return data.choices[0].message.content
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    })
    const data = await res.json()
    return data.choices[0].message.content
  }

  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await res.json()
    return data.content[0].text
  }

  throw new Error(`Unsupported provider: ${provider}`)
}