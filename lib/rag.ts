import { extractText } from './file-parser'
import { generateEmbedding } from './gemini'
import { createServiceClient } from './supabase/server'

function chunkText(text: string): string[] {
  const words = text.split(' ')
  const chunks: string[] = []
  for (let i = 0; i < words.length; i += 200) {
    const chunk = words.slice(i, i + 200).join(' ')
    chunks.push(chunk)
  }
  return chunks
}

export async function processFile(
  buffer: Buffer,
  fileType: string,
  botId: string,
  docId: string
): Promise<void> {
  const supabase = createServiceClient()
  const text = await extractText(buffer, fileType)
  const chunks = chunkText(text)

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk)
    await supabase.from('embeddings').insert({
      bot_id: botId,
      doc_id: docId,
      content: chunk,
      embedding: embedding
    })
  }
}

export async function searchSimilarChunks(
  question: string,
  botId: string
): Promise<string[]> {
  const supabase = createServiceClient()
  const questionEmbedding = await generateEmbedding(question)

  const { data } = await supabase.rpc('match_embeddings', {
    query_embedding: questionEmbedding,
    match_bot_id: botId,
    match_count: 10
  })

  if (!data || data.length === 0) return []

  return data.map((item: { content: string }) => item.content)
}