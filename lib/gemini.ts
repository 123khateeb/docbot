import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Embedding ke liye alag model hota hai
const embeddingModel = genAI.getGenerativeModel({ 
  model: "gemini-embedding-001"  // ← yeh
})

// Answer ke liye alag model
const chatModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export async function generateEmbedding(text: string): Promise<number[]> {
    const result = await embeddingModel.embedContent(text)
    return result.embedding.values
}

export async function generateAnswer(context: string, question: string): Promise<string> {
    const prompt = `
        Tu ek helpful assistant hai.
        Sirf neeche diye gaye context se jawab de.
        Agar context mein jawab nahi hai to bol: "Mujhe is baare mein information nahi hai."

        Context:
        ${context}

        Sawaal: ${question}
        `


    const result = await chatModel.generateContent(prompt)
    return result.response.text()
}