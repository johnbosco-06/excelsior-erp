"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Users, ClipboardList, BookOpen, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import type { AuthUser } from "@/lib/auth"
import { getAllowedModules } from "@/lib/roles"

import { AlertsModule } from "@/components/modules/alerts-module"
import { AnalyticsModule } from "@/components/modules/analytics-module"
import { AppraisalModule } from "@/components/modules/appraisal-module"
import { AttendanceModule } from "@/components/modules/attendance-module"
import { AttendanceAnalysisModule } from "@/components/modules/attendance-analysis-module"
import { ChangePasswordModule } from "@/components/modules/change-password-module"
import { DocumentsModule } from "@/components/modules/documents-module"
import { EditorModule } from "@/components/modules/editor-module"
import { EventsModule } from "@/components/modules/events-module"
import { ExaminationModule } from "@/components/modules/examination-module"
import { FeedbackModule } from "@/components/modules/feedback-module"
import { FinanceModule } from "@/components/modules/finance-module"
import { GrievancesModule } from "@/components/modules/grievances-module"
import { InventoryModule } from "@/components/modules/inventory-module"
import { LeavesModule } from "@/components/modules/leaves-module"
import { MarksModule } from "@/components/modules/marks-module"
import { NaacModule } from "@/components/modules/naac-module"
import { NoticesModule } from "@/components/modules/notices-module"
import { PlacementsModule } from "@/components/modules/placements-module"
import { PromotionModule } from "@/components/modules/promotion-module"
import { ReportsModule } from "@/components/modules/reports-module"
import { StudentsModule } from "@/components/modules/students-module"
import { SubjectsModule } from "@/components/modules/subjects-module"
import { TimetableModule } from "@/components/modules/timetable-module"

const MODULES = [
  { id: "students", Component: StudentsModule },
  { id: "attendance", Component: AttendanceModule },
  { id: "marks", Component: MarksModule },
  { id: "subjects", Component: SubjectsModule },
  { id: "timetable", Component: TimetableModule },
  { id: "analytics", Component: AnalyticsModule },
  { id: "finance", Component: FinanceModule },
  { id: "inventory", Component: InventoryModule },
  { id: "placements", Component: PlacementsModule },
  { id: "leaves", Component: LeavesModule },
  { id: "events", Component: EventsModule },
  { id: "documents", Component: DocumentsModule },
  { id: "feedback", Component: FeedbackModule },
  { id: "grievances", Component: GrievancesModule },
  { id: "notices", Component: NoticesModule },
  { id: "alerts", Component: AlertsModule },
  { id: "appraisal", Component: AppraisalModule },
  { id: "attendance-analysis", Component: AttendanceAnalysisModule },
  { id: "change-password", Component: ChangePasswordModule },
  { id: "editor", Component: EditorModule },
  { id: "examination", Component: ExaminationModule },
  { id: "naac", Component: NaacModule },
  { id: "promotion", Component: PromotionModule },
  { id: "reports", Component: ReportsModule }
]

export default function MasterDashboard() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [allowedModules, setAllowedModules] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('excelsior_user')
    if (stored) {
      const user = JSON.parse(stored) as AuthUser
      setAuthUser(user)
      setAllowedModules(getAllowedModules(user.type, user.type === 'staff' ? user.data.role : ''))
    }
  }, [])

  const visibleModules = MODULES.filter(m => allowedModules.includes(m.id))

  const HOD_STATS = [
    { label: 'Network Integrity', value: '100%', up: true,  icon: Users },
    { label: 'Avg Attendance',    value: '84%',  up: true,  icon: ClipboardList },
    { label: 'Active Modules',    value: allowedModules.length.toString(), up: true,  icon: BookOpen },
    { label: 'System Alerts',     value: '0',    up: false, icon: AlertTriangle },
  ]

  return (
    <div className="w-full">
      <section id="dashboard" className="min-h-[70vh] p-8 md:p-12 border-b border-white/5 flex flex-col justify-center pt-24">
        <h2 className="text-4xl font-bold tracking-widest uppercase mb-2 text-white drop-shadow-md">Command Center</h2>
        <p className="text-slate-300 text-lg font-light mb-12 max-w-2xl">
          Welcome, <span className="text-cyan-400 font-medium">{authUser?.data.name || 'User'}</span>. Clearance level permits access to {allowedModules.length} modules.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
          {HOD_STATS.map(({ label, value, up, icon: Icon }) => (
            <div key={label} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-black/20 rounded-xl border border-white/5 group-hover:border-cyan-500/50 transition-colors">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                {up ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
              </div>
              <p className="text-4xl font-black text-white mb-1 tracking-tight">{value}</p>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-[0.2em]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {visibleModules.map(({ id, Component }) => (
        <section key={id} id={id} className="min-h-[70vh] p-8 md:p-12 border-b border-white/5 pt-24 flex flex-col">
          <span className="text-cyan-500 font-mono text-[10px] tracking-[0.2em] uppercase mb-8 block">// MODULE LOADED: {id.replace('-', ' ')}</span>
          <div className="w-full flex-1"><Component /></div>
        </section>
      ))}
      <div className="h-[30vh]" />
    </div>
  )
}
