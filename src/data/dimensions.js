// 评估维度定义 —— 对齐立项决策框架（科学/临床/监管/商业）+ 出海扩展
export const dimensions = [
  { id: 'science', name: '科学有效性', short: '科学', desc: '靶点-疾病关联的遗传学/药理学强验证程度' },
  { id: 'clinical', name: '临床可行性', short: '临床', desc: '临床开发路径、入排可行性与终点设置' },
  { id: 'regulatory', name: '监管顺应性', short: '监管', desc: '安全性特征与监管风险获益、特殊通道可得性' },
  { id: 'commercial', name: '商业生存力', short: '商业', desc: '未满足需求、差异化竞争与市场回报' },
  { id: 'ip', name: '知识产权 / FTO', short: 'IP', desc: '专利新颖性与实施自由度' },
  { id: 'global', name: '出海适配性', short: '出海', desc: '目的地监管契合、竞争格局与跨境执行难度' },
]

// 综合评分 → 投资建议标签
export function ratingFromScore(score) {
  if (score >= 80) return { label: '强烈推荐', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
  if (score >= 68) return { label: '推荐投资', color: 'bg-brand-100 text-brand-700 border-brand-200' }
  if (score >= 55) return { label: '审慎观察', color: 'bg-amber-100 text-amber-700 border-amber-200' }
  return { label: '暂不推荐', color: 'bg-rose-100 text-rose-700 border-rose-200' }
}

export function scoreColor(score) {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 68) return 'text-brand-600'
  if (score >= 55) return 'text-amber-600'
  return 'text-rose-600'
}

// 将「万元」金额格式化为中文（≥1 亿显示「亿元」）
export function formatWan(wan) {
  const v = Math.max(0, Math.round(wan))
  if (v >= 10000) {
    const yi = v / 10000
    const s = Number.isInteger(yi) ? yi.toString() : yi.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
    return `${s} 亿元`
  }
  return `${v.toLocaleString('zh-CN')} 万元`
}

export function investmentLabel(min, max) {
  return `人民币 ${formatWan(min)} – ${formatWan(max)}`
}

// 专家意见评级 → 情绪分值（用于动态调整评分）
export const expertRatings = [
  { id: '强烈看好', delta: 6, tone: 'text-emerald-600' },
  { id: '看好', delta: 3, tone: 'text-emerald-600' },
  { id: '谨慎乐观', delta: 1.5, tone: 'text-emerald-600' },
  { id: '中性', delta: 0, tone: 'text-slate-500' },
  { id: '谨慎', delta: -3, tone: 'text-amber-600' },
  { id: '负面', delta: -6, tone: 'text-rose-600' },
]

export const ratingTone = {
  看好: 'text-emerald-600',
  谨慎乐观: 'text-emerald-600',
  强烈看好: 'text-emerald-600',
  中性偏好: 'text-brand-600',
  中性: 'text-slate-500',
  谨慎: 'text-amber-600',
  担忧: 'text-rose-600',
  负面: 'text-rose-600',
}

// 投资人立场 → 投资金额调整系数
export const investorStances = [
  { id: '积极加仓', factor: 1.25, tone: 'text-emerald-600' },
  { id: '维持建议', factor: 1.0, tone: 'text-brand-600' },
  { id: '适度参与', factor: 0.85, tone: 'text-amber-600' },
  { id: '保守减仓', factor: 0.6, tone: 'text-orange-600' },
  { id: '暂缓投资', factor: 0.2, tone: 'text-rose-600' },
]

const clamp = (n, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n))

// 依据额外专家意见，对基础评分做动态调整
// focus = 维度 id 时重点影响该维度，'all' 时均匀影响全部维度
export function applyExpertAdjustments(baseScores, extraExperts) {
  const totalDelta = extraExperts.reduce((s, e) => s + (e.delta || 0), 0)
  const focused = {}
  extraExperts.forEach((e) => {
    if (e.focus && e.focus !== 'all') focused[e.focus] = (focused[e.focus] || 0) + e.delta * 1.5
  })
  const adjusted = {}
  for (const d of dimensions) {
    const uniform = totalDelta // 整体情绪影响所有维度
    adjusted[d.id] = Math.round(clamp(baseScores[d.id] + uniform + (focused[d.id] || 0)))
  }
  return adjusted
}

export function overallOf(scores) {
  const vals = dimensions.map((d) => scores[d.id] ?? 0)
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}
