"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, ClipboardList, BarChart3, BookOpen,
  Calendar, Activity, Wallet, Package, Award,
  Heart, Briefcase, FolderOpen, MessageSquare,
  AlertTriangle, Bell, FileText, KeyRound,
  TrendingUp, BarChart2, Users, LogOut,
  ChevronRight, Menu, X, Star, FileEdit,
} from "lucide-react"

import type { AuthUser } from "@/lib/auth"

// ─── Nav definitions ──────────────────────────────────────────────────────────

const NAV_HOD = [
  { icon: LayoutDashboard, label: "Dashboard",           href: "/dashboard" },
  { icon: Users,           label: "Students",            href: "/dashboard/students" },
  { icon: ClipboardList,   label: "Attendance",          href: "/dashboard/attendance" },
  { icon: BarChart2,       label: "Attendance Analysis", href: "/dashboard/attendance-analysis" },
  { icon: BarChart3,       label: "Marks",               href: "/dashboard/marks" },
  { icon: BookOpen,        label: "Subjects",            href: "/dashboard/subjects" },
  { icon: Calendar,        label: "Timetable",           href: "/dashboard/timetable" },
  { icon: FileText,        label: "Examination",         href: "/dashboard/examination" },
  { icon: TrendingUp,      label: "Promotion",           href: "/dashboard/promotion" },
  { icon: Activity,        label: "Analytics",           href: "/dashboard/analytics" },
  { icon: BarChart3,       label: "Reports",             href: "/dashboard/reports" },
  { icon: Wallet,          label: "Finance",             href: "/dashboard/finance" },
  { icon: Package,         label: "Inventory",           href: "/dashboard/inventory" },
  { icon: Award,           label: "Placements",          href: "/dashboard/placements" },
  { icon: Star,            label: "Appraisal",           href: "/dashboard/appraisal" },
  { icon: Heart,           label: "Leaves",              href: "/dashboard/leaves" },
  { icon: Briefcase,       label: "Events",              href: "/dashboard/events" },
  { icon: FolderOpen,      label: "Documents",           href: "/dashboard/documents" },
  { icon: FileEdit,        label: "Editor",              href: "/dashboard/editor" },
  { icon: MessageSquare,   label: "Feedback",            href: "/dashboard/feedback" },
  { icon: AlertTriangle,   label: "Grievances",          href: "/dashboard/grievances" },
  { icon: Bell,            label: "Alerts",              href: "/dashboard/alerts" },
  { icon: Bell,            label: "Notices",             href: "/dashboard/notices" },
  { icon: BarChart3,       label: "NAAC",                href: "/dashboard/naac" },
  { icon: KeyRound,        label: "Change Password",     href: "/dashboard/change-password" },
]

const NAV_FACULTY = [
  { icon: LayoutDashboard, label: "Dashboard",       href: "/dashboard" },
  { icon: Users,           label: "Students",        href: "/dashboard/students" },
  { icon: ClipboardList,   label: "Attendance",      href: "/dashboard/attendance" },
  { icon: BarChart3,       label: "Marks",           href: "/dashboard/marks" },
  { icon: BookOpen,        label: "Subjects",        href: "/dashboard/subjects" },
  { icon: Calendar,        label: "Timetable",       href: "/dashboard/timetable" },
  { icon: FileText,        label: "Examination",     href: "/dashboard/examination" },
  { icon: Star,            label: "Appraisal",       href: "/dashboard/appraisal" },
  { icon: Heart,           label: "Leaves",          href: "/dashboard/leaves" },
  { icon: Briefcase,       label: "Events",          href: "/dashboard/events" },
  { icon: FolderOpen,      label: "Documents",       href: "/dashboard/documents" },
  { icon: MessageSquare,   label: "Feedback",        href: "/dashboard/feedback" },
  { icon: Bell,            label: "Notices",         href: "/dashboard/notices" },
  { icon: KeyRound,        label: "Change Password", href: "/dashboard/change-password" },
]

