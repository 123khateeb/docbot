import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchSimilarChunks } from '@/lib/rag'
import { generateAnswer } from '@/lib/gemini'

export async function POST(request: Request) {
  const { botId, question } = await request.json()

  if (!botId || !question) {
    return NextResponse.json(
      { error: 'botId aur question required hain' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // Bot ka provider aur API key fetch karo
  const { data: bot } = await supabase
    .from('bots')
    .select('ai_provider, ai_api_key')
    .eq('id', botId)
    .single()

  // Agar bot ka apna key nahi hai to env se default use karo
  const apiKey = bot?.ai_api_key || process.env.GEMINI_API_KEY || process.env.DEFAULT_AI_API_KEY
  const provider = bot?.ai_provider || 'gemini'

  if (!apiKey) {
    return NextResponse.json({
      answer: 'This chatbot is not configured yet. Please ask the owner to set up their API key in Settings.'
    })
  }

  const chunks = await searchSimilarChunks(question, botId, apiKey)
  const context = chunks.join('\n\n')

  const answer = await generateAnswer(context, question, provider, apiKey)

  await supabase.from('conversations').insert({
    bot_id: botId,
    question,
    answer,
    session_id: 'widget-session'
  })

  return NextResponse.json({ answer })
}