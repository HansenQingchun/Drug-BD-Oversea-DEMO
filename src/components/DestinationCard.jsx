import { MapPin, Plane } from 'lucide-react'

const fitColor = {
  首选: 'bg-emerald-100 text-emerald-700',
  次选: 'bg-brand-100 text-brand-700',
  潜在: 'bg-brand-100 text-brand-700',
  观察: 'bg-amber-100 text-amber-700',
  审慎: 'bg-rose-100 text-rose-700',
}

export default function DestinationCard({ d }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <MapPin className="h-4 w-4 text-brand-600" />
          {d.region}
        </div>
        <span className={`chip ${fitColor[d.fit] || 'bg-slate-100 text-slate-600'}`}>{d.fit}</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-700">
        <Plane className="h-3.5 w-3.5" />
        {d.pathway}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{d.rationale}</p>
      <div className="mt-2 text-xs text-slate-400">竞争格局：{d.competition}</div>
    </div>
  )
}
