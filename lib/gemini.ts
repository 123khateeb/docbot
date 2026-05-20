import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function generateEmbedding(text: string): Promise<number[]> {
    const result = await genAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
    })
    return result.embeddings![0].values!
}

export async function generateAnswer(context: string, question: string): Promise<string> {
    const prompt = `
        You are a helpful assistant.
        Answer the question based on the context provided below.
        If the answer is not directly in the context, provide the best possible answer based on the context.
        Only say "I don't have information about this" if the context is completely irrelevant.
        Always respond in the same language as the question.

        Context:
        ${context}

        Question: ${question}
        `

    const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    })
    return result.text!
}