"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { LoginForm } from "@/components/login-form"

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="text-muted-foreground hover:text-foreground transition-colors relative group">
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
    </a>
  )
}

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    setMounted(true)
    const update = () => setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-[float_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line x1="0%" y1="30%" x2="100%" y2="30%" stroke="url(#lg)" strokeWidth="1" strokeDasharray="20 40" className="animate-[dash_8s_linear_infinite]" />
          <line x1="0%" y1="70%" x2="100%" y2="70%" stroke="url(#lg)" strokeWidth="1" strokeDasharray="30 50" className="animate-[dash_12s_linear_infinite_reverse]" />
          <line x1="20%" y1="0%" x2="20%" y2="100%" stroke="url(#lgv)" strokeWidth="1" strokeDasharray="25 45" className="animate-[dashV_10s_linear_infinite]" />
          <line x1="80%" y1="0%" x2="80%" y2="100%" stroke="url(#lgv)" strokeWidth="1" strokeDasharray="15 35" className="animate-[dashV_14s_linear_infinite_reverse]" />
          <defs>
            <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="lgv" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <div className="flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm text-muted-foreground">EXCELSIOR.LICET</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-mono text-sm">
            <NavLink href="#" label="About" />
            <NavLink href="#" label="Academics" />
            <NavLink href="#" label="Support" />
          </div>
          <div className="font-mono text-xs text-muted-foreground">{currentTime || "00:00:00"}</div>
        </div>
      </nav>

      {/* Main */}
      <div className="relative min-h-screen flex">
        {/* Left — Hero */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-32">
          <div className={`flex items-center gap-4 mb-12 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="font-mono text-xs text-primary">// SECTION: LOGIN</span>
            <div className="h-px flex-1 bg-border max-w-[100px]" />
            <span className="font-mono text-xs text-muted-foreground">001</span>
          </div>
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight overflow-hidden">
              <span className="block text-foreground">
                {"EXCEL".split("").map((l, i) => (
                  <span key={i} className={`inline-block transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`} style={{ transitionDelay: `${200 + i * 50}ms` }}>{l}</span>
                ))}
              </span>
              <span className="block text-foreground">
                {"SIOR.".split("").map((l, i) => (
                  <span key={i} className={`inline-block transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`} style={{ transitionDelay: `${450 + i * 50}ms` }}>{l}</span>
                ))}
              </span>
              <span className="block text-primary">
                {"LICET".split("").map((l, i) => (
                  <span key={i} className={`inline-block transition-all duration-500 hover:text-foreground cursor-default ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`} style={{ transitionDelay: `${700 + i * 50}ms` }}>{l}</span>
                ))}
              </span>
            </h1>
            <div className={`flex items-center gap-3 mt-4 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1000ms" }}>
              <span className="font-mono text-xs px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded animate-pulse">v2.0</span>
              <span className="font-mono text-xs text-muted-foreground">UNIVERSITY MANAGEMENT SYSTEM</span>
            </div>
          </div>
          <div className={`mb-12 max-w-md transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-muted-foreground leading-relaxed">
              Your gateway to academic excellence. Access courses, grades, schedules, and campus resources — all in one place.
            </p>
          </div>
          <div className={`lg:hidden flex items-center gap-2 text-muted-foreground transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <ChevronDown className="w-4 h-4 animate-bounce" />
            <span className="font-mono text-xs">SCROLL TO LOGIN</span>
          </div>
        </div>

        {/* Right — Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
          <div className={`flex items-center gap-4 mb-12 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <span className="font-mono text-xs text-primary">// SECTION: AUTH</span>
            <div className="h-px flex-1 bg-border max-w-[100px]" />
            <span className="font-mono text-xs text-muted-foreground">002</span>
          </div>

          <div className={`relative transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`} style={{ transitionDelay: "600ms" }}>
            <div className="flex items-center gap-2 mb-6">
              {[["bg-red-400/80","900ms"],["bg-yellow-400/80","1000ms"],["bg-green-400/80","1100ms"]].map(([color, delay], i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${color} transition-all duration-300 ${mounted ? "scale-100" : "scale-0"}`} style={{ transitionDelay: delay }} />
              ))}
              <span className={`font-mono text-xs text-muted-foreground ml-4 transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: "1200ms" }}>auth_portal.exe</span>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-[-1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "800ms" }}>Sign In</h2>
              <p className={`text-sm text-muted-foreground mb-8 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "900ms" }}>Access your academic dashboard</p>
              
              <LoginForm />
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-card/50 px-4 font-mono text-xs text-muted-foreground">OR</span></div>
              </div>
              
              <button className="w-full h-12 border border-border hover:border-primary text-foreground font-mono text-sm rounded transition-all duration-300 hover:bg-primary/5 group flex items-center justify-center gap-2">
                Request New Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-8 flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>SESSION_STATUS: <span className="text-green-500">SECURE</span></span>
              <span>© 2026 EXCELSIOR-LICET</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className={`fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm px-6 py-3 transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />SYSTEM_ONLINE</span>
            <span className="hidden md:block">SEMESTER: SPRING_2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="fixed top-6 right-6 w-32 h-32 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-primary/30 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-primary/30 to-transparent" />
      </div>
      <div className="fixed bottom-16 left-6 w-32 h-32 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-primary/30 to-transparent" />
      </div>
    </main>
  )
}
