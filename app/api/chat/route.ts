import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchSimilarChunks } from '@/lib/rag'
import { generateAnswer } from '@/lib/gemini'

export async function POST(request: Request) {
    const { botId, question } = await request.json();

    if (!botId || !question) {
        return NextResponse.json(
            { error: 'botId aur question required hain' },
            { status: 400 }
        )
    }

    const chunks = await searchSimilarChunks(question, botId)
    const context = chunks.join('\n\n')
    const answer = await generateAnswer(context, question)
    const supabase = await createClient()
    await supabase.from('conversations').insert({
        bot_id: botId,
        question,
        answer,
        session_id: 'test-session'
    })

    return NextResponse.json({ answer })

}