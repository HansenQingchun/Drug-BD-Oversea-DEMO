import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, BookOpen, Cpu, UserCog, Plus, X, Sparkles, FileText } from 'lucide-react'
import { knowledgeBases, tierColors } from '../data/knowledgeBases'
import { models, researchDepths } from '../data/models'
import { dimensions } from '../data/dimensions'
import ResearchProgress from '../components/ResearchProgress'

const frameworkPoints = [
  '科学有效性：靶点-疾病关联是否经遗传学/药理学强验证',
  '临床可行性：是否存在可行的临床开发路径与现实招募',
  '监管顺应性：安全性是否符合监管风险获益标准',
  '商业生存力：是否具备差异化竞争优势与未满足需求',
]

function Section({ icon: Icon, title, desc, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-600" />
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      {desc && <p className="mt-1 text-xs text-slate-500">{desc}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function NewAssessment() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    name: '',
    target: '',
    indication: '',
    phase: 'II 期',
    modality: '小分子',
    company: '',
    desc: '',
  })
  const [selectedKb, setSelectedKb] = useState(
    () => new Set(knowledgeBases.filter((k) => k.default).map((k) => k.id))
  )
  const [model, setModel] = useState(models[1].id)
  const [depth, setDepth] = useState('deep')
  const [experts, setExperts] = useState([{ name: '', view: '' }])
  const [running, setRunning] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggleKb = (id) =>
    setSelectedKb((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const updateExpert = (i, k, v) =>
    setExperts((e) => e.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)))

  const modelName = models.find((m) => m.id === model)?.name
  const depthName = researchDepths.find((d) => d.id === depth)?.name

  if (running) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-5 text-2xl font-bold text-slate-900">正在评估 {form.name || '候选药物'}</h1>
        <ResearchProgress
          model={modelName}
          depth={depthName}
          onDone={() => nav('/report/qx-101')}
        />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">新建出海管线评估</h1>
      <p className="mt-1 text-sm text-slate-500">
        录入药物信息，选择知识库与大模型，启动 Deep Research 多维评估
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* 药物信息 */}
          <Section icon={FlaskConical} title="药物信息" desc="候选出海管线药物的基本信息与描述">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">药物名称 / 代号</label>
                <input className="input" value={form.name} onChange={set('name')} placeholder="如 QX-101" />
              </div>
              <div>
                <label className="label">靶点</label>
                <input className="input" value={form.target} onChange={set('target')} placeholder="如 BCL-2" />
              </div>
              <div>
                <label className="label">适应症</label>
                <input className="input" value={form.indication} onChange={set('indication')} placeholder="如 R/R CLL" />
              </div>
              <div>
                <label className="label">原厂家 / 来源</label>
                <input className="input" value={form.company} onChange={set('company')} placeholder="如 苏州新元生物" />
              </div>
              <div>
                <label className="label">研发阶段</label>
                <select className="input" value={form.phase} onChange={set('phase')}>
                  {['临床前', 'I 期', 'II 期', 'III 期', 'NDA/BLA'].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">药物类型</label>
                <select className="input" value={form.modality} onChange={set('modality')}>
                  {['小分子', '单克隆抗体', '双特异性抗体', 'ADC', '细胞治疗', '核酸药物', '多肽'].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="label">药物描述 / 作用机制</label>
              <textarea
                className="input min-h-[88px]"
                value={form.desc}
                onChange={set('desc')}
                placeholder="简述作用机制、差异化亮点、现有数据等"
              />
            </div>
          </Section>

          {/* 知识库技能 */}
          <Section icon={BookOpen} title="知识库技能" desc="选择用于审核的公开/专业数据库（来自立项决策框架）">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {knowledgeBases.map((kb) => {
                const on = selectedKb.has(kb.id)
                return (
                  <button
                    key={kb.id}
                    onClick={() => toggleKb(kb.id)}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
                      on ? 'border-brand-300 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        on ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                      }`}
                    >
                      {on && <span className="h-1.5 w-1.5 rounded-sm bg-white" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-800">{kb.name}</span>
                        <span className={`chip border text-[10px] ${tierColors[kb.tier]}`}>{kb.tier}</span>
                      </span>
                      <span className="block text-xs text-slate-500">{kb.desc}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 text-xs text-slate-400">已选 {selectedKb.size} 个知识库</div>
          </Section>

          {/* 科学家意见 */}
          <Section icon={UserCog} title="科学家手工录入意见" desc="支持多位专家意见，与 AI 评估融合">
            <div className="space-y-3">
              {experts.map((ex, i) => (
                <div key={i} className="flex flex-wrap gap-2">
                  <input
                    className="input sm:w-40"
                    placeholder="专家 / 角色"
                    value={ex.name}
                    onChange={(e) => updateExpert(i, 'name', e.target.value)}
                  />
                  <input
                    className="input flex-1"
                    placeholder="意见与评级"
                    value={ex.view}
                    onChange={(e) => updateExpert(i, 'view', e.target.value)}
                  />
                  {experts.length > 1 && (
                    <button
                      className="btn-ghost !px-2.5"
                      onClick={() => setExperts((e) => e.filter((_, idx) => idx !== i))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              className="btn-ghost mt-3 !py-1.5 text-xs"
              onClick={() => setExperts((e) => [...e, { name: '', view: '' }])}
            >
              <Plus className="h-3.5 w-3.5" />
              添加专家意见
            </button>
          </Section>
        </div>

        {/* 右栏 */}
        <div className="space-y-5">
          {/* 大模型 */}
          <Section icon={Cpu} title="大模型 · Deep Research" desc="选择模型与研究深度">
            <label className="label">模型</label>
            <select className="input" value={model} onChange={(e) => setModel(e.target.value)}>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.vendor}
                  {m.badge ? ` (${m.badge})` : ''}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              {models.find((m) => m.id === model)?.strength}
            </p>

            <label className="label mt-4">研究深度</label>
            <div className="space-y-2">
              {researchDepths.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDepth(d.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                    depth === d.id ? 'border-brand-300 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    <span className="text-sm font-medium text-slate-800">{d.name}</span>
                    <span className="block text-xs text-slate-500">{d.desc}</span>
                  </span>
                  <span className="chip bg-slate-100 text-slate-500">{d.sources}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* 立项框架引用 */}
          <Section icon={FileText} title="立项决策框架" desc="引用《药物研发立项决策支持》核心维度">
            <ul className="space-y-2">
              {frameworkPoints.map((p, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-snug text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {dimensions.map((d) => (
                <span key={d.id} className="chip bg-slate-100 text-slate-600">
                  {d.name}
                </span>
              ))}
            </div>
          </Section>

          <button className="btn-primary w-full" onClick={() => setRunning(true)}>
            <Sparkles className="h-4 w-4" />
            开始 Deep Research 评估
          </button>
        </div>
      </div>
    </div>
  )
}
