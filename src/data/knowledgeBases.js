// 知识库技能定义 —— 源自《药物研发立项决策支持》分层数据接入策略
export const knowledgeBases = [
  // 基础层
  { id: 'pubmed', name: 'PubMed', category: '文献', tier: '基础', desc: '生物医学核心同行评审文献', default: true },
  { id: 'clinicaltrials', name: 'ClinicalTrials.gov', category: '临床', tier: '基础', desc: '全球临床试验登记与状态追踪', default: true },
  { id: 'biorxiv', name: 'bioRxiv / medRxiv', category: '预印本', tier: '基础', desc: '最新预印本，捕捉前沿信号', default: true },
  { id: 'opentargets', name: 'Open Targets', category: '靶点', tier: '基础', desc: '靶点-疾病关联评分（行业金标准）', default: true },
  { id: 'chembl', name: 'ChEMBL', category: '化学', tier: '基础', desc: '生物活性与成药性数据', default: true },

  // 增强层
  { id: 'gnomad', name: 'gnomAD / ClinVar', category: '遗传安全', tier: '增强', desc: '遗传约束与变异临床解释，预判毒性', default: true },
  { id: 'citeline', name: 'Citeline (Pharmaprojects/Trialtrove)', category: '竞争情报', tier: '增强', desc: '在研管线与高颗粒度临床细节', default: true },
  { id: 'cortellis', name: 'Cortellis', category: '监管情报', tier: '增强', desc: '全球监管审评、政策与先例', default: false },
  { id: 'embase', name: 'Embase', category: '文献', tier: '增强', desc: '会议摘要等灰色文献，早于期刊 1-2 年', default: false },
  { id: 'reaxys', name: 'Reaxys', category: '化学', tier: '增强', desc: '逆合成分析与 CMC 可行性', default: false },
  { id: 'derwent', name: 'Derwent Innovation', category: '知识产权', tier: '增强', desc: 'FTO 与专利景观分析', default: false },

  // 战略层
  { id: 'nmpa', name: 'NMPA / CDE', category: '中国监管', tier: '战略', desc: '中国临床登记与审评态度', default: true },
  { id: 'flatiron', name: 'Flatiron / UK Biobank', category: '真实世界', tier: '战略', desc: 'RWE 定义未满足需求与合成对照臂', default: false },
  { id: 'iqvia', name: 'IQVIA MIDAS', category: '商业销售', tier: '战略', desc: '95 国药品销售与峰值销售预测', default: false },
]

export const tierColors = {
  基础: 'bg-brand-50 text-brand-700 border-brand-200',
  增强: 'bg-accent-400/10 text-accent-600 border-accent-400/30',
  战略: 'bg-amber-50 text-amber-700 border-amber-200',
}
