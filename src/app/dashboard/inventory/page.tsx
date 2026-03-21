"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { AuthUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase"
import { Package, Plus, X, Loader2, Download, AlertTriangle } from "lucide-react"
import * as XLSX from "xlsx"

type InventoryItem = Database['public']['Tables']['inventory']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

const CATEGORIES = ['Computer','Printer','Projector','Server','Network Equipment','Lab Equipment','Furniture','Software License','Other']
const STATUS_COLORS = {
  OPERATIONAL: 'text-green-500 bg-green-500/10 border-green-500/20',
  MAINTENANCE: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  RETIRED:     'text-red-500 bg-red-500/10 border-red-500/20',
}

export default function InventoryPage() {
  const router = useRouter()
  const [authUser, setAuthUser]   = useState<AuthUser | null>(null)
  const [profile, setProfile]     = useState<Profile | null>(null)
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [showForm, setShowForm]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterCat, setFilterCat] = useState('ALL')
  const [form, setForm] = useState({
    asset_tag: '', name: '', category: 'Computer',
    status: 'OPERATIONAL' as 'OPERATIONAL'|'MAINTENANCE'|'RETIRED',
    location: '', purchase_date: '', purchase_value: '', notes: '', next_service_date: ''
  })

  const isHOD = authUser?.type === 'staff' && authUser.data.role === 'HOD'
  const isFaculty = authUser?.type === 'staff'
  const DEPT  = '00000000-0000-0000-0000-000000000001'

  useEffect(() => {
    const stored = localStorage.getItem('excelsior_user')
    if (!stored) { router.push('/login'); return }
    const au = JSON.parse(stored) as AuthUser
    setAuthUser(au)
    if (au.type === 'student') { router.push('/dashboard'); return }
    supabase.from('profiles').select('*').eq('email', au.data.email).single()
      .then(({ data }) => { if (data) setProfile(data) })
  }, [router])

  const loadItems = async () => {
    const { data } = await supabase.from('inventory').select('*')
      .eq('department_id', DEPT).order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  useEffect(() => { if (profile) loadItems() }, [profile])

  const addItem = async () => {
    if (!profile || !form.asset_tag || !form.name) return
    setSaving(true)
    await supabase.from('inventory').insert({
      department_id: DEPT,
      asset_tag: form.asset_tag,
      name: form.name,
      category: form.category,
      status: form.status,
      location: form.location || null,
      purchase_date: form.purchase_date || null,
      purchase_value: form.purchase_value ? Number(form.purchase_value) : null,
      notes: form.notes || null,
      next_service_date: form.next_service_date || null,
    })
    setSaving(false)
    setForm({ asset_tag:'', name:'', category:'Computer', status:'OPERATIONAL', location:'', purchase_date:'', purchase_value:'', notes:'', next_service_date:'' })
    setShowForm(false)
    loadItems()
  }

  const updateStatus = async (id: string, status: 'OPERATIONAL'|'MAINTENANCE'|'RETIRED') => {
    await supabase.from('inventory').update({ status }).eq('id', id)
    loadItems()
  }

  const exportXLSX = () => {
    const rows = items.map(i => ({
      'Asset Tag': i.asset_tag, 'Name': i.name, 'Category': i.category,
      'Status': i.status, 'Location': i.location ?? '',
      'Purchase Date': i.purchase_date ?? '', 'Value (₹)': i.purchase_value ?? '',
      'Next Service': i.next_service_date ?? '', 'Notes': i.notes ?? ''
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory')
    XLSX.writeFile(wb, `Inventory_CSE_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const filtered = items.filter(i => {
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false
    if (filterCat !== 'ALL' && i.category !== filterCat) return false
    return true
  })

  const needsService = items.filter(i => {
    if (!i.next_service_date) return false
    return new Date(i.next_service_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })

  const stats = {
    total:       items.length,
    operational: items.filter(i => i.status === 'OPERATIONAL').length,
    maintenance: items.filter(i => i.status === 'MAINTENANCE').length,
    retired:     items.filter(i => i.status === 'RETIRED').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs text-primary">// SECTION: INVENTORY</span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Inventory Management</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">Lab equipment, computers and department assets</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportXLSX}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white font-mono text-xs rounded hover:bg-green-700">
            <Download className="w-3 h-3" /> Export
          </button>
          {(isHOD || isFaculty) && (
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs rounded hover:bg-primary/90">
              <Plus className="w-3 h-3" /> Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets',  value: stats.total,       color: 'text-foreground' },
          { label: 'Operational',   value: stats.operational, color: 'text-green-500' },
          { label: 'Maintenance',   value: stats.maintenance, color: 'text-yellow-500' },
          { label: 'Retired',       value: stats.retired,     color: 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Service due alert */}
      {needsService.length > 0 && (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="font-mono text-xs text-yellow-500">
            {needsService.length} asset(s) due for service within 30 days:
            {' '}{needsService.slice(0,3).map(i => i.name).join(', ')}
            {needsService.length > 3 && ` +${needsService.length - 3} more`}
          </p>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-card border border-primary/30 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-primary">// ADD ASSET</span>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: 'asset_tag',     label: 'Asset Tag *',       placeholder: 'e.g. CSE-PC-001' },
              { key: 'name',          label: 'Asset Name *',      placeholder: 'e.g. Dell Optiplex 7090' },
              { key: 'location',      label: 'Location',          placeholder: 'e.g. CS Lab 1' },
              { key: 'purchase_date', label: 'Purchase Date',     placeholder: '', type: 'date' },
              { key: 'purchase_value',label: 'Purchase Value (₹)',placeholder: '0', type: 'number' },
              { key: 'next_service_date', label: 'Next Service Date', placeholder: '', type: 'date' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key} className="space-y-1">
                <label className="font-mono text-xs text-muted-foreground">{label}</label>
                <input type={type ?? 'text'} value={(form as any)[key]} placeholder={placeholder}
                  onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full h-10 px-3 bg-background border border-border rounded font-mono text-sm focus:border-primary focus:outline-none" />
              </div>
            ))}
            <div className="space-y-1">
              <label className="font-mono text-xs text-muted-foreground">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full h-10 px-3 bg-background border border-border rounded font-mono text-sm focus:border-primary focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-muted-foreground">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}
                className="w-full h-10 px-3 bg-background border border-border rounded font-mono text-sm focus:border-primary focus:outline-none">
                <option value="OPERATIONAL">Operational</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-muted-foreground">Notes</label>
              <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="Any notes..."
                className="w-full h-10 px-3 bg-background border border-border rounded font-mono text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>
          <button onClick={addItem} disabled={saving || !form.asset_tag || !form.name}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs rounded hover:bg-primary/90 disabled:opacity-50">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Package className="w-3 h-3" />}
            {saving ? 'Adding...' : 'Add Asset'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['ALL','OPERATIONAL','MAINTENANCE','RETIRED'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
            {s}
          </button>
        ))}
        <span className="text-muted-foreground">|</span>
        {['ALL', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${filterCat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                {['Asset Tag','Name','Category','Status','Location','Purchase Date','Value','Next Service'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
                {(isHOD || isFaculty) && <th className="px-4 py-3 font-mono text-xs text-muted-foreground">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center font-mono text-sm text-muted-foreground">No assets found</td></tr>
              ) : filtered.map(item => {
                const serviceOverdue = item.next_service_date && new Date(item.next_service_date) < new Date()
                return (
                  <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold">{item.asset_tag}</td>
                    <td className="px-4 py-3 text-sm">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.location ?? '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {item.purchase_value ? `₹${Number(item.purchase_value).toLocaleString()}` : '—'}
                    </td>
                    <td className={`px-4 py-3 font-mono text-xs ${serviceOverdue ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                      {item.next_service_date ? new Date(item.next_service_date).toLocaleDateString() : '—'}
                      {serviceOverdue && ' ⚠'}
                    </td>
                    {(isHOD || isFaculty) && (
                      <td className="px-4 py-3">
                        <select value={item.status}
                          onChange={e => updateStatus(item.id, e.target.value as any)}
                          className="h-7 px-2 bg-background border border-border rounded font-mono text-xs focus:border-primary focus:outline-none">
                          <option value="OPERATIONAL">Operational</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="RETIRED">Retired</option>
                        </select>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
