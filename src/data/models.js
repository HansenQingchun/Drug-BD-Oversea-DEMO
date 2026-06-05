// 可选大模型（Deep Research 模式）
export const models = [
  { id: 'gpt-5.5', name: 'GPT-5.5', vendor: 'OpenAI', strength: '综合推理与长文档分析', badge: '推荐' },
  { id: 'claude-opus-4.8', name: 'Claude Opus 4.8', vendor: 'Anthropic', strength: '深度研究与严谨论证', badge: '推荐' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', vendor: 'Google', strength: '多模态与海量检索', badge: '' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', vendor: 'DeepSeek', strength: '中文医药语料与成本优势', badge: '' },
  { id: 'qwen-max', name: 'Qwen-Max', vendor: '阿里通义', strength: '中文监管/CDE 语境', badge: '' },
]

export const researchDepths = [
  { id: 'fast', name: '快速', desc: '核心来源速览，约数分钟', sources: '6-10 来源' },
  { id: 'standard', name: '标准', desc: '多源交叉验证，平衡深度与速度', sources: '15-25 来源' },
  { id: 'deep', name: '深度', desc: '全维度 Deep Research，最完整', sources: '40+ 来源' },
]

// Deep Research 模拟执行阶段
export const researchStages = [
  { id: 'lit', label: '文献检索与去重', detail: '检索 PubMed / Embase / 预印本，提取关键证据' },
  { id: 'target', label: '靶点验证', detail: 'Open Targets 关联评分 + gnomAD/ClinVar 安全性约束' },
  { id: 'clinical', label: '临床竞争格局', detail: 'ClinicalTrials.gov / Citeline 管线与入排标准对比' },
  { id: 'regulatory', label: '监管路径分析', detail: 'FDA / EMA / PMDA / NMPA 审评先例与特殊通道' },
  { id: 'commercial', label: '商业生存力', detail: '未满足需求、市场规模与峰值销售预测' },
  { id: 'global', label: '出海适配评估', detail: '目的地选择、差异化与 FTO 风险' },
  { id: 'synth', label: '综合打分与投资建议', detail: '多维融合，生成启星智谷投资区间' },
]
