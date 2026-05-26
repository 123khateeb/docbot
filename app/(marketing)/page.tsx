import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import DemoSection from '@/app/(marketing)/demo-section'
import { FileText, Bot, Code2, BarChart3, Shield, Zap, ArrowRight, Check, Globe, Sparkles, Users, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Multiple file formats',
    description: 'Upload PDF, DOCX, and TXT files. Our AI processes and learns from every page instantly.',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Bot,
    title: 'AI-powered answers',
    description: 'State-of-the-art LLMs deliver precise answers strictly from your uploaded content.',
    color: 'bg-violet-500/10 text-violet-600',
  },
  {
    icon: Code2,
    title: 'One-line embed',
    description: 'A single script tag is all it takes to add your chatbot to any website.',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics dashboard',
    description: 'See every question your visitors ask and identify content gaps instantly.',
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    icon: Shield,
    title: 'Your content only',
    description: 'The chatbot never answers outside your documents. Total content control.',
    color: 'bg-rose-500/10 text-rose-600',
  },
  {
    icon: Zap,
    title: 'Instant setup',
    description: 'From signup to live chatbot in under five minutes. No coding required.',
    color: 'bg-yellow-500/10 text-yellow-600',
  },
]

const steps = [
  {
    number: '01',
    title: 'Upload your files',
    description: 'Upload PDF, DOCX, or TXT files. Our AI reads and indexes every word.',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    number: '02',
    title: 'Copy embed code',
    description: 'Grab the one-line script tag from your chatbot settings page.',
    icon: Code2,
    color: 'bg-violet-500',
  },
  {
    number: '03',
    title: 'Go live instantly',
    description: 'Paste before closing body tag. Your chatbot is live immediately.',
    icon: Globe,
    color: 'bg-emerald-500',
  },
]

const stats = [
  { value: '2,000+', label: 'Businesses using DocBot' },
  { value: '< 5 min', label: 'Average setup time' },
  { value: '98%', label: 'Answer accuracy' },
  { value: '24/7', label: 'Always available' },
]

const testimonials = [
  {
    quote: 'DocBot cut our support tickets by 60%. Our customers get instant answers without waiting.',
    author: 'Sarah K.',
    role: 'Head of Support, TechCorp',
    initials: 'SK',
    color: 'bg-blue-500',
  },
  {
    quote: 'Setup took literally 4 minutes. I uploaded our FAQ doc and the chatbot was live on our site.',
    author: 'Marcus T.',
    role: 'Founder, ShopEasy',
    initials: 'MT',
    color: 'bg-violet-500',
  },
  {
    quote: 'The accuracy is incredible. It only answers from our docs, so no hallucinations.',
    author: 'Priya M.',
    role: 'CTO, FinanceFlow',
    initials: 'PM',
    color: 'bg-emerald-500',
  },
]

export default function HomePage() {
  return (
    <>
    <div className="min-h-screen bg-background">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            DocBot
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">How it works</Link>
            <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Demo</Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Reviews</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="shadow-sm">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Now powered by GPT-4o — smarter than ever
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.04] mb-6">
            Turn your documents
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              into a chatbot
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Upload your PDFs, Docs, or text files and create a custom AI assistant in seconds.
            Embed it on your website with just one line of code.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base shadow-lg shadow-primary/20" asChild>
              <Link href="/signup">
                Create your chatbot — it's free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base" asChild>
              <Link href="#demo">See live demo</Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['No credit card required', 'Free to start', 'Setup in 5 minutes', 'Cancel anytime'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Demo */}
        <div id="demo" className="relative max-w-5xl mx-auto mt-16">
          <DemoSection />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 sm:px-6 border-y border-border/50 bg-muted/20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <p className="text-xs font-bold text-primary uppercase tracking-[3px]">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Live in three steps</h2>
            <p className="text-muted-foreground max-w-md mx-auto">The fastest way to deploy customer support AI on your website.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 opacity-30" />

            {steps.map((step, i) => (
              <div key={step.number} className="relative group">
                <div className="p-6 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center shadow-sm relative z-10`}>
                      <step.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-4xl font-black text-muted-foreground/15">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-muted/20 border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <p className="text-xs font-bold text-primary uppercase tracking-[3px]">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything you need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All the tools to build, deploy, and manage your AI chatbot in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border bg-background hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <p className="text-xs font-bold text-primary uppercase tracking-[3px]">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Loved by businesses</h2>
            <p className="text-muted-foreground">See what our customers are saying about DocBot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-background space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xs font-bold text-white">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-primary p-12 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-primary via-primary to-primary/80 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                <Users className="h-3.5 w-3.5" />
                Join 2,000+ businesses
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to get started?
              </h2>
              <p className="text-white/70 text-lg max-w-md mx-auto">
                Build your AI chatbot in minutes. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base bg-white text-primary hover:bg-white/90 font-bold shadow-xl" asChild>
                  <Link href="/signup">
                    Create your chatbot free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                {['Full access for 14 days', 'No credit card', 'Cancel anytime'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-white/60">
                    <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            {/* Brand */}
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                DocBot
              </Link>
              <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                Building the future of context-aware AI support.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Product</p>
                <div className="space-y-2">
                  <Link href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                  <Link href="#demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
                  <Link href="/signup" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Company</p>
                <div className="space-y-2">
                  <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                  <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                  <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Legal</p>
                <div className="space-y-2">
                  <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                  <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                  <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">© 2026 DocBot Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-600">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <script src="https://docbot-beige.vercel.app/widget.js" data-bot-id="9dc8e4f9-bbdf-4948-baa7-9c183d405472"></script>
    </>
  )
}