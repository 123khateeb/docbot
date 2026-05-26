"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, MessageSquare, Bot, TrendingUp } from "lucide-react";

type Stats = {
  totalFiles: number;
  totalConversations: number;
  botStatus: boolean;
};

type Conversation = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalFiles: 0,
    totalConversations: 0,
    botStatus: true,
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Bot dhundo
      const { data: bot } = await supabase
        .from("bots")
        .select("id, is_active")
        .eq("user_id", user.id)
        .single();

      if (!bot) { setLoading(false); return; }

      // Files count
      const { count: filesCount } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("bot_id", bot.id);

      // Conversations count
      const { count: convoCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("bot_id", bot.id);

      // Recent conversations
      const { data: recentConvos } = await supabase
        .from("conversations")
        .select("id, question, answer, created_at")
        .eq("bot_id", bot.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalFiles: filesCount || 0,
        totalConversations: convoCount || 0,
        botStatus: bot.is_active,
      });
      setConversations(recentConvos || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const statCards = [
    {
      title: "Total Files",
      value: stats.totalFiles,
      icon: FileText,
      description: "Uploaded documents",
    },
    {
      title: "Conversations",
      value: stats.totalConversations,
      icon: MessageSquare,
      description: "Total questions answered",
    },
    {
      title: "Bot Status",
      value: stats.botStatus ? "Active" : "Inactive",
      icon: Bot,
      description: stats.botStatus ? "Responding to visitors" : "Not responding",
      highlight: stats.botStatus,
    },
    {
      title: "Avg. Daily",
      value: stats.totalConversations > 0
        ? Math.max(1, Math.round(stats.totalConversations / 7))
        : 0,
      icon: TrendingUp,
      description: "Questions per day",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-7 w-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back — here's what's happening with your chatbot.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="p-5 rounded-xl border border-border bg-background space-y-3 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.title}
              </p>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold tracking-tight ${
                'highlight' in card && card.highlight ? 'text-green-600' : ''
              }`}>
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Conversations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Conversations</h2>
          <a href="/dashboard/analytics" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </a>
        </div>

        {conversations.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-10 text-center space-y-2">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground">
              Add the embed code to your website to start getting questions.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className="p-4 rounded-xl border border-border bg-background hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{convo.question}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {convo.answer}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {timeAgo(convo.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}