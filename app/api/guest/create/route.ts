import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()

  const { data: bot, error } = await supabase
    .from('bots')
    .insert({
      user_id: null,
      name: 'Guest Bot',
      is_active: true
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create guest bot' }, { status: 500 })
  }

  return NextResponse.json({ botId: bot.id })
}