const NAV_STUDENT = [
  { icon: LayoutDashboard, label: "Dashboard",       href: "/dashboard" },
  { icon: ClipboardList,   label: "Attendance",      href: "/dashboard/attendance" },
  { icon: BarChart3,       label: "Marks",           href: "/dashboard/marks" },
  { icon: BookOpen,        label: "Subjects",        href: "/dashboard/subjects" },
  { icon: Calendar,        label: "Timetable",       href: "/dashboard/timetable" },
  { icon: Award,           label: "Placements",      href: "/dashboard/placements" },
  { icon: Heart,           label: "Leaves",          href: "/dashboard/leaves" },
  { icon: FolderOpen,      label: "Documents",       href: "/dashboard/documents" },
  { icon: MessageSquare,   label: "Feedback",        href: "/dashboard/feedback" },
  { icon: AlertTriangle,   label: "Grievances",      href: "/dashboard/grievances" },
  { icon: Bell,            label: "Notices",         href: "/dashboard/notices" },
  { icon: KeyRound,        label: "Change Password", href: "/dashboard/change-password" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "attendance-analysis" → "Attendance Analysis" */
function formatPageTitle(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()

  const [authUser, setAuthUser]   = useState<AuthUser | null>(null)
  const [authLoading, setLoading] = useState(true)
  const [sidebarOpen, setSidebar] = useState(false)
  const [currentTime, setTime]    = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("excelsior_user")
    if (!stored) { router.push("/login"); return }
    setAuthUser(JSON.parse(stored) as AuthUser)
    setLoading(false)

    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
        })
      )
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("excelsior_user")
    router.push("/login")
  }

  const isHOD     = authUser?.type === "staff" && authUser.data.role === "HOD"
  const isFaculty = authUser?.type === "staff" && authUser.data.role === "FACULTY"
  const isStudent = authUser?.type === "student"

  // FIX 1: no nav shown while loading — avoids flashing NAV_STUDENT for HOD/Faculty
  const navItems = authLoading
    ? []
    : isHOD ? NAV_HOD : isFaculty ? NAV_FACULTY : NAV_STUDENT

  const name     = authUser?.data.name ?? "..."
  const initials = name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()

  // FIX 2: explicit fallback for each role, unknown staff roles won't show FACULTY
  const roleLabel = isHOD
    ? "HEAD_OF_DEPT"
    : isFaculty
    ? "FACULTY"
    : isStudent
    ? (authUser?.data as { section?: string })?.section ?? "STUDENT"
    : authUser?.type === "staff"
    ? (authUser.data as { role?: string }).role ?? "STAFF"
    : "USER"

  // FIX 3: handles hyphenated routes like "attendance-analysis" → "Attendance Analysis"
  const segment   = pathname.split("/")[2] ?? ""
  const pageTitle = segment
    ? formatPageTitle(segment)
    : isHOD ? "Command Center" : isFaculty ? "Faculty Dashboard" : "Student Dashboard"

  // FIX 4: derive department from student section where possible
  const department = isStudent
    ? (authUser?.data as { section?: string })?.section?.split(" ")[1] ?? "CSE"
    : "CSE"

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm font-bold">EXCELSIOR.LICET</span>
          </div>
          <button onClick={() => setSidebar(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
              {authLoading ? "…" : initials || "??"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="font-mono text-xs text-muted-foreground truncate">
                {roleLabel} · {department}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {authLoading ? (
            <p className="px-3 py-2 text-xs font-mono text-muted-foreground">Loading…</p>
          ) : (
            navItems.map(({ icon: Icon, label, href }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
              return (
                <Link key={href} href={href} onClick={() => setSidebar(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all
                    ${active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              )
            })
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border flex-shrink-0">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
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
            <Link href="/dashboard/alerts" className="relative p-2 rounded-lg hover:bg-accent transition-colors">
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
