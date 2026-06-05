import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Circle } from 'lucide-react'
import { researchStages } from '../data/models'

// 模拟 Deep Research 分步进度；完成后调用 onDone
export default function ResearchProgress({ model, depth, onDone }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (current >= researchStages.length) {
      const t = setTimeout(onDone, 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCurrent((c) => c + 1), 850)
    return () => clearTimeout(t)
  }, [current, onDone])

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
        Deep Research 进行中
      </div>
      <p className="mt-1 text-xs text-slate-500">
        模型：{model} · 研究深度：{depth} · 正在多源检索与交叉验证
      </p>

      <div className="mt-5 space-y-3">
        {researchStages.map((s, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={s.id} className="flex items-start gap-3">
              {done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
              ) : active ? (
                <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-brand-600" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 text-slate-300" />
              )}
              <div>
                <div
                  className={`text-sm font-medium ${
                    done ? 'text-slate-900' : active ? 'text-brand-700' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </div>
                {(active || done) && (
                  <div className="text-xs text-slate-500">{s.detail}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500"
          style={{ width: `${(current / researchStages.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
