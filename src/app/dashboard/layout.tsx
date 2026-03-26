"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  AlertCircle, Activity, Star, ClipboardCheck, PieChart, Key, FileText, 
  PenTool, CalendarDays, BookOpen, MessageSquare, Wallet, AlertTriangle, 
  Package, Heart, Award, ShieldCheck, Bell, Briefcase, TrendingUp, 
  FileBarChart, Users, Library, Clock, LogOut, LayoutDashboard
} from "lucide-react"
import type { AuthUser } from "@/lib/auth"
import { getAllowedModules } from "@/lib/roles"
import { Scene3D } from "@/components/3d-scene"
import { StarCursor } from "@/components/star-cursor"
import { Outfit } from "next/font/google"

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })

const DOCK_ITEMS = [
  { icon: LayoutDashboard, label: "dashboard",       id: "dashboard" },
  { icon: Users,           label: "students",        id: "students" },
  { icon: ClipboardCheck,  label: "attendance",      id: "attendance" },
  { icon: Award,           label: "marks",           id: "marks" },
  { icon: Library,         label: "subjects",        id: "subjects" },
  { icon: Clock,           label: "timetable",       id: "timetable" },
  { icon: Activity,        label: "analytics",       id: "analytics" },
  { icon: Wallet,          label: "finance",         id: "finance" },
  { icon: Package,         label: "inventory",       id: "inventory" },
  { icon: Briefcase,       label: "placements",      id: "placements" },
  { icon: Heart,           label: "leaves",          id: "leaves" },
  { icon: CalendarDays,    label: "events",          id: "events" },
  { icon: FileText,        label: "documents",       id: "documents" },
  { icon: MessageSquare,   label: "feedback",        id: "feedback" },
  { icon: AlertTriangle,   label: "grievances",      id: "grievances" },
  { icon: Bell,            label: "notices",         id: "notices" },
  { icon: AlertCircle,     label: "alerts",          id: "alerts" },
  { icon: Star,            label: "appraisal",       id: "appraisal" },
  { icon: PieChart,        label: "att. analysis",   id: "attendance-analysis" },
  { icon: Key,             label: "password",        id: "change-password" },
  { icon: PenTool,         label: "editor",          id: "editor" },
  { icon: BookOpen,        label: "examination",     id: "examination" },
  { icon: ShieldCheck,     label: "naac",            id: "naac" },
  { icon: TrendingUp,      label: "promotion",       id: "promotion" },
  { icon: FileBarChart,    label: "reports",         id: "reports" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [currentTime, setTime] = useState('')
  const [allowedModules, setAllowedModules] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('excelsior_user')
    if (!stored) { router.push('/login'); return }
    const user = JSON.parse(stored) as AuthUser
    
    setAllowedModules(getAllowedModules(user.type, user.type === 'staff' ? user.data.role : ''))

    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('excelsior_user')
    router.push('/login')
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    const container = document.getElementById('scroll-container')
    if (element && container) {
      const topPos = element.offsetTop
      container.scrollTo({ top: topPos, behavior: 'smooth' })
    }
  }

  const visibleDockItems = DOCK_ITEMS.filter(item => allowedModules.includes(item.id))

  return (
    <div className={`h-screen w-full bg-[#010308] text-white flex flex-col items-center overflow-hidden ${outfit.className} cursor-none relative`}>
      <StarCursor />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40"><Scene3D /></div>

      <header className="w-11/12 max-w-[1600px] flex justify-between items-center py-6 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]" />
          <div>
            <span className="font-mono text-[10px] text-cyan-500 tracking-[0.2em] uppercase block mb-0.5">LICET CSE NETWORK // ACTIVE LINK</span>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase">EXCELSIOR <span className="text-slate-500 font-light ml-2 text-sm">// COMMAND NODE</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-6"><span className="font-mono text-xs text-cyan-400 hidden sm:block tracking-widest">{currentTime}</span></div>
      </header>

      <main className="w-11/12 max-w-[1600px] flex-1 mb-28 bg-[#0a101d]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col z-10 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-50" />
        <div id="scroll-container" className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-6 z-50 max-w-[95vw] overflow-x-auto scrollbar-none px-4 py-4 pointer-events-auto">
        <div className="flex items-center gap-1 px-4 py-3 bg-[#0a101d]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          {visibleDockItems.map(({ icon: Icon, label, id }) => (
            <motion.button key={id} onClick={() => scrollToSection(id)} whileHover={{ scale: 1.6, y: -15, zIndex: 50 }} whileTap={{ scale: 0.9 }} className="relative group p-2 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors origin-bottom">
              <Icon className="w-5 h-5" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/5 rounded-lg text-[9px] font-light tracking-[0.15em] lowercase text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                {label}
              </div>
            </motion.button>
          ))}
          <div className="w-px h-8 bg-white/10 mx-3 flex-shrink-0" />
          <motion.button onClick={handleLogout} whileHover={{ scale: 1.6, y: -15, zIndex: 50 }} whileTap={{ scale: 0.9 }} className="relative group p-2 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors origin-bottom flex-shrink-0">
            <LogOut className="w-5 h-5" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/5 rounded-lg text-[9px] font-light tracking-[0.15em] lowercase text-red-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">disconnect</div>
          </motion.button>
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        * { cursor: none !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(14,165,233,0.5); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}
