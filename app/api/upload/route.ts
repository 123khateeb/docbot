import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processFile } from '@/lib/rag'

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const botId = formData.get('botId') as string

    if (!file || !botId) {
        return NextResponse.json(
            { error: 'File and botId are required' },
            { status: 400 }
        )
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase()

    if (!['pdf', 'docx', 'txt'].includes(fileExt!)) {
        return NextResponse.json(
            { error: 'Only PDF, DOCX, TXT are allowed' },
            { status: 400 }
        )
    }


    // File ko buffer mein convert karo
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Supabase client lo
    const supabase = await createClient()

    // Storage mein upload karo
    const filePath = `${botId}/${Date.now()}_${file.name}`
    const { data: storageData, error: storageError } = await supabase.storage
    .from('documents')
    .upload(filePath, buffer, {
        contentType: file.type
    })

    if (storageError) {
        return NextResponse.json(
            { error: 'File upload failed' },
            { status: 500 }
        )
    }

    const { data: doc, error: docError } = await supabase.from('documents')
    .insert({
        bot_id: botId,
        file_name: file.name,
        file_path: storageData.path,
        file_type: fileExt,
        status: 'processing'
    }).select().single()

    if (docError) {
  console.log('Doc error:', docError)  // ← yeh add karo
  return NextResponse.json(
    { error: 'Error during creation of document record' },
    { status: 500 }
  )
}

    // RAG pipeline run karo
await processFile(buffer, fileExt!, botId, doc.id)

// Status ready karo
await supabase
  .from('documents')
  .update({ status: 'ready' })
  .eq('id', doc.id)

// Success return karo
return NextResponse.json({ success: true, docId: doc.id })
}