"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function FilesPage() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [botId, setBotId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  type DocFile = {
    id: string;
    file_name: string;
    file_type: string;
    status: string;
    created_at: string;
  };

  async function fetchOrCreateBot() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Bot dhundo
    const { data: bot } = await supabase
      .from("bots")
      .select("id")
      .eq("user_id", user!.id)
      .single();

    if (bot) {
      setBotId(bot.id);
      return bot.id;
    }

    // Bot nahi hai — banao
    const { data: newBot } = await supabase
      .from("bots")
      .insert({ user_id: user!.id, name: "My Bot" })
      .select()
      .single();

    setBotId(newBot!.id);
    return newBot!.id;
  }

  async function fetchFiles(currentBotId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("bot_id", currentBotId)
      .order("created_at", { ascending: false });

    setFiles(data || []);
  }

  async function handleDelete(fileId: string) {
    const supabase = createClient();
    await supabase.from("documents").delete().eq("id", fileId);
    await supabase.from("embeddings").delete().eq("doc_id", fileId);
    await fetchFiles(botId);
  }

  useEffect(() => {
    async function init() {
      const id = await fetchOrCreateBot();
      await fetchFiles(id);
    }
    init();
  }, []);

  async function handleUpload() {
    if (!selectedFile || !botId) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("botId", botId);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    setSelectedFile(null);
    await fetchFiles(botId); // list refresh karo
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Files</h1>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          PDF, DOCX, TXT supported
        </p>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button variant="outline" asChild>
            <span>Choose File</span>
          </Button>
        </label>
        {selectedFile && (
          <p className="text-sm font-medium">{selectedFile.name}</p>
        )}
        <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center">
          Koi file nahi hai abhi
        </p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{file.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.file_type.toUpperCase()} • {file.status}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
