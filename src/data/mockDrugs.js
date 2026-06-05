// 候选出海管线药物 + 完整评估报告（演示用模拟数据）
// 每个 report.scores 的 key 对应 dimensions.js 中的 id
// report.evidence[dim] = 该维度依据的引用来源（小字展示）
// report.investment.min/max = 投资区间（单位：万元，用于动态计算）

export const mockDrugs = [
  {
    id: 'qx-101',
    name: 'QX-101 (注射用 BCL-2 抑制剂)',
    target: 'BCL-2',
    indication: '复发难治性慢性淋巴细胞白血病 (R/R CLL)',
    modality: '小分子',
    phase: 'II 期',
    company: '苏州新元生物',
    origin: '中国 · 自主研发',
    overall: 84,
    destination: '美国 (FDA)',
    summary:
      '靶点经遗传学与药理学双重强验证，II 期 ORR 数据优于现有标准治疗，差异化在于更低的肿瘤溶解综合征风险；建议优先以 FDA 突破性疗法通道出海。',
    report: {
      generatedAt: '2026-06-04',
      model: 'Claude Opus 4.8',
      depth: '深度',
      scores: {
        science: 88,
        clinical: 82,
        regulatory: 80,
        commercial: 86,
        ip: 78,
        global: 88,
      },
      rationale: {
        science:
          'Open Targets 中 BCL-2 与 CLL 关联评分 0.82（遗传学 + 体细胞突变 + 已知药物多源支持）；gnomAD 显示靶点功能缺失高度约束但已有上市同类药验证可控，靶点可信度高。',
        clinical:
          'II 期单臂 78 例 ORR 76%，CR 28%，与维奈克拉真实世界基线相当；入排标准清晰、招募可行。需补充头对头或合成对照臂以强化疗效证据。',
        regulatory:
          '安全性特征中肿瘤溶解综合征(TLS)发生率低于同类，符合 FDA 风险获益预期；具备申请突破性疗法资格的先例（Cortellis 监管先例 3 例）。',
        commercial:
          'CLL 二线以上仍存在耐药未满足需求，IQVIA 预测同类峰值销售 >20 亿美元；差异化的低 TLS 给药便利性构成支付方价值主张。',
        ip:
          'SciFinder 新颖性检索显示母核结构未落入主要竞品 Markush 范围；但需 Derwent FTO 深度确认 2 项变构调节剂专利边界。',
        global:
          '美国 CLL 市场成熟、支付能力强，FDA 对低 TLS 差异化接受度高；EMA 可作第二梯队。中国 CDE 数据可部分桥接，降低重复临床成本。',
      },
      evidence: {
        science: 'Open Targets · gnomAD/ClinVar',
        clinical: 'ClinicalTrials.gov NCT0XXXXX01 · PubMed',
        regulatory: 'Cortellis 监管先例 · FDA 指南',
        commercial: 'IQVIA MIDAS · GlobalData',
        ip: 'SciFinder-n · Derwent Innovation',
        global: 'NMPA/CDE · FDA',
      },
      destinations: [
        {
          region: '美国 FDA',
          fit: '首选',
          pathway: '突破性疗法 (BTD) + 加速批准',
          rationale: '差异化安全性契合 FDA 风险获益框架；CLL 支付能力强、学术影响力大。',
          competition: '维奈克拉占主导，二线耐药市场仍有空间',
        },
        {
          region: '欧盟 EMA',
          fit: '次选',
          pathway: 'PRIME + 集中审评',
          rationale: '可复用 FDA 数据包，定价受 HTA 约束但患者基数大。',
          competition: '中等，需 HTA 证据强化',
        },
        {
          region: '日本 PMDA',
          fit: '观察',
          pathway: '桥接试验 / Sakigake',
          rationale: '需补充东亚人群 PK，市场较小但溢价能力强。',
          competition: '较低',
        },
      ],
      manufacturer: {
        assessment:
          '苏州新元生物具备完整 CMC 与 II 期执行能力，但缺乏美国注册与商业化经验，建议引入有 FDA 申报经验的合作方或 CRO。',
        bdSuggestions: [
          '与具备血液肿瘤商业化网络的中型 Biotech 进行海外权益授权 (license-out)',
          '保留大中华区权益，仅授权北美/欧盟，最大化启星智谷分成',
          '引入有 BTD 申报经验的监管顾问团队',
        ],
      },
      measures: [
        { type: '临床', text: '设计合成对照臂或头对头试验，强化相对疗效证据', ref: 'Flatiron RWE · ClinicalTrials.gov' },
        { type: '监管', text: '启动 FDA Pre-IND/Type B 会议，争取突破性疗法资格', ref: 'Cortellis · FDA 指南' },
        { type: '知识产权', text: '委托 Derwent 完成北美/欧盟 FTO 与专利景观分析', ref: 'Derwent Innovation · SciFinder-n' },
        { type: 'CMC', text: '建立符合 FDA 要求的商业化生产批次与稳定性数据', ref: 'ICH Q 系列指南' },
      ],
      investment: {
        min: 8000,
        max: 12000,
        stage: 'II 期里程碑分期注资',
        risk: '中等',
        enpv: 'ENPV 预估 6.5 – 9 亿元（PoS 调整后）',
        note: '建议以里程碑触发的分期投资结构，绑定 FDA BTD 取得与 III 期启动节点。',
      },
      experts: [
        { name: '张明 教授', role: '血液肿瘤 PI', rating: '看好', note: '低 TLS 差异化在临床实操中价值显著，但需关注长期耐药数据。' },
        { name: '李珂 博士', role: '监管事务', rating: '中性偏好', note: 'BTD 可行，但加速批准后确证性试验承诺需提前规划。' },
      ],
      citations: [
        { source: 'Open Targets', detail: 'BCL-2 ↔ CLL association score 0.82' },
        { source: 'ClinicalTrials.gov', detail: 'NCT0XXXXX01 Phase II 单臂 78 例' },
        { source: 'PubMed', detail: 'Venetoclax R/R CLL 真实世界 ORR 基线综述' },
        { source: 'gnomAD', detail: 'BCL-2 pLI 约束分析' },
        { source: 'IQVIA MIDAS', detail: 'CLL 同类药峰值销售预测 >$2B' },
      ],
    },
  },
  {
    id: 'qx-202',
    name: 'QX-202 (双特异性抗体 PD-1×VEGF)',
    target: 'PD-1 × VEGF',
    indication: '一线非小细胞肺癌 (NSCLC)',
    modality: '双特异性抗体',
    phase: 'III 期',
    company: '广州合源制药',
    origin: '中国 · 自主研发',
    overall: 71,
    destination: '欧盟 (EMA)',
    summary:
      '赛道拥挤但 III 期 PFS 数据具竞争力；FDA 对 PD-1×VEGF 双抗审评趋严，建议优先以 EMA + 新兴市场出海，并强化东西方人群一致性证据。',
    report: {
      generatedAt: '2026-06-04',
      model: 'GPT-5.5',
      depth: '标准',
      scores: {
        science: 76,
        clinical: 78,
        regulatory: 62,
        commercial: 74,
        ip: 66,
        global: 68,
      },
      rationale: {
        science:
          'PD-1 与 VEGF 通路协同机制明确，Open Targets 关联证据充分；但双抗机制可解释性仍依赖更多转化医学数据支撑。',
        clinical:
          'III 期 mPFS 优于含铂化疗对照（HR 0.61），但 OS 数据尚未成熟；入排以亚洲人群为主，全球人群代表性不足。',
        regulatory:
          'FDA 近期对中国单一来源数据与 PD-1×VEGF 双抗审评趋严，存在要求多区域临床(MRCT)的风险，监管不确定性较高。',
        commercial:
          'NSCLC 一线市场规模巨大，但 PD-1×VEGF 赛道竞争白热化（多家进入 III 期），差异化窗口收窄。',
        ip:
          '双抗结构专利存在与头部竞品交叉风险，需 Derwent FTO 明确侵权边界，IP 风险中等偏高。',
        global:
          'EMA 与新兴市场(中东、拉美、东南亚)对中国数据接受度更高，作为首发更稳妥；美国宜待 OS 成熟后再评估。',
      },
      evidence: {
        science: 'Open Targets · PubMed',
        clinical: 'ClinicalTrials.gov NCT0XXXXX02 · Citeline Trialtrove',
        regulatory: 'Cortellis 审评先例 · FDA',
        commercial: 'Citeline Pharmaprojects · GlobalData',
        ip: 'Derwent Innovation · SciFinder-n',
        global: 'EMA · NMPA/CDE',
      },
      destinations: [
        {
          region: '欧盟 EMA',
          fit: '首选',
          pathway: '集中审评 + MRCT 补充',
          rationale: '对桥接数据更友好，定价虽受限但可建立全球信誉。',
          competition: '高，但仍有差异化空间',
        },
        {
          region: '新兴市场',
          fit: '首选',
          pathway: '依托 EMA/WHO PQ 快速注册',
          rationale: '中东、东南亚支付能力上升、竞争较少、可快速放量。',
          competition: '低',
        },
        {
          region: '美国 FDA',
          fit: '审慎',
          pathway: 'MRCT + OS 终点',
          rationale: '需补充全球多区域数据，时间与成本高，待 OS 成熟再推进。',
          competition: '极高',
        },
      ],
      manufacturer: {
        assessment:
          '广州合源具备双抗 CMC 与 III 期能力，海外商业化与 MRCT 经验有限，全球化执行是主要短板。',
        bdSuggestions: [
          '与 MNC 就 NSCLC 全球权益进行共同开发 (co-development)',
          '在欧盟/新兴市场自主或区域伙伴落地，美国权益单独授权',
          '尽快补充多区域临床以满足 FDA 预期',
        ],
      },
      measures: [
        { type: '临床', text: '启动多区域 III 期(MRCT)，补充非亚洲人群数据', ref: 'ClinicalTrials.gov · Citeline' },
        { type: '临床', text: '加速 OS 数据成熟与亚组分析', ref: 'Trialtrove · PubMed' },
        { type: '监管', text: '与 EMA 召开科学建议会议(Scientific Advice)', ref: 'Cortellis · EMA 指南' },
        { type: '知识产权', text: 'Derwent 双抗结构 FTO 与规避设计评估', ref: 'Derwent Innovation' },
      ],
      investment: {
        min: 15000,
        max: 25000,
        stage: 'III 期 + MRCT 联合注资',
        risk: '中高',
        enpv: 'ENPV 预估 8 – 14 亿元（赛道竞争折让后）',
        note: '建议绑定 OS 中期分析与 EMA 受理双里程碑，竞争加剧时设置退出条款。',
      },
      experts: [
        { name: '王立 教授', role: '胸部肿瘤 PI', rating: '中性', note: 'PFS 亮眼但赛道太挤，OS 是关键胜负手。' },
        { name: '陈薇 博士', role: '全球注册', rating: '谨慎', note: 'FDA 对单一来源数据态度趋严，MRCT 几乎不可避免。' },
      ],
      citations: [
        { source: 'ClinicalTrials.gov', detail: 'NCT0XXXXX02 Phase III mPFS HR 0.61' },
        { source: 'Citeline Trialtrove', detail: 'PD-1×VEGF 赛道在研管线 9 项' },
        { source: 'Cortellis', detail: 'FDA 近期对中国单源数据审评趋严先例' },
        { source: 'Embase', detail: 'ASCO 会议摘要双抗安全性信号' },
      ],
    },
  },
  {
    id: 'qx-303',
    name: 'QX-303 (口服 GLP-1/GIP 双激动剂)',
    target: 'GLP-1R / GIPR',
    indication: '2 型糖尿病合并肥胖',
    modality: '小分子口服',
    phase: 'I 期',
    company: '杭州康卫医药',
    origin: '中国 · 授权引进 + 改良',
    overall: 58,
    destination: '待定 / 风险观察',
    summary:
      '代谢赛道商业潜力极高，但口服双激动剂竞争极度拥挤、头部 MNC 领先明显；当前仅 I 期、靶点拥挤，建议审慎观察，待 PoC 数据再决策。',
    report: {
      generatedAt: '2026-06-04',
      model: 'DeepSeek V3',
      depth: '标准',
      scores: {
        science: 72,
        clinical: 54,
        regulatory: 58,
        commercial: 80,
        ip: 44,
        global: 48,
      },
      rationale: {
        science:
          'GLP-1/GIP 双激动机制经临床充分验证(以注射剂为代表)，科学基础扎实；口服小分子的暴露量与肝毒性窗口仍是关键未知。',
        clinical:
          '仅 I 期、样本量小，减重 PoC 数据尚未读出；临床可行性证据不足，开发路径长、失败风险高。',
        regulatory:
          '代谢慢病监管路径成熟但要求长期心血管结局(CVOT)，监管成本高、周期长。',
        commercial:
          '减重/代谢是当前最大蓝海，IQVIA 预测口服减重峰值销售可达数百亿美元，商业天花板极高。',
        ip:
          'SciFinder 显示口服 GLP-1 化学空间高度拥挤，多家头部专利密集，FTO 风险高、规避设计难度大。',
        global:
          '美欧由礼来/诺和诺德主导，后来者出海窗口窄；新兴市场可作差异化，但需先有 PoC 才谈出海。',
      },
      evidence: {
        science: 'PubMed · Open Targets',
        clinical: 'ClinicalTrials.gov NCT0XXXXX03',
        regulatory: 'FDA CVOT 指南 · Cortellis',
        commercial: 'IQVIA MIDAS · GlobalData',
        ip: 'SciFinder-n · Derwent Innovation',
        global: 'IQVIA · NMPA/CDE',
      },
      destinations: [
        {
          region: '美国 / 欧盟',
          fit: '观察',
          pathway: '待 PoC 后评估',
          rationale: '头部 MNC 领先 3-5 年，需明确差异化(纯口服/成本)才有空间。',
          competition: '极高',
        },
        {
          region: '新兴市场',
          fit: '潜在',
          pathway: '价格差异化',
          rationale: '口服 + 成本优势在支付受限市场具吸引力。',
          competition: '中',
        },
      ],
      manufacturer: {
        assessment:
          '杭州康卫以授权引进 + 改良为主，自主创新与全球 FTO 储备薄弱，独立出海能力不足。',
        bdSuggestions: [
          '暂不重仓，设置 PoC 数据为继续投资的硬门槛',
          '若 PoC 积极，优先寻求与代谢领域 MNC 的早期合作',
          '加强 FTO 与规避设计专利布局',
        ],
      },
      measures: [
        { type: '临床', text: '尽快完成多剂量爬坡与减重 PoC 概念验证', ref: 'ClinicalTrials.gov · PubMed' },
        { type: '知识产权', text: 'SciFinder + Derwent 全面 FTO，评估规避设计可行性', ref: 'SciFinder-n · Derwent' },
        { type: '安全', text: '建立口服暴露量与肝毒性监测方案', ref: 'gnomAD/ClinVar · FDA 指南' },
        { type: '商业', text: '明确相对注射剂/口服竞品的差异化定位', ref: 'IQVIA MIDAS · GlobalData' },
      ],
      investment: {
        min: 2000,
        max: 4000,
        stage: '小额 PoC 门槛投资',
        risk: '高',
        enpv: 'ENPV 不确定，PoC 前不建议重仓',
        note: '建议以小额期权式投资锁定优先权，将后续注资严格绑定 PoC 与 FTO 结论。',
      },
      experts: [
        { name: '赵敏 教授', role: '内分泌 PI', rating: '谨慎乐观', note: '口服路线若成立价值巨大，但 I 期太早、变数多。' },
        { name: '孙浩 博士', role: '知识产权', rating: '担忧', note: '口服 GLP-1 专利丛林密集，FTO 是最大风险点。' },
      ],
      citations: [
        { source: 'ClinicalTrials.gov', detail: 'NCT0XXXXX03 Phase I 剂量爬坡' },
        { source: 'SciFinder-n', detail: '口服 GLP-1 化学空间专利密度分析' },
        { source: 'IQVIA MIDAS', detail: '代谢/减重市场峰值销售预测' },
        { source: 'PubMed', detail: 'GLP-1/GIP 双激动机制综述' },
      ],
    },
  },
]

export function getDrug(id) {
  return mockDrugs.find((d) => d.id === id)
}
