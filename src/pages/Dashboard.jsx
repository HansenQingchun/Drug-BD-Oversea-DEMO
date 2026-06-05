import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowUpDown, Target, Activity, MapPin } from 'lucide-react'
import { mockDrugs } from '../data/mockDrugs'
import { ratingFromScore, scoreColor } from '../data/dimensions'

function Stat({ label, value, sub }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const nav = useNavigate()
  const [sortKey, setSortKey] = useState('overall')
  const [indication, setIndication] = useState('全部')

  const indications = ['全部', ...new Set(mockDrugs.map((d) => d.indication))]

  const drugs = useMemo(() => {
    let list = [...mockDrugs]
    if (indication !== '全部') list = list.filter((d) => d.indication === indication)
    list.sort((a, b) => (sortKey === 'overall' ? b.overall - a.overall : a.phase.localeCompare(b.phase)))
    return list
  }, [sortKey, indication])

  const recommended = mockDrugs.filter((d) => d.overall >= 68).length
  const avg = Math.round(mockDrugs.reduce((s, d) => s + d.overall, 0) / mockDrugs.length)
  const dests = new Set(mockDrugs.map((d) => d.destination)).size

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">出海管线看板</h1>
          <p className="mt-1 text-sm text-slate-500">候选出海管线药物的评分、目的地与投资建议总览</p>
        </div>
        <button className="btn-primary" onClick={() => nav('/assess')}>
          <Plus className="h-4 w-4" />
          新建评估
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="候选管线" value={mockDrugs.length} sub="个药物" />
        <Stat label="推荐投资" value={recommended} sub="评分 ≥ 68" />
        <Stat label="平均评分" value={avg} sub="综合得分" />
        <Stat label="覆盖目的地" value={dests} sub="出海市场" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">适应症</span>
          <select className="input !w-auto !py-1.5 text-xs" value={indication} onChange={(e) => setIndication(e.target.value)}>
            {indications.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>
        <button
          className="btn-ghost !py-1.5 text-xs"
          onClick={() => setSortKey((k) => (k === 'overall' ? 'phase' : 'overall'))}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          按{sortKey === 'overall' ? '评分' : '阶段'}排序
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {drugs.map((d) => {
          const rating = ratingFromScore(d.overall)
          return (
            <button
              key={d.id}
              onClick={() => nav(`/report/${d.id}`)}
              className="card group p-5 text-left transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
                  {d.name}
                </h3>
                <span className={`text-2xl font-bold ${scoreColor(d.overall)}`}>{d.overall}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" /> 靶点：{d.target}
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> {d.indication} · {d.phase}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> 推荐目的地：{d.destination}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`chip border ${rating.color}`}>{rating.label}</span>
                <span className="text-xs text-slate-400">{d.company}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
