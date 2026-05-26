"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Copy, Check, Code2, Bot, Zap, Globe, Send, X, Upload, Palette, MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BotSettings = {
  id: string;
  bot_name: string;
  welcome_message: string;
  primary_color: string;
  fallback_message: string;
  logo_url: string | null;
};

// ── Live Preview ──
function ChatbotPreview({ settings }: { settings: BotSettings }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: settings.welcome_message || "Hello! How can I help you today? 👋" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setMessages([{ role: "bot", text: settings.welcome_message || "Hello! How can I help you today? 👋" }]);
  }, [settings.welcome_message]);

  function handleSend() {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { role: "user", text: input.trim() },
      { role: "bot", text: "This is a preview. Real responses come from your uploaded documents." },
    ]);
    setInput("");
  }

  const color = settings.primary_color || "#000000";
  const name = settings.bot_name || "DocBot";

  return (
    <div className="relative w-full h-[480px] bg-white rounded-2xl border border-border overflow-hidden flex items-end justify-end p-4 shadow-sm">

      {/* Fake website */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gray-900" />
            <div className="h-2.5 w-16 bg-gray-900 rounded" />
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="h-2 w-10 bg-gray-200 rounded" />
            <div className="h-2 w-10 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-900 rounded-full" />
          </div>
        </div>
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="h-3 w-2/5 bg-gray-800 rounded mb-2" />
          <div className="h-2 w-3/5 bg-gray-200 rounded mb-1.5" />
          <div className="h-2 w-1/2 bg-gray-200 rounded mb-3" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-900 rounded-full" />
            <div className="h-6 w-20 bg-gray-100 border border-gray-200 rounded-full" />
          </div>
        </div>
        <div className="px-5 pt-3 grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-1.5">
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-2 w-full bg-gray-200 rounded" />
              <div className="h-2 w-4/5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-20 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ background: `${color}10`, borderColor: `${color}30` }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
          <span className="text-[9px] font-medium" style={{ color }}>{name} active</span>
        </div>
      </div>

      {/* Chat Window */}
      {open && (
        <div className="relative w-64 h-72 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-10 mb-16">
          <div className="px-3 py-2.5 flex items-center gap-2" style={{ background: color }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden p-0.5" style={{ background: 'rgba(255,255,255,0.2)' }}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[10px] font-bold text-white">{name[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white text-[11px] font-semibold">{name}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <p className="text-white/60 text-[9px]">Online</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2 bg-white">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-1.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-4 h-4 p-0.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden" style={{ background: color }}>
                    {settings.logo_url
                      ? <img src={settings.logo_url} alt="logo" className="w-full h-full object-contain" />
                      : <span className="text-[8px] font-bold text-white">{name[0]}</span>
                    }
                  </div>
                )}
                <div className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed ${
                  msg.role === "user" ? "text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`} style={msg.role === "user" ? { background: color } : {}}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 p-2 flex gap-1.5 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 text-[10px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none transition-colors bg-gray-50"
              style={{ '--tw-ring-color': color } as React.CSSProperties}
            />
            <button type="button" onClick={handleSend} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: color }}>
              <Send className="h-2.5 w-2.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-10"
        style={{ background: color }}
      >
        {open
          ? <X className="h-4 w-4 text-white" />
          : <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        }
        {!open && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />}
      </button>
    </div>
  );
}

// ── Main Page ──
export default function ChatbotPage() {
  const [botId, setBotId] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<BotSettings>({
    id: "",
    bot_name: "DocBot",
    welcome_message: "Hello! How can I help you today? 👋",
    primary_color: "#000000",
    fallback_message: "Sorry, I couldn't find an answer. Please contact us for help.",
    logo_url: null,
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com";
  const embedCode = `<script src="${appUrl}/widget.js" data-bot-id="${botId}"></script>`;

  useEffect(() => {
    async function fetchBot() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: bot } = await supabase
        .from("bots")
        .select("id, bot_name, welcome_message, color, fallback_message, logo_url")
        .eq("user_id", user!.id)
        .single();

      if (bot) {
        setBotId(bot.id);
        setSettings({
          id: bot.id,
          bot_name: bot.bot_name || "DocBot",
          welcome_message: bot.welcome_message || "Hello! How can I help you today? 👋",
          primary_color: bot.color || "#000000",
          fallback_message: bot.fallback_message || "Sorry, I couldn't find an answer.",
          logo_url: bot.logo_url || null,
        });
      }
    }
    fetchBot();
  }, []);

  async function handleSaveSettings() {
    if (!botId) return;
    setSaving(true);

    const res = await fetch("/api/bot/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        botId,
        bot_name: settings.bot_name,
        welcome_message: settings.welcome_message,
        color: settings.primary_color,
        fallback_message: settings.fallback_message,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleLogoUpload(file: File) {
    if (!botId) return;
    setUploading(true);

    // Step 1: Upload file to Supabase Storage (this is fine client-side)
    const supabase = createClient();
    const path = `logos/${botId}_${Date.now()}.${file.name.split('.').pop()}`;
    const { data } = await supabase.storage.from('documents').upload(path, file, { upsert: true });

    if (data) {
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(data.path);
      const publicUrl = urlData.publicUrl;

      // Step 2: Save logo_url via server route (bypasses CORS)
      await fetch('/api/bot/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId, logo_url: publicUrl }),
      });

      setSettings(prev => ({ ...prev, logo_url: publicUrl }));
    }

    setUploading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const steps = [
    { title: "Copy the embed code", description: "Click the copy button to copy your unique script tag." },
    { title: "Paste in your website", description: "Add it before the closing </body> tag in your HTML." },
    { title: "Chatbot goes live", description: "The chat bubble appears on your website instantly." },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Chatbot</h1>
        <p className="text-sm text-muted-foreground">Customize your chatbot and embed it on any website.</p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Chatbot Active</p>
          <p className="text-xs text-muted-foreground">Ready to answer questions from your documents.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-600">Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left column */}
        <div className="space-y-6">

          {/* Widget Customization */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Widget Customization</CardTitle>
              </div>
              <CardDescription>Personalize how your chatbot looks and behaves.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Bot Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Bot Name</Label>
                <Input
                  value={settings.bot_name}
                  onChange={(e) => setSettings(prev => ({ ...prev, bot_name: e.target.value }))}
                  placeholder="DocBot"
                  className="h-9 text-sm"
                />
              </div>

              {/* Primary Color */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Primary Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="w-10 h-9 rounded-lg border border-border cursor-pointer p-0.5"
                    />
                  </div>
                  <Input
                    value={settings.primary_color}
                    onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                    placeholder="#000000"
                    className="h-9 text-sm font-mono flex-1"
                  />
                  {/* Color presets */}
                  <div className="flex gap-1.5">
                    {["#000000", "#2563eb", "#16a34a", "#dc2626", "#7c3aed"].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, primary_color: color }))}
                        className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          background: color,
                          borderColor: settings.primary_color === color ? color : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Bot Logo / Avatar</Label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 p-0.5 rounded-full border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: settings.primary_color }}>
                    {settings.logo_url
                      ? <img src={settings.logo_url} alt="logo" className="w-full h-full object-contain" />
                      : <span className="text-sm font-bold text-white">{settings.bot_name?.[0] || 'D'}</span>
                    }
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }}
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Uploading..." : "Upload Logo"}
                  </button>
                  {settings.logo_url && (
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, logo_url: null }))}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Welcome Message
                </Label>
                <Input
                  value={settings.welcome_message}
                  onChange={(e) => setSettings(prev => ({ ...prev, welcome_message: e.target.value }))}
                  placeholder="Hello! How can I help you today? 👋"
                  className="h-9 text-sm"
                />
              </div>

              {/* Fallback Message */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Fallback Message
                </Label>
                <p className="text-xs text-muted-foreground">Shown when no answer is found in your documents.</p>
                <Input
                  value={settings.fallback_message}
                  onChange={(e) => setSettings(prev => ({ ...prev, fallback_message: e.target.value }))}
                  placeholder="Sorry, I couldn't find an answer. Please call us at +91 XXXXXX"
                  className="h-9 text-sm"
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-40 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              >
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                ) : saved ? (
                  <><Check className="h-4 w-4" />Saved!</>
                ) : (
                  "Save Changes"
                )}
              </button>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Embed Code</CardTitle>
              </div>
              <CardDescription>
                Paste before <code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">&lt;/body&gt;</code> on your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <div className="bg-muted/50 border border-border rounded-xl p-4 pr-10">
                  {botId ? (
                    <code className="text-xs font-mono text-foreground break-all leading-relaxed">{embedCode}</code>
                  ) : (
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!botId}
                  className="absolute right-3 top-3 w-7 h-7 flex items-center justify-center rounded-lg bg-background border border-border hover:bg-muted transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!botId}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors"
              >
                {copied ? <><Check className="h-4 w-4 text-green-600" /><span className="text-green-600">Copied!</span></> : <><Copy className="h-4 w-4" />Copy Embed Code</>}
              </button>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">How to install</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                      </div>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-2 min-h-[20px]" />}
                    </div>
                    <div className="pb-4 space-y-0.5">
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — Live Preview */}
        <div className="space-y-3">
          <div>
            <p className="text-base font-semibold">Live Preview</p>
            <p className="text-xs text-muted-foreground mt-0.5">Updates in real-time as you customize.</p>
          </div>
          <ChatbotPreview settings={settings} />
          <p className="text-xs text-muted-foreground text-center">
            Click the bubble to open/close • Try typing a message
          </p>
        </div>
      </div>
    </div>
  );
}