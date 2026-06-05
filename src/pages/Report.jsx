import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Target,
  Activity,
  Building2,
  Cpu,
  CheckSquare,
  Factory,
  Users,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { getDrug } from '../data/mockDrugs'
import {
  ratingFromScore,
  scoreColor,
  ratingTone,
  expertRatings,
  investorStances,
  applyExpertAdjustments,
  overallOf,
} from '../data/dimensions'
import { dimensions } from '../data/dimensions'
import ScoreRadar from '../components/ScoreRadar'
import ScoreCard from '../components/ScoreCard'
import DestinationCard from '../components/DestinationCard'
import InvestmentCard from '../components/InvestmentCard'

const measureColor = {
  临床: 'bg-brand-100 text-brand-700',
  监管: 'bg-violet-100 text-violet-700',
  知识产权: 'bg-amber-100 text-amber-700',
  CMC: 'bg-teal-100 text-teal-700',
  安全: 'bg-rose-100 text-rose-700',
  商业: 'bg-emerald-100 text-emerald-700',
}

function Card({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-600" />
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

export default function Report() {
  const { id } = useParams()
  const nav = useNavigate()
  const drug = getDrug(id)

  const [extraExperts, setExtraExperts] = useState([])
  const [draft, setDraft] = useState({ name: '', rating: '看好', focus: 'all', note: '' })
  const [investorOps, setInvestorOps] = useState([])
  const [investorDraft, setInvestorDraft] = useState({ name: '', stance: '积极加仓', note: '' })

  // 切换药物时重置交互状态
  useEffect(() => {
    setExtraExperts([])
    setDraft({ name: '', rating: '看好', focus: 'all', note: '' })
    setInvestorOps([])
    setInvestorDraft({ name: '', stance: '积极加仓', note: '' })
  }, [id])

  const baseScores = drug?.report?.scores
  const liveScores = useMemo(
    () => (baseScores ? applyExpertAdjustments(baseScores, extraExperts) : {}),
    [baseScores, extraExperts]
  )

  if (!drug) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-600">未找到该药物评估报告。</p>
        <Link to="/" className="btn-primary mt-4">返回看板</Link>
      </div>
    )
  }

  const r = drug.report
  const baseOverall = overallOf(baseScores)
  const liveOverall = overallOf(liveScores)
  const delta = liveOverall - baseOverall
  const rating = ratingFromScore(liveOverall)

  // 投资区间随综合评分（专家）与投资人立场动态调整
  const expertFactor = clamp(1 + delta * 0.025, 0.5, 1.6)
  const investorFactor = clamp(
    investorOps.reduce((f, op) => f * (op.factor ?? 1), 1),
    0.2,
    2.0
  )
  const totalFactor = expertFactor * investorFactor
  const adjMin = r.investment.min * totalFactor
  const adjMax = r.investment.max * totalFactor
  const adjusted = { dir: totalFactor > 1.001 ? 1 : totalFactor < 0.999 ? -1 : 0 }

  const addExpert = () => {
    const meta = expertRatings.find((x) => x.id === draft.rating)
    setExtraExperts((prev) => [
      ...prev,
      {
        name: draft.name.trim() || '匿名专家',
        rating: draft.rating,
        focus: draft.focus,
        note: draft.note.trim(),
        delta: meta?.delta ?? 0,
        custom: true,
      },
    ])
    setDraft({ name: '', rating: '看好', focus: 'all', note: '' })
  }

  const addInvestor = () => {
    const meta = investorStances.find((s) => s.id === investorDraft.stance)
    setInvestorOps((prev) => [
      ...prev,
      {
        name: investorDraft.name.trim() || '投资人',
        stance: investorDraft.stance,
        note: investorDraft.note.trim(),
        factor: meta?.factor ?? 1,
      },
    ])
    setInvestorDraft({ name: '', stance: '积极加仓', note: '' })
  }

  const investor = {
    ops: investorOps,
    draft: investorDraft,
    setDraft: setInvestorDraft,
    add: addInvestor,
    reset: () => setInvestorOps([]),
  }

  const allExperts = [...r.experts, ...extraExperts]

  return (
    <div>
      <button className="btn-ghost mb-5 !py-1.5 text-xs" onClick={() => nav(-1)}>
        <ArrowLeft className="h-3.5 w-3.5" /> 返回
      </button>

      {/* 头部 */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{drug.name}</h1>
              <span className={`chip border ${rating.color}`}>{rating.label}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Target className="h-4 w-4" />{drug.target}</span>
              <span className="flex items-center gap-1.5"><Activity className="h-4 w-4" />{drug.indication} · {drug.phase}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{drug.company} · {drug.origin}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <Cpu className="h-3.5 w-3.5" /> {r.model} · {r.depth} Deep Research · {r.generatedAt}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor(liveOverall)}`}>{liveOverall}</div>
            <div className="text-xs text-slate-400">综合评分</div>
            {delta !== 0 && (
              <div className={`text-xs font-medium ${delta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {delta > 0 ? '+' : ''}
                {delta} （专家调整）
              </div>
            )}
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {drug.summary}
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* 雷达 + 投资 */}
        <div className="space-y-5">
          <Card title="多维评分雷达" icon={Activity}>
            <ScoreRadar scores={liveScores} />
          </Card>
          <InvestmentCard inv={r.investment} min={adjMin} max={adjMax} adjusted={adjusted} investor={investor} />
        </div>

        {/* 维度打分 */}
        <div className="lg:col-span-2">
          <Card title="多维度评估与依据" icon={CheckSquare}>
            <ScoreCard scores={liveScores} rationale={r.rationale} evidence={r.evidence} />
          </Card>
        </div>
      </div>

      {/* 出海目的地 */}
      <div className="mt-5">
        <Card title="出海目的地建议" icon={Target}>
          <div className="grid gap-3 md:grid-cols-3">
            {r.destinations.map((d, i) => (
              <DestinationCard key={i} d={d} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* 厂家建议 */}
        <Card title="厂家与合作建议" icon={Factory}>
          <p className="text-[13px] leading-relaxed text-slate-600">{r.manufacturer.assessment}</p>
          <ul className="mt-3 space-y-2">
            {r.manufacturer.bdSuggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        {/* 需要的措施 */}
        <Card title="需要采取的措施" icon={CheckSquare}>
          <ul className="space-y-2.5">
            {r.measures.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className={`chip ${measureColor[m.type] || 'bg-slate-100 text-slate-600'}`}>{m.type}</span>
                <span className="text-[13px] leading-snug text-slate-700">
                  {m.text}
                  {m.ref && (
                    <span className="ml-1.5 text-[11px] italic text-slate-400">— 来源：{m.ref}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5">
        {/* 专家意见（可交互，醒目化） */}
        <div className="overflow-hidden rounded-2xl border-2 border-brand-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="text-base font-semibold">专家意见整合 · 实时影响评分与投资建议</h2>
            </div>
            <span className="chip bg-white/20 text-white">人机协同</span>
          </div>
          <div className="p-5">
            <div className="grid gap-3 md:grid-cols-2">
              {allExperts.map((ex, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 ${
                    ex.custom ? 'border-brand-300 bg-brand-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">
                      {ex.name} {ex.role && <span className="text-xs text-slate-400">· {ex.role}</span>}
                      {ex.custom && <span className="ml-1.5 text-[10px] text-brand-600">（新录入）</span>}
                    </span>
                    <span className={`text-xs font-semibold ${ratingTone[ex.rating] || 'text-slate-500'}`}>
                      {ex.rating}
                      {ex.custom && ex.focus && ex.focus !== 'all' && (
                        <span className="ml-1 text-[10px] text-slate-400">
                          · {dimensions.find((d) => d.id === ex.focus)?.short}
                        </span>
                      )}
                    </span>
                  </div>
                  {ex.note && <p className="mt-1.5 text-[13px] leading-snug text-slate-600">{ex.note}</p>}
                </div>
              ))}
            </div>

            {/* 录入表单 */}
            <div className="mt-4 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-4">
              <div className="mb-2 text-sm font-semibold text-slate-800">录入您的专业意见</div>
              <div className="flex flex-wrap gap-2">
                <input
                  className="input sm:w-40"
                  placeholder="专家 / 角色"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
                <select
                  className="input !w-auto"
                  value={draft.rating}
                  onChange={(e) => setDraft((d) => ({ ...d, rating: e.target.value }))}
                >
                  {expertRatings.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.id}（{x.delta > 0 ? '+' : ''}{x.delta}）
                    </option>
                  ))}
                </select>
                <select
                  className="input !w-auto"
                  value={draft.focus}
                  onChange={(e) => setDraft((d) => ({ ...d, focus: e.target.value }))}
                >
                  <option value="all">影响全部维度</option>
                  {dimensions.map((d) => (
                    <option key={d.id} value={d.id}>
                      侧重 {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                className="input mt-2 min-h-[64px]"
                placeholder="输入您的专业意见…（提交后将动态调整评分与投资建议）"
                value={draft.note}
                onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
              />
              <div className="mt-2 flex items-center gap-2">
                <button className="btn-primary !py-2 text-sm" onClick={addExpert}>
                  <Plus className="h-4 w-4" />
                  提交意见并重新评估
                </button>
                {extraExperts.length > 0 && (
                  <button className="btn-ghost !py-2 text-sm" onClick={() => setExtraExperts([])}>
                    <RotateCcw className="h-4 w-4" />
                    重置
                  </button>
                )}
              </div>
              {extraExperts.length > 0 && (
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  已纳入 {extraExperts.length} 条新意见，综合评分 {baseOverall} → {liveOverall}，投资区间已同步调整。
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        本报告由启星智谷 · 药物出海评估平台基于多源数据库与 Deep Research 综合生成，供投资决策内部参考，不构成最终投资承诺。
      </p>
    </div>
  )
}
