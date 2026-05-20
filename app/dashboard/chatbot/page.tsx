"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function ChatBoatPage() {
  const [botId, setBotId] = useState("");
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-bot-id="${botId}"></script>`;

  async function fetchBot() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: bot } = await supabase
      .from("bots")
      .select("id")
      .eq("user_id", user!.id)
      .single();

    if (bot) setBotId(bot.id);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    fetchBot();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Chatbot</h1>

      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>
            Copy this code and paste it before closing &lt;/body&gt; tag of your
            website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            {botId ? (
              <div className="bg-muted rounded-lg p-4 font-mono text-sm break-all">
                {embedCode}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Loading...</p>
            )}
          </div>
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" /> Copy Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
