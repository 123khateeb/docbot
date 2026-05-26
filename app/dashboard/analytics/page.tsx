"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, ThumbsUp, ThumbsDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Conversation = {
  id: string;
  question: string;
  answer: string;
  session_id: string;
  was_helpful: boolean | null;
  created_at: string;
};

export default function AnalyticsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filtered, setFiltered] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bot } = await supabase
        .from("bots")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!bot) { setLoading(false); return; }

      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("bot_id", bot.id)
        .order("created_at", { ascending: false });

      const convos = data || [];
      setConversations(convos);
      setFiltered(convos);

      // Stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - 7);

      setStats({
        total: convos.length,
        today: convos.filter(c => new Date(c.created_at) >= todayStart).length,
        thisWeek: convos.filter(c => new Date(c.created_at) >= weekStart).length,
      });

      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(conversations);
    } else {
      setFiltered(
        conversations.filter(c =>
          c.question.toLowerCase().includes(search.toLowerCase()) ||
          c.answer.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, conversations]);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
        </div>
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track every conversation your chatbot has with visitors.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, sub: "All time" },
          { label: "This Week", value: stats.thisWeek, sub: "Last 7 days" },
          { label: "Today", value: stats.today, sub: new Date().toLocaleDateString('en-US', { weekday: 'long' }) },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-xl border border-border bg-background space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold">All Conversations</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center space-y-2">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">
              {search ? "No results found" : "No conversations yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {search ? "Try a different search term" : "Conversations will appear here once visitors start chatting."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((convo) => (
              <div
                key={convo.id}
                className="border border-border rounded-xl bg-background overflow-hidden"
              >
                {/* Row */}
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === convo.id ? null : convo.id)}
                  className="w-full flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm font-medium truncate">{convo.question}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{convo.answer}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {convo.was_helpful === true && <ThumbsUp className="h-3.5 w-3.5 text-green-500" />}
                    {convo.was_helpful === false && <ThumbsDown className="h-3.5 w-3.5 text-red-400" />}
                    <span className="text-xs text-muted-foreground">{timeAgo(convo.created_at)}</span>
                  </div>
                </button>

                {/* Expanded */}
                {expanded === convo.id && (
                  <div className="border-t border-border bg-muted/20 p-4 space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Question</p>
                      <p className="text-sm">{convo.question}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Answer</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{convo.answer}</p>
                    </div>
                    <div className="flex items-center gap-4 pt-1">
                      <span className="text-xs text-muted-foreground">{formatDate(convo.created_at)}</span>
                      {convo.session_id && (
                        <span className="text-xs text-muted-foreground font-mono">
                          Session: {convo.session_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}