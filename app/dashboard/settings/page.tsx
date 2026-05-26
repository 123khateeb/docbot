"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, Loader2, ExternalLink, Key, Cpu } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Provider = {
  id: string;
  name: string;
  description: string;
  models: string[];
  free: boolean;
  docsUrl: string;
  keyPlaceholder: string;
  keyPrefix: string;
};

const providers: Provider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Fast, free tier available. Best for getting started.",
    models: ["gemini-2.5-flash", "gemini-1.5-pro"],
    free: true,
    docsUrl: "https://aistudio.google.com/app/apikey",
    keyPlaceholder: "AIza...",
    keyPrefix: "AIza",
  },
  {
    id: "groq",
    name: "Groq",
    description: "Ultra-fast inference. Generous free tier.",
    models: ["llama-3.3-70b", "mixtral-8x7b"],
    free: true,
    docsUrl: "https://console.groq.com/keys",
    keyPlaceholder: "gsk_...",
    keyPrefix: "gsk_",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o and GPT-3.5. Industry standard, paid.",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
    free: false,
    docsUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-...",
    keyPrefix: "sk-",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Claude 3.5 Sonnet. Best for complex reasoning.",
    models: ["claude-3-5-sonnet", "claude-3-haiku"],
    free: false,
    docsUrl: "https://console.anthropic.com/keys",
    keyPlaceholder: "sk-ant-...",
    keyPrefix: "sk-ant-",
  },
];

export default function SettingsPage() {
  const [botId, setBotId] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const currentProvider = providers.find(p => p.id === selectedProvider)!;

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);

      const { data: bot } = await supabase
        .from("bots")
        .select("id, ai_provider, ai_api_key")
        .eq("user_id", user!.id)
        .single();

      if (bot) {
        setBotId(bot.id);
        if (bot.ai_provider) setSelectedProvider(bot.ai_provider);
        if (bot.ai_api_key) setApiKey(bot.ai_api_key);
      }
    }
    fetchData();
  }, []);

  // Set default model when provider changes
  useEffect(() => {
    setSelectedModel(currentProvider.models[0]);
  }, [selectedProvider]);

  async function handleSave() {
    if (!botId || !apiKey.trim()) return;
    setSaving(true);

    const supabase = createClient();
    await supabase
      .from("bots")
      .update({
        ai_provider: selectedProvider,
        ai_api_key: apiKey.trim(),
      })
      .eq("id", botId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleRemoveKey() {
    if (!botId) return;
    const supabase = createClient();
    await supabase
      .from("bots")
      .update({ ai_provider: "gemini", ai_api_key: null })
      .eq("id", botId);
    setApiKey("");
    setSelectedProvider("gemini");
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your AI provider and manage your account.
        </p>
      </div>

      {/* Account Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-foreground">
                {userEmail?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{userEmail}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-xs text-muted-foreground">Free plan</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Provider Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">AI Provider</CardTitle>
          </div>
          <CardDescription>
            Choose which AI powers your chatbot. Use your own API key for unlimited usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Provider Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => setSelectedProvider(provider.id)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  selectedProvider === provider.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/20"
                }`}
              >
                {/* Selected check */}
                {selectedProvider === provider.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                <div className="space-y-2 pr-6">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{provider.name}</p>
                    {provider.free && (
                      <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium border border-green-500/20">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {provider.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {provider.models.slice(0, 2).map((model) => (
                      <span key={model} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* API Key Input */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">
                  {currentProvider.name} API Key
                </Label>
              </div>
              <a
                href={currentProvider.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Get API key
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={currentProvider.keyPlaceholder}
                className="pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey
                  ? <EyeOff className="h-4 w-4" />
                  : <Eye className="h-4 w-4" />
                }
              </button>
            </div>

            {/* Info box */}
            <div className="flex gap-2.5 p-3 rounded-lg bg-muted/40 border border-border">
              <span className="text-base">🔒</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your API key is stored securely and used only for your chatbot. 
                Without a key, DocBot's shared key is used with limited quota.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity hover:opacity-90"
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
              ) : saved ? (
                <><Check className="h-4 w-4" />Saved!</>
              ) : (
                "Save API Key"
              )}
            </button>

            {apiKey && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Remove key
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Provider Comparison</CardTitle>
          <CardDescription>Choose the right provider for your needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 pr-4 text-xs font-medium text-muted-foreground">Provider</th>
                  <th className="text-left py-2.5 pr-4 text-xs font-medium text-muted-foreground">Best for</th>
                  <th className="text-left py-2.5 pr-4 text-xs font-medium text-muted-foreground">Free tier</th>
                  <th className="text-left py-2.5 text-xs font-medium text-muted-foreground">Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Gemini", best: "Getting started", free: "250 req/day", speed: "Fast" },
                  { name: "Groq", best: "Speed", free: "Generous", speed: "⚡ Ultra fast" },
                  { name: "OpenAI", best: "Accuracy", free: "❌ Paid", speed: "Fast" },
                  { name: "Claude", best: "Reasoning", free: "❌ Paid", speed: "Fast" },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-xs">{row.name}</td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{row.best}</td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{row.free}</td>
                    <td className="py-2.5 text-xs text-muted-foreground">{row.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}