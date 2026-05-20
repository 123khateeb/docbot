import { extractText } from './file-parser'
import { generateEmbedding } from './gemini'
import { createClient } from './supabase/server'

function chunkText(text: string): string[] {
  const words = text.split(' ')
  const chunks:string [] = []

  for (let i = 0; i < words.length; i += 200) {
    const chunk = words.slice(i, i + 200).join(' ')
    chunks.push(chunk)
  }

  return chunks
}


export async function processFile (buffer: Buffer, fileType: string, botId: string, docId: string): Promise<void>{
    const supabase = await createClient()
    const text = await extractText(buffer,fileType);
    const chunk_text = chunkText(text);

    for (const chunk of chunk_text) {
        const embedding_result = await generateEmbedding(chunk)
        const { error } = await supabase.from('embeddings').insert({
            bot_id: botId,
            doc_id: docId,
            content: chunk,
            embedding: embedding_result
        })
        if (error) console.log('Embedding insert error:', error)
    }
}

export async function searchSimilarChunks (question: string, botId: string):Promise<string[]>{
    const supabase = await createClient()
    const questionEmbedding = await generateEmbedding(question);
    const { data } = await supabase.rpc('match_embeddings', {
        query_embedding: questionEmbedding,
        match_bot_id: botId,
        match_count: 10
    })

    return data.map((item: { content: string }) => item.content)
    
}