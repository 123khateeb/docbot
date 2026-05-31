import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Delete user's bots (documents & embeddings will cascade if FK set)
    await supabase.from('bots').delete().eq('user_id', user.id)

    // Delete the user from auth
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete account error:', err)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}