# Project Bible — DocBot

> **Yeh file Claude ko paste karo har naye session mein.**
> Claude turant poora context samajh jaayega.

---

## Project Overview

**Kya hai:** AI-powered chatbot SaaS platform.
- Tum apni website banate ho jahan clients sign up karte hain
- Client apni files (PDF, DOCX, TXT) upload karta hai dashboard pe
- Client ko ek `<script>` tag milta hai apni website mein lagane ke liye
- Visitor us website pe jaake chatbot se sawaal poochta hai
- Chatbot sirf uploaded files ke content se jawab deta hai — bahar se kuch nahi
- Client dashboard mein analytics bhi hoga (conversations, unanswered questions)

**Status:** 🔴 Setup phase — abhi shuru ho raha hai

---

## Tech Stack

| Part | Technology | Reason |
|------|-----------|--------|
| Framework | Next.js 14 (App Router) | Industry standard, Vercel pe best |
| Language | TypeScript | Type safety, Gulf jobs demand |
| Styling | Tailwind CSS | Fast, responsive |
| Components | shadcn/ui | Industry standard, clean UI |
| Database | Supabase (PostgreSQL) | Free, auth + DB + storage sab ek jagah |
| Vector DB | pgvector (Supabase extension) | Embeddings store karne ke liye |
| AI | Google Gemini 1.5 Flash | Free tier, production quality |
| Deployment | Vercel | Free, auto-deploy on push |
| Auth | Supabase Auth | Built-in, secure |
| File Storage | Supabase Storage | Free 1GB |

---

## Three User Types

1. **Super Admin (Tum)** — tumhari Next.js website manage karte ho
2. **Client** — sign up karta hai, dashboard milta hai, files upload karta hai, script tag leta hai
3. **Visitor** — client ki website pe jaata hai, chatbot se baat karta hai

---

## High Level Architecture

```
Visitor → Client Website (script tag) → API Routes → Supabase DB
                                                    → Gemini API
Client  → Dashboard → API Routes → Supabase DB
                                 → Supabase Storage (files)
                                 → Gemini (embeddings)
You     → Marketing Site → Supabase Auth
```

---

## RAG Pipeline (Core Logic)

### File Upload Flow:
```
Client uploads file
→ Supabase Storage mein save
→ Text extract (pdf-parse / mammoth)
→ 500 word chunks mein todo
→ Har chunk ka Gemini embedding banao
→ pgvector mein store karo (bot_id ke saath)
```

### Query Flow:
```
Visitor sawaal pooche
→ Sawaal ka Gemini embedding banao
→ pgvector mein cosine similarity search
→ Top 5 matching chunks nikalo
→ Chunks + sawaal Gemini ko do
→ Gemini jawab de (sirf us content se)
→ Visitor ko response bhejo
→ Conversation Supabase mein save
```

---

## Database Schema

### Table: users (Supabase Auth handles this)
```
id          uuid PK
email       text
created_at  timestamp
```

### Table: bots
```
id            uuid PK
user_id       uuid FK → users.id
name          text
welcome_msg   text
color         text (hex)
is_active     boolean
created_at    timestamp
```

### Table: documents
```
id          uuid PK
bot_id      uuid FK → bots.id
file_name   text
file_path   text (Supabase storage path)
file_type   text (pdf/docx/txt)
status      text (processing/ready/error)
created_at  timestamp
```

### Table: embeddings
```
id          uuid PK
bot_id      uuid FK → bots.id
doc_id      uuid FK → documents.id
content     text (chunk text)
embedding   vector(768) (pgvector)
created_at  timestamp
```

### Table: conversations
```
id          uuid PK
bot_id      uuid FK → bots.id
session_id  text
question    text
answer      text
was_helpful boolean (null by default)
created_at  timestamp
```

---

## Folder Structure

```
docbot/
├── app/
│   ├── (marketing)/          # Public pages
│   │   ├── page.tsx          # Home/landing page
│   │   ├── pricing/page.tsx  # Pricing page
│   │   └── layout.tsx
│   ├── (auth)/               # Login/signup
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── dashboard/            # Client dashboard (protected)
│   │   ├── page.tsx          # Overview
│   │   ├── files/page.tsx    # File management
│   │   ├── chatbot/page.tsx  # Bot settings + embed code
│   │   ├── analytics/page.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── chat/route.ts     # Visitor chatbot API
│       ├── upload/route.ts   # File upload + processing
│       ├── embed/route.ts    # Embedding generation
│       └── bot/route.ts      # Bot CRUD
├── components/
│   ├── ui/                   # shadcn components (auto-generated)
│   ├── dashboard/            # Dashboard specific components
│   ├── chat/                 # Chatbot widget components
│   └── marketing/            # Landing page components
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── middleware.ts     # Auth middleware
│   ├── gemini.ts             # Gemini API wrapper
│   ├── rag.ts                # RAG pipeline logic
│   └── file-parser.ts        # PDF/DOCX/TXT parser
├── public/
│   └── widget/
│       └── chatbot.js        # Embed script (clients lagaate hain)
├── middleware.ts              # Route protection
├── .env.local                 # Environment variables (gitignore)
└── PROJECT_BIBLE.md           # Yeh file!
```

---

## Environment Variables (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Development Phases

| Phase | Kya banega | Status |
|-------|-----------|--------|
| **Phase 1** | Project setup + folder structure | 🔴 Current |
| **Phase 2** | Supabase setup (DB + Auth + Storage) | 🔴 Pending |
| **Phase 3** | Marketing website (landing page) | 🔴 Pending |
| **Phase 4** | Auth (signup/login) | 🔴 Pending |
| **Phase 5** | Dashboard UI | 🔴 Pending |
| **Phase 6** | File upload + RAG pipeline | 🔴 Pending |
| **Phase 7** | Chatbot widget + embed script | 🔴 Pending |
| **Phase 8** | Analytics dashboard | 🔴 Pending |
| **Phase 9** | Deploy to Vercel | 🔴 Pending |

---

## Important Decisions Log

| Decision | Reason |
|----------|--------|
| Next.js App Router (not Pages) | Latest standard, better performance |
| Supabase over Firebase | SQL queries, better for analytics |
| pgvector over Pinecone | Free, already in Supabase |
| Gemini over OpenAI | Free tier available |
| shadcn/ui over MUI | More customizable, lighter |
| Embed via script tag | Simplest for clients, no iframe issues |

---

## How to Use This File

**Naye session mein Claude ko yeh bolna:**
> "Mera ek ongoing project hai. Yeh PROJECT_BIBLE.md padho aur context samjho: [file content paste karo]"

**Phase complete hone pe update karna:**
- Status `🟢 Done` kar do
- Naye decisions log mein add karo
- Folder structure update karo agar kuch badla

---

*Last updated: Phase 1 — Initial setup*