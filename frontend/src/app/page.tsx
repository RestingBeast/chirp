import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { getServerSession } from "@/lib/session";

export default async function LandingPage() {
  const session = await getServerSession();

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 bg-dot-pattern">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary/50 text-primary mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Team Synchronization
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-tight">
            No more noise. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-primary">
              Just the pulse.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chirp turns daily standups into high-fidelity technical digests.
            Keep your team aligned without the meeting fatigue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href={session ? "/board" : "/login"}>
              <Button
                size="lg"
                className="h-12 px-8 text-lg font-semibold group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">First-Principles Design</h3>
            <p className="text-muted-foreground">
              Built for speed and clarity. No fluff, no bloated features. Just
              the essential data your team needs to move fast.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">AI Intelligence</h3>
            <p className="text-muted-foreground">
              Automatically synthesize multiple team updates into a single,
              cohesive narrative using advanced LLMs.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Admin Controls</h3>
            <p className="text-muted-foreground">
              Securely manage multiple teams, generate private invite links, and
              oversee your entire organization from one console.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 chirp. Built for the modern engineering team.
        </div>
      </footer>
    </div>
  );
}
