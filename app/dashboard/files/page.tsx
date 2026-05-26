"use client";

import { createClient } from "@/lib/supabase/client";
import { Trash2, FileText, FileType, Clock, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type DocFile = {
  id: string;
  file_name: string;
  file_type: string;
  status: string;
  created_at: string;
};

export default function FilesPage() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [botId, setBotId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      const id = await fetchOrCreateBot();
      await fetchFiles(id);
    }
    init();
  }, []);

  async function fetchOrCreateBot() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: bot } = await supabase
      .from("bots")
      .select("id")
      .eq("user_id", user!.id)
      .single();

    if (bot) { setBotId(bot.id); return bot.id; }

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

  function handleFileChange(file: File | null) {
    if (!file) return;
    setSelectedFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;
    }
  }

  async function handleUpload() {
    const file = selectedFile || fileInputRef.current?.files?.[0];
    if (!file || !botId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("botId", botId);

    await fetch("/api/upload", { method: "POST", body: formData });

    setUploading(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // ← yeh add karo
    await fetchFiles(botId);
  }

  async function handleDelete(fileId: string) {
    setDeletingId(fileId);
    const supabase = createClient();
    await supabase.from("embeddings").delete().eq("doc_id", fileId);
    await supabase.from("documents").delete().eq("id", fileId);
    await fetchFiles(botId);
    setDeletingId(null);
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function getFileIcon(type: string) {
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  }

  function getStatusBadge(status: string) {
    if (status === "ready") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
          <CheckCircle className="h-3 w-3" />
          Ready
        </span>
      );
    }
    if (status === "processing") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600">
          <Clock className="h-3 w-3 animate-spin" />
          Processing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
        <AlertCircle className="h-3 w-3" />
        Error
      </span>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Files</h1>
        <p className="text-sm text-muted-foreground">
          Upload documents to train your chatbot. Supports PDF, DOCX, and TXT.
        </p>
      </div>

      {/* Upload Area */}
      <div className="space-y-3">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-10
            flex flex-col items-center justify-center gap-4 text-center
            transition-all duration-200
            ${dragOver
              ? "border-primary bg-primary/5"
              : selectedFile
              ? "border-green-500/50 bg-green-500/5"
              : "border-border hover:border-primary/40 hover:bg-muted/20"
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

          {selectedFile ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-green-600">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(0)} KB — ready to upload
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Remove file
              </button>
            </>
          ) : (
            <>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-primary/10" : "bg-muted"}`}>
                <Upload className={`h-6 w-6 transition-colors ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {dragOver ? "Drop your file here" : "Click or drag & drop to upload"}
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT — max 10MB</p>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-40 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing file...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload File
            </>
          )}
        </button>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Uploaded Files
            {files.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-normal">
                {files.length}
              </span>
            )}
          </h2>
        </div>

        {files.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center space-y-2">
            <FileType className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">No files uploaded yet</p>
            <p className="text-xs text-muted-foreground">
              Upload a file above to start training your chatbot.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:bg-muted/20 transition-colors group"
              >
                {/* File icon */}
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  {getFileIcon(file.file_type)}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-medium truncate">{file.file_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase font-mono">
                      {file.file_type}
                    </span>
                    <span className="text-muted-foreground/40 text-xs">•</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeAgo(file.created_at)}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex-shrink-0">
                  {getStatusBadge(file.status)}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(file.id)}
                  disabled={deletingId === file.id}
                  className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all disabled:opacity-50"
                >
                  {deletingId === file.id ? (
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}