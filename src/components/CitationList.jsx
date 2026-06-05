import { Quote } from 'lucide-react'

export default function CitationList({ citations }) {
  return (
    <ul className="space-y-2">
      {citations.map((c, i) => (
        <li key={i} className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3">
          <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
          <div>
            <span className="text-xs font-semibold text-brand-700">{c.source}</span>
            <p className="text-[13px] leading-snug text-slate-600">{c.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
