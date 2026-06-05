import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, FlaskConical, Sparkles, Microscope } from 'lucide-react'

const nav = [
  { to: '/', label: '管线看板', icon: LayoutDashboard, end: true },
  { to: '/assess', label: '新建评估', icon: FlaskConical },
]

export default function Sidebar() {
  const loc = useLocation()
  const onReport = loc.pathname.startsWith('/report')
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
          <Sparkles className="h-5 w-5 text-accent-400" />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight text-slate-900">启星智谷</div>
          <div className="text-[11px] leading-tight text-slate-500">药物出海评估平台</div>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          )
        })}
        <div
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
            onReport ? 'bg-brand-50 text-brand-700' : 'text-slate-400'
          }`}
        >
          <Microscope className="h-[18px] w-[18px]" />
          评估报告
        </div>
      </nav>

      <div className="mt-auto rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
        启星智谷 · 药物出海评估平台
        <br />
        智能尽调 · 人机协同决策 · v1.0
      </div>
    </aside>
  )
}
