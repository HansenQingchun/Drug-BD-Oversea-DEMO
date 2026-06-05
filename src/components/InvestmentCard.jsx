import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RotateCcw,
  UserCircle2,
} from 'lucide-react'
import { investmentLabel, investorStances } from '../data/dimensions'

const riskColor = {
  低: 'text-emerald-600',
  中等: 'text-amber-600',
  中高: 'text-orange-600',
  高: 'text-rose-600',
}

export default function InvestmentCard({ inv, min, max, adjusted, investor }) {
  const lo = min ?? inv.min
  const hi = max ?? inv.max
  return (
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-800">
          <Wallet className="h-4 w-4" />
          启星智谷投资建议
        </div>
        {adjusted && adjusted.dir !== 0 && (
          <span
            className={`chip ${adjusted.dir > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
          >
            {adjusted.dir > 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            已动态调整
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold text-brand-700">{investmentLabel(lo, hi)}</div>
      {adjusted && adjusted.dir !== 0 && (
        <div className="mt-1 text-xs text-slate-400">原区间 {investmentLabel(inv.min, inv.max)}</div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Layers className="mt-0.5 h-4 w-4 text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">投资结构</div>
            <div className="font-medium text-slate-700">{inv.stage}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">风险等级</div>
            <div className={`font-medium ${riskColor[inv.risk] || 'text-slate-700'}`}>{inv.risk}</div>
          </div>
        </div>
        <div className="col-span-2 flex items-start gap-2">
          <TrendingUp className="mt-0.5 h-4 w-4 text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">预期价值</div>
            <div className="font-medium text-slate-700">{inv.enpv}</div>
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-white/70 p-3 text-[13px] leading-relaxed text-slate-600">
        {inv.note}
      </p>

      {/* 投资人专业意见 */}
      {investor && (
        <div className="mt-4 rounded-xl border border-dashed border-brand-300 bg-white/60 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-800">
            <UserCircle2 className="h-4 w-4" />
            投资人专业意见
          </div>

          {investor.ops.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {investor.ops.map((op, i) => {
                const tone = investorStances.find((s) => s.id === op.stance)?.tone || 'text-slate-600'
                return (
                  <li key={i} className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-[12px]">
                    <span className="font-medium text-slate-700">{op.name}</span>
                    <span className={`ml-1.5 font-semibold ${tone}`}>{op.stance}</span>
                    {op.note && <span className="block text-slate-500">{op.note}</span>}
                  </li>
                )
              })}
            </ul>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <input
              className="input !py-1.5 text-xs sm:w-28"
              placeholder="投资人 / 机构"
              value={investor.draft.name}
              onChange={(e) => investor.setDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <select
              className="input !w-auto !py-1.5 text-xs"
              value={investor.draft.stance}
              onChange={(e) => investor.setDraft((d) => ({ ...d, stance: e.target.value }))}
            >
              {investorStances.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}（×{s.factor}）
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="input mt-2 min-h-[52px] text-xs"
            placeholder="输入投资人意见…（提交后直接调整投资区间）"
            value={investor.draft.note}
            onChange={(e) => investor.setDraft((d) => ({ ...d, note: e.target.value }))}
          />
          <div className="mt-2 flex items-center gap-2">
            <button className="btn-primary !py-1.5 text-xs" onClick={investor.add}>
              <Plus className="h-3.5 w-3.5" />
              提交并调整
            </button>
            {investor.ops.length > 0 && (
              <button className="btn-ghost !py-1.5 text-xs" onClick={investor.reset}>
                <RotateCcw className="h-3.5 w-3.5" />
                重置
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
