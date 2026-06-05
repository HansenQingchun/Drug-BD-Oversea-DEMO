import { dimensions, scoreColor } from '../data/dimensions'

export default function ScoreCard({ scores, rationale, evidence }) {
  return (
    <div className="space-y-3">
      {dimensions.map((d) => {
        const v = scores[d.id] ?? 0
        return (
          <div key={d.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900">{d.name}</span>
                <span className="ml-2 text-xs text-slate-400">{d.desc}</span>
              </div>
              <span className={`text-lg font-bold ${scoreColor(v)}`}>{v}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${v}%` }}
              />
            </div>
            {rationale?.[d.id] && (
              <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">{rationale[d.id]}</p>
            )}
            {evidence?.[d.id] && (
              <p className="mt-1.5 text-[11px] italic leading-snug text-slate-400">
                来源：{evidence[d.id]}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
