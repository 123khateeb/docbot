'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Send, Upload, FileText, X, Sparkles, RefreshCw, Bot } from 'lucide-react'

type Message = {
  role: 'user' | 'bot'
  text: string
  typing?: boolean
}

function renderText(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      return <li key={i} className="ml-4 list-disc">{renderInline(line.trim().slice(2))}</li>
    }
    if (line.trim() === '') return <br key={i} />
    return <p key={i} className="leading-relaxed">{renderInline(line)}</p>
  })
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

function TypingMessage({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const wordsRef = useRef(text.split(' '))

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < wordsRef.current.length) {
        setDisplayed(wordsRef.current.slice(0, indexRef.current + 1).join(' '))
        indexRef.current++
      } else {
        clearInterval(interval)
        setDone(true)
        onDone()
      }
    }, 60)
    return () => clearInterval(interval)
  }, [text, onDone])

  return (
    <div className="text-sm space-y-1">
      {done ? renderText(text) : (
        <>
          {renderText(displayed)}
          <span className="inline-block w-0.5 h-4 bg-primary/60 ml-0.5 animate-pulse align-middle" />
        </>
      )}
    </div>
  )
}

export default function DemoSection() {
  const [step, setStep] = useState<'upload' | 'chat'>('upload')
  const [botId, setBotId] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([])
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hello! Upload a file from the left panel and I'll answer any questions about it." }
  ])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleCleanup = () => {
      if (botId) navigator.sendBeacon('/api/guest/cleanup', JSON.stringify({ botId }))
    }
    window.addEventListener('beforeunload', handleCleanup)
    return () => window.removeEventListener('beforeunload', handleCleanup)
  }, [botId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  function handleFileChange(file: File | null) {
    if (!file) return
    setSelectedFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      const dt = new DataTransfer()
      dt.items.add(file)
      if (fileInputRef.current) fileInputRef.current.files = dt.files
    }
  }

  async function handleGuestUpload() {
    const file = selectedFile || fileInputRef.current?.files?.[0]
    if (!file) return
    setUploading(true)

    const res = await fetch('/api/guest/create', { method: 'POST' })
    const { botId: newBotId } = await res.json()
    setBotId(newBotId)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('botId', newBotId)
    await fetch('/api/upload', { method: 'POST', body: formData })

    setUploadedFiles([{ name: file.name, size: file.size }])
    setUploading(false)
    setStep('chat')
    setMessages([{
      role: 'bot',
      text: `Hello! I've analyzed **${file.name}**. Ask me anything about it.`
    }])
  }

  async function handleChat() {
    if (!question.trim() || !botId || loading) return
    const userMsg = question.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setQuestion('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botId, question: userMsg })
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'bot', text: data.answer, typing: true }])
    setLoading(false)
  }

  function handleReset() {
    setStep('upload')
    setSelectedFile(null)
    setUploadedFiles([])
    setBotId('')
    setMessages([{ role: 'bot', text: "Hello! Upload a file from the left panel and I'll answer any questions about it." }])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="w-full mt-12 rounded-3xl border border-border bg-background shadow-2xl shadow-primary/5 overflow-hidden">

      {/* ── Top bar ── */}
      <div className="bg-muted/30 px-5 py-3.5 border-b border-border flex items-center gap-2.5">
        {/* Mac dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">DocBot Interactive Demo</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-green-600">Live</span>
        </div>
      </div>

      {/* ── Split layout ── */}
      <div className="flex flex-col md:flex-row" style={{ minHeight: '400px' }}>

        {/* ── LEFT: Upload Panel ── */}
        <div className="w-full md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-border p-5 flex flex-col gap-4 bg-muted/10">

          {/* Header */}
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                <Upload className="h-3 w-3 text-primary" />
              </div>
              Upload Files
            </h3>
            <p className="text-xs text-muted-foreground pl-7">Drop your knowledge base to train the bot.</p>
          </div>

          {/* Drop zone */}
          {step === 'upload' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`
                cursor-pointer rounded-2xl border-2 border-dashed p-6
                flex flex-col items-center justify-center gap-3 text-center
                transition-all duration-200 select-none
                ${dragOver
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : selectedFile
                  ? 'border-green-500/40 bg-green-500/5'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                selectedFile ? 'bg-green-500/10' : dragOver ? 'bg-primary/10' : 'bg-muted'
              }`}>
                {selectedFile
                  ? <FileText className="h-5 w-5 text-green-600" />
                  : <Upload className={`h-5 w-5 transition-colors ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                }
              </div>
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-green-600 truncate max-w-[160px]">{selectedFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors mx-auto"
                  >
                    <X className="h-3 w-3" /> Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">
                    {dragOver ? '📂 Drop it here!' : 'Click or drag & drop'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">PDF, DOCX, or TXT</p>
                </div>
              )}
            </div>
          )}

          {/* Uploaded files */}
          <div className="space-y-2">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-background rounded-xl px-3 py-2.5 border border-border shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-3.5 w-3.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-semibold text-green-600">Ready</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upload button */}
          {step === 'upload' && (
            <button
              type="button"
              onClick={handleGuestUpload}
              disabled={!selectedFile || uploading}
              className="mt-auto w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-sm shadow-primary/20"
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing your file...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Upload & Start Chatting
                </>
              )}
            </button>
          )}

          {/* Reset button */}
          {step === 'chat' && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-auto w-full py-3 bg-muted text-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-muted/80 border border-border"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Upload New File
            </button>
          )}

          {step === 'upload' && (
            <p className="text-center text-[10px] text-muted-foreground/60">
              🔒 File deleted automatically when you leave
            </p>
          )}
        </div>

        {/* ── RIGHT: Chat Panel ── */}
        <div className="flex-1 flex flex-col">

          {/* Chat header */}
          <div className="px-5 py-3 border-b border-border flex items-center gap-3 bg-muted/5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold">DocBot Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground">
                  {step === 'chat' ? 'Ready to answer' : 'Waiting for file...'}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: '340px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                    <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm border border-border/50'
                }`}>
                  {msg.role === 'bot' && msg.typing ? (
                    <TypingMessage
                      text={msg.text}
                      onDone={() =>
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, typing: false } : m))
                      }
                    />
                  ) : (
                    <div className="text-sm space-y-1">{renderText(msg.text)}</div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-violet-500 flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                    <span className="text-xs font-bold text-white">U</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="bg-muted px-4 py-3.5 rounded-2xl rounded-tl-sm border border-border/50 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 flex gap-2.5 bg-muted/5">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleChat()}
              placeholder={step === 'upload' ? '⬅ Upload a file first to start chatting...' : 'Ask something about your file...'}
              disabled={loading || step === 'upload'}
              className="flex-1 h-11 rounded-xl bg-background border-border/80 text-sm"
            />
            <button
              type="button"
              onClick={handleChat}
              disabled={loading || !question.trim() || step === 'upload'}
              className="w-11 h-11 bg-primary text-primary-foreground rounded-xl disabled:opacity-40 flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 shadow-sm shadow-primary/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom note ── */}
      <div className="border-t border-border px-5 py-3 bg-muted/10 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          No signup required · File deleted on exit
        </p>
        <a href="/signup" className="text-[11px] font-semibold text-primary hover:underline">
          Create your own chatbot →
        </a>
      </div>
    </div>
  )
}