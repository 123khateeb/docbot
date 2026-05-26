import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: Request) {
  const { botId } = await request.json()
  const supabase = await createClient()  // await lagao

  await supabase.from('embeddings').delete().eq('bot_id', botId)  // bot_id
  await supabase.from('documents').delete().eq('bot_id', botId)   // bot_id
  await supabase.from('bots').delete().eq('id', botId)            // bots table, id column

  return NextResponse.json({ success: true })
}