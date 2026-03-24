"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, ClipboardList, BarChart3, BookOpen,
  Calendar, Activity, Wallet, Package, Award,
  Heart, Briefcase, FolderOpen, MessageSquare,
  AlertTriangle, Bell, FileText, FileEdit,
  Clock, TrendingUp, BarChart2, Users, LogOut, Star, BellRing, KeyRound,
  ChevronLeft, ChevronRight, Menu, X,
} from "lucide-react"

const Award2 = Award
import type { AuthUser } from "@/lib/auth"

const NAV_HOD = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard" },
  { icon: Users,           label: "Students",   href: "/dashboard/students" },
  { icon: ClipboardList,   label: "Attendance", href: "/dashboard/attendance" },
  { icon: BarChart3,       label: "Marks",      href: "/dashboard/marks" },
  { icon: BookOpen,        label: "Subjects",   href: "/dashboard/subjects" },
  { icon: Calendar,        label: "Timetable",  href: "/dashboard/timetable" },
  { icon: Activity,        label: "Analytics",  href: "/dashboard/analytics" },
  { icon: Wallet,          label: "Finance",    href: "/dashboard/finance" },
  { icon: Package,         label: "Inventory",  href: "/dashboard/inventory" },
  { icon: Award,           label: "Placements", href: "/dashboard/placements" },
  { icon: Heart,           label: "Leaves",     href: "/dashboard/leaves" },
  { icon: Briefcase,       label: "Events",     href: "/dashboard/events" },
  { icon: FolderOpen,      label: "Documents",  href: "/dashboard/documents" },
  { icon: MessageSquare,   label: "Feedback",   href: "/dashboard/feedback" },
  { icon: AlertTriangle,   label: "Grievances", href: "/dashboard/grievances" },
  { icon: Bell,            label: "Notices",    href: "/dashboard/notices" },
]

const NAV_FACULTY = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard" },
  { icon: Users,           label: "Students",   href: "/dashboard/students" },
  { icon: ClipboardList,   label: "Attendance", href: "/dashboard/attendance" },
  { icon: BarChart3,       label: "Marks",      href: "/dashboard/marks" },
  { icon: BookOpen,        label: "Subjects",   href: "/dashboard/subjects" },
  { icon: Calendar,        label: "Timetable",  href: "/dashboard/timetable" },
  { icon: Heart,           label: "Leaves",     href: "/dashboard/leaves" },
  { icon: Briefcase,       label: "Events",     href: "/dashboard/events" },
  { icon: FolderOpen,      label: "Documents",  href: "/dashboard/documents" },
  { icon: MessageSquare,   label: "Feedback",   href: "/dashboard/feedback" },
  { icon: Bell,            label: "Notices",    href: "/dashboard/notices" },
]

const NAV_STUDENT = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard" },
  { icon: ClipboardList,   label: "Attendance", href: "/dashboard/attendance" },
  { icon: BarChart3,       label: "Marks",      href: "/dashboard/marks" },
  { icon: BookOpen,        label: "Subjects",   href: "/dashboard/subjects" },
  { icon: Calendar,        label: "Timetable",  href: "/dashboard/timetable" },
  { icon: Award,           label: "Placements", href: "/dashboard/placements" },
  { icon: Heart,           label: "Leaves",     href: "/dashboard/leaves" },
  { icon: FolderOpen,      label: "Documents",  href: "/dashboard/documents" },
  { icon: MessageSquare,   label: "Feedback",   href: "/dashboard/feedback" },
  { icon: AlertTriangle,   label: "Grievances", href: "/dashboard/grievances" },
  { icon: Bell,            label: "Notices",    href: "/dashboard/notices" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [authUser, setAuthUser]   = useState<AuthUser | null>(null)
  const [sidebarOpen, setSidebar] = useState(false)
  const [currentTime, setTime]    = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('excelsior_user')
    if (!stored) { router.push('/login'); return }
    setAuthUser(JSON.parse(stored) as AuthUser)
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('excelsior_user')
    router.push('/login')
  }

  const isHOD     = authUser?.type === 'staff' && authUser.data.role === 'HOD'
  const isFaculty = authUser?.type === 'staff' && authUser.data.role === 'FACULTY'
  const isStudent = authUser?.type === 'student'
  const navItems  = isHOD ? NAV_HOD : isFaculty ? NAV_FACULTY : NAV_STUDENT
  const name      = authUser?.data.name ?? '...'
  const initials  = name.split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase()
  const roleLabel = isHOD ? 'HEAD_OF_DEPT'
    : isStudent ? ((authUser?.data as { section?: string })?.section ?? 'STUDENT')
    : 'FACULTY'

  // Page title from pathname
  const segment = pathname.split('/')[2] ?? ''
  const pageTitle = segment
    ? segment.charAt(0).toUpperCase() + segment.slice(1)
    : isHOD ? 'Command Center' : isFaculty ? 'Faculty Dashboard' : 'Student Dashboard'

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebar(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm font-bold">EXCELSIOR.LICET</span>
          </div>
          <button onClick={() => setSidebar(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
              {initials || '??'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="font-mono text-xs text-muted-foreground truncate">{roleLabel} · CSE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} onClick={() => setSidebar(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all
                  ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border flex-shrink-0">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebar(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="font-mono text-xs text-primary">// EXCELSIOR · LICET CSE</span>
              <h1 className="text-xl font-bold tracking-tight">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground hidden sm:block">{currentTime}</span>
            <Link href="/dashboard/notices" className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
