import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const botId = searchParams.get('botId')

  if (!botId) {
    return NextResponse.json({ error: 'botId required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: bot } = await supabase
    .from('bots')
    .select('bot_name, welcome_message, color, fallback_message, logo_url')
    .eq('id', botId)
    .single()

  if (!bot) {
    return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...bot,
    primary_color: bot.color, // widget expects primary_color key
  }, {
    headers: {
      'Cache-Control': 'no-store',
    }
  })
}