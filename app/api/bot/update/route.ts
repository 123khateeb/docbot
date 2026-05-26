import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { botId, bot_name, welcome_message, color, fallback_message, logo_url } = body

    if (!botId) {
      return NextResponse.json({ error: 'botId required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Only update fields that were sent
    const updateData: Record<string, string | null> = {}
    if (bot_name !== undefined) updateData.bot_name = bot_name
    if (welcome_message !== undefined) updateData.welcome_message = welcome_message
    if (color !== undefined) updateData.color = color
    if (fallback_message !== undefined) updateData.fallback_message = fallback_message
    if (logo_url !== undefined) updateData.logo_url = logo_url

    const { error } = await supabase
      .from('bots')
      .update(updateData)
      .eq('id', botId)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}