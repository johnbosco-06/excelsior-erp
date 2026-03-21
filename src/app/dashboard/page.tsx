"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, BookOpen, ClipboardList, BarChart3,
  Wallet, Package, Bell, Award, Calendar, Heart,
  Briefcase, MessageSquare, FolderOpen, Activity,
  AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, Users
} from "lucide-react"
import type { AuthUser } from "@/lib/auth"

const NAV_HOD = [
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

export default function Dashboard() {
  const router = useRouter()
  const [mounted, setMounted]   = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('excelsior_user')
    if (!stored) { router.push('/login'); return }
    setAuthUser(JSON.parse(stored) as AuthUser)
  }, [router])

  const isHOD     = authUser?.type === 'staff' && authUser.data.role === 'HOD'
  const isFaculty = authUser?.type === 'staff' && authUser.data.role === 'FACULTY'
  const isStudent = authUser?.type === 'student'
  const name      = authUser?.data.name ?? '...'
  const navItems  = isHOD ? NAV_HOD : isFaculty ? NAV_FACULTY : NAV_STUDENT

  const HOD_STATS = [
    { label: 'Total Students',   value: '515', up: true,  icon: Users },
    { label: 'Avg Attendance',   value: '0%',  up: true,  icon: ClipboardList },
    { label: 'Total Subjects',   value: '132', up: true,  icon: BookOpen },
    { label: 'At-Risk Students', value: '0',   up: true,  icon: AlertTriangle },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="font-mono text-xs text-muted-foreground">
          Welcome back, <span className="text-primary">{name}</span>
          {isStudent && <> · <span className="text-primary">{(authUser?.data as { section?: string })?.section}</span></>}
          {' '}· CSE Department · LICET
        </p>
      </div>

      {/* HOD */}
      {isHOD && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {HOD_STATS.map(({ label, value, up, icon: Icon }, i) => (
              <div key={label}
                className={`bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-all duration-500
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-accent rounded-lg"><Icon className="w-4 h-4 text-muted-foreground" /></div>
                  {up ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                </div>
                <p className="text-2xl font-bold mb-1">{value}</p>
                <p className="font-mono text-xs text-muted-foreground uppercase">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {navItems.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href}
                className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all font-mono text-xs text-muted-foreground hover:text-foreground text-center">
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Faculty */}
      {isFaculty && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Classes Today',  value: '—', href: '/dashboard/timetable' },
              { label: 'Pending Leaves', value: '0', href: '/dashboard/leaves' },
              { label: 'New Notices',    value: '3', href: '/dashboard/notices' },
              { label: 'Feedback Due',   value: '0', href: '/dashboard/feedback' },
            ].map(({ label, value, href }) => (
              <Link key={label} href={href} className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-all">
                <p className="font-mono text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {navItems.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href}
                className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all font-mono text-xs text-muted-foreground hover:text-foreground text-center">
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Student */}
      {isStudent && authUser && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Attendance', value: '0%', href: '/dashboard/attendance' },
              { label: 'Avg Marks',  value: '0%', href: '/dashboard/marks' },
              { label: 'Subjects',   value: '10', href: '/dashboard/subjects' },
              { label: 'Notices',    value: '3',  href: '/dashboard/notices' },
            ].map(({ label, value, href }) => (
              <Link key={label} href={href} className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-all">
                <p className="font-mono text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </Link>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <span className="font-mono text-xs text-primary block mb-3">// YOUR INFO</span>
            <div className="space-y-2">
              {[
                { label: 'Name',       value: authUser.data.name },
                { label: 'Email',      value: authUser.data.email },
                { label: 'Section',    value: (authUser.data as { section?: string })?.section ?? '—' },
                { label: 'Year',       value: `Year ${(authUser.data as { year?: number })?.year ?? '—'}` },
                { label: 'Batch',      value: (authUser.data as { batch?: string })?.batch ?? '—' },
                { label: 'Department', value: 'Computer Science & Engineering' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                  <span className="font-mono text-xs text-muted-foreground">{label}</span>
                  <span className="font-mono text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {navItems.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href}
                className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all font-mono text-xs text-muted-foreground hover:text-foreground text-center">
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={`flex items-center gap-2 font-mono text-xs text-muted-foreground transition-all ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <CheckCircle2 className="w-3 h-3 text-green-500" />
        <span>All systems operational</span>
        <span className="mx-2">|</span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
        <span>SEMESTER: EVEN 2025-2026</span>
      </div>
    </div>
  )
}
