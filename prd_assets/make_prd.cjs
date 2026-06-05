const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak, Footer, Header, PageNumber, TableOfContents
} = require("docx");

const ASSET = __dirname;
const OUT = path.join(ASSET, "..", "药物出海评估平台-PRD.docx");

// ---- palette ----
const BRAND = "2563EB";      // blue
const BRAND_DARK = "1E3A8A";
const GREEN = "16A34A";
const GREY = "6B7280";
const LIGHT = "EEF2FF";
const HEADBG = "DBEAFE";

// ---- helpers ----
const img = (file, w, h) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
    children: [
      new ImageRun({
        type: "png",
        data: fs.readFileSync(path.join(ASSET, file)),
        transformation: { width: w, height: h },
        altText: { title: file, description: file, name: file },
      }),
    ],
  });

const caption = (t) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: t, italics: true, size: 18, color: GREY })],
  });

const p = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: 300 },
    alignment: opts.align,
    children: [new TextRun({ text, size: opts.size ?? 21, color: opts.color, bold: opts.bold })],
  });

const bullet = (text, lvl = 0) =>
  new Paragraph({
    numbering: { reference: "b", level: lvl },
    spacing: { after: 60, line: 290 },
    children: Array.isArray(text) ? text : [new TextRun({ text, size: 21 })],
  });

const h1 = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
const h2 = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });

// ---- table builder ----
const border = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(text, w, { head = false, bold = false, fill, align } = {}) {
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: fill ?? (head ? HEADBG : "FFFFFF"), type: ShadingType.CLEAR },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    verticalAlign: VerticalAlign.CENTER,
    children: (Array.isArray(text) ? text : [text]).map(
      (t) =>
        new Paragraph({
          alignment: align,
          children: [new TextRun({ text: t, bold: head || bold, size: 19, color: head ? BRAND_DARK : "111827" })],
        })
    ),
  });
}
function table(widths, rows) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(
      (r, i) =>
        new TableRow({
          tableHeader: i === 0,
          children: r.map((c, j) =>
            cell(c, widths[j], { head: i === 0, fill: i > 0 && i % 2 === 0 ? "F8FAFC" : undefined })
          ),
        })
    ),
  });
}

const CW = 9026; // A4 content width (DXA)

// ================= CONTENT =================
const children = [];

// ---- Cover ----
children.push(
  new Paragraph({ spacing: { before: 1600 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: "启星智谷", bold: true, size: 30, color: BRAND })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 480 },
    children: [new TextRun({ text: "QIXING ZHIGU · 药物出海投资", size: 18, color: GREY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text: "药物出海评估平台", bold: true, size: 56, color: BRAND_DARK })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: "产品需求文档（PRD）", bold: true, size: 30, color: "111827" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [new TextRun({ text: "智能尽调 · 人机协同决策", size: 20, color: GREY })],
  }),
);

// cover info table
children.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [] }),
);
const coverTbl = (() => {
  const w = [2600, 4200];
  const rows = [
    ["文档名称", "药物出海评估平台 产品需求文档（PRD）"],
    ["版本", "v1.0（演示版）"],
    ["状态", "Demo 已上线"],
    ["在线地址", "https://genai-demo.cn/drug-demo/"],
    ["适用对象", "启星智谷 投资/科学/产品团队"],
    ["日期", "2026-06"],
  ];
  return new Table({
    width: { size: 6800, type: WidthType.DXA },
    columnWidths: w,
    alignment: AlignmentType.CENTER,
    rows: rows.map(
      (r) =>
        new TableRow({
          children: [
            cell(r[0], w[0], { fill: LIGHT, bold: true }),
            cell(r[1], w[1]),
          ],
        })
    ),
  });
})();
children.push(coverTbl);
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---- TOC ----
children.push(
  new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: "目录", bold: true, size: 30, color: BRAND_DARK })] }),
  new TableOfContents("目录", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---- 1. 产品概述 ----
children.push(h1("1. 产品概述"));
children.push(h2("1.1 背景"));
children.push(
  p("启星智谷是一家专注于「药物出海」的投资机构，需要在大量候选管线中快速筛选出成功率较高、具备海外（美/欧/日等）注册与商业化潜力的创新药资产。传统尽调依赖人工查阅 PubMed、ClinicalTrials.gov、bioRxiv/medRxiv 等多源资料，周期长、口径不一、难以横向对比。")
);
children.push(h2("1.2 产品目标"));
children.push(bullet("以「大模型 Deep Research + 多源知识库 + 人类专家意见」三者结合，对候选出海管线药物进行标准化的多维度评估与打分。"));
children.push(bullet("输出可解释、可追溯（逐条引用来源）的评估报告，并给出出海目的地、需要采取的措施与投资建议。"));
children.push(bullet("支持人机协同：科学家与投资人可录入专业意见，实时动态调整评分与投资区间。"));
children.push(h2("1.3 一句话定位"));
children.push(
  new Paragraph({
    spacing: { after: 160, line: 300 },
    shading: { fill: LIGHT, type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: BRAND, space: 6 } },
    indent: { left: 200 },
    children: [
      new TextRun({ text: "面向药物出海投资的智能尽调与决策支持平台——把分散的证据，变成可打分、可解释、可决策的出海管线评估报告。", size: 22, bold: true, color: BRAND_DARK }),
    ],
  })
);

// ---- 2. 目标用户与场景 ----
children.push(h1("2. 目标用户与使用场景"));
children.push(
  table(
    [1900, 3200, 3926],
    [
      ["角色", "核心诉求", "典型操作"],
      ["投资经理 / IC", "快速判断资产是否值得投、投多少", "看管线看板、读评估报告、录入投资人意见、参考投资区间"],
      ["科学家 / 尽调专家", "核验科学与临床证据、补充专业判断", "新建评估、选择知识库、录入专家评级与侧重维度"],
      ["产品 / 决策层", "横向对比多个候选、留痕可追溯", "综合评分排序、引用来源核查、导出报告"],
    ]
  )
);

// ---- 3. 系统架构 ----
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h1("3. 系统架构"));
children.push(p("平台采用「输入层 → Deep Research 评估引擎 → 输出层」三层结构。当前演示版为纯前端实现（React + Vite + Tailwind，使用模拟数据），评估引擎与知识库接口以可替换的形式预留，后续可对接真实大模型与数据 API。"));
children.push(img("fig1_architecture.png", 600, 391));
children.push(caption("图 1　药物出海评估平台 系统架构"));

// ---- 4. 业务流程 ----
children.push(h1("4. 业务流程"));
children.push(p("用户从录入药物信息开始，选择知识库技能与大模型，启动 Deep Research；引擎分步完成文献检索、靶点验证、临床格局、监管、商业与出海适配分析后汇总成报告；科学家与投资人可录入意见，系统据此动态重算评分与投资建议。"));
children.push(img("fig2_workflow.png", 620, 256));
children.push(caption("图 2　从录入到决策的业务流程"));

// ---- 5. 功能需求 ----
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h1("5. 功能需求"));

children.push(h2("5.1 出海管线看板（Dashboard）"));
children.push(bullet("候选药物卡片：名称 / 靶点 / 适应症 / 研发阶段 / 厂家 / 综合评分 / 推荐目的地 / 投资建议标签。"));
children.push(bullet("顶部统计：候选总数、推荐投资数、平均评分、覆盖目的地。"));
children.push(bullet("支持按评分排序、按适应症筛选。"));
children.push(img("shot_dashboard.png", 600, 375));
children.push(caption("图 3　出海管线看板（线上实截）"));

children.push(h2("5.2 新建评估（New Assessment）"));
children.push(bullet("药物信息录入：名称、靶点、适应症、作用机制、研发阶段、原厂家/来源、化学/生物类型、描述。"));
children.push(bullet("知识库技能选择（多选）：PubMed、ClinicalTrials.gov、bioRxiv/medRxiv、Open Targets、ChEMBL、gnomAD/ClinVar、Citeline/Cortellis、NMPA/CDE 等。"));
children.push(bullet("立项决策框架引用：内置《药物研发立项决策支持》核心维度作为评估依据。"));
children.push(bullet("大模型选择 + Deep Research 模式：模型下拉（GPT-5.x / Claude Opus / Gemini / DeepSeek 等）与研究深度（快速/标准/深度）。"));
children.push(bullet("科学家手工意见录入：支持多条专家意见与评级。"));
children.push(bullet("启动后展示分步研究进度动画（检索→靶点→临床→监管→商业→出海适配→汇总）。"));

children.push(h2("5.3 评估报告（Report）"));
children.push(p("报告页是平台的核心交付物，包含综合评分、多维评分雷达、逐维度打分与依据、出海目的地建议、厂家/合作建议、需要采取的措施、专家意见整合与启星智谷投资建议。", { after: 100 }));
children.push(img("shot_report_top.png", 600, 375));
children.push(caption("图 4　评估报告（顶部：综合评分 + 雷达 + 多维依据，线上实截）"));

children.push(h2("5.4 可信度设计：逐条引用来源"));
children.push(p("「多维度评估与依据」及「需要采取的措施」中的每一条结论，均在条目下方以小字、淡色标注引用来源（如 Open Targets、gnomAD/ClinVar、ClinicalTrials.gov、Cortellis、FDA 指南等），提升结论的可追溯性与可信度。"));

children.push(h2("5.5 人机协同：专家与投资人意见"));
children.push(bullet([new TextRun({ text: "专家意见整合：", bold: true, size: 21 }), new TextRun({ text: "以整宽醒目卡片呈现，科学家可录入意见、给出评级（+6 ~ -6）并选择侧重维度；提交后动态重算多维评分、雷达图与综合评分。", size: 21 })]));
children.push(bullet([new TextRun({ text: "投资人专业意见：", bold: true, size: 21 }), new TextRun({ text: "在「启星智谷投资建议」中录入投资立场（积极加仓 ×1.25 / 维持 ×1 / 适度参与 ×0.85 / 保守减仓 ×0.6 / 暂缓 ×0.2），与专家系数叠加，实时调整投资金额区间。", size: 21 })]));

// ---- 6. 多维评估模型 ----
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h1("6. 多维评估模型"));
children.push(p("平台从六个维度对候选药物打分（0~100），加权汇总为综合评分，并以雷达图可视化。"));
children.push(
  table(
    [2000, 4626, 2400],
    [
      ["维度", "评估内容", "示例引用来源"],
      ["科学有效性", "靶点-疾病关联的遗传学/药理学强验证程度", "Open Targets · gnomAD/ClinVar"],
      ["临床可行性", "临床开发路径、入排可行性与终点设置", "ClinicalTrials.gov · PubMed"],
      ["监管顺应性", "安全性特征、监管风险获益、特殊通道可得性", "Cortellis · FDA 指南"],
      ["商业生存力", "未满足需求、差异化竞争与市场回报", "Citeline · 行业研报"],
      ["知识产权 / FTO", "专利布局与自由实施空间", "专利数据库 · FTO 检索"],
      ["出海适配性", "目标市场监管路径、本地化与 BD 可行性", "EMA/PMDA · BD 交易库"],
    ]
  )
);
children.push(new Paragraph({ spacing: { before: 160 }, children: [] }));
children.push(img("fig3_scoring.png", 360, 416));
children.push(caption("图 5　QX-101 多维评分雷达（示例）"));

// ---- 7. 输出内容说明 ----
children.push(h1("7. 输出内容说明"));
children.push(bullet("综合评分与推荐标签：强烈推荐 / 推荐投资 / 审慎观察。"));
children.push(bullet("出海目的地建议：如美国（FDA）/ 欧盟（EMA）/ 日本（PMDA），含监管路径、竞争格局与差异化理由。"));
children.push(bullet("厂家 / 合作建议：原厂家评估与潜在 BD 合作方向。"));
children.push(bullet("需要采取的措施：补充临床数据、FTO 检索、监管沟通、CMC 等行动清单（逐条附来源）。"));
children.push(bullet("启星智谷投资建议：投资金额范围、投资结构/阶段、风险等级与预期回报（ENPV 风格）。"));

// ---- 8. 技术实现与部署 ----
children.push(h1("8. 技术实现与部署"));
children.push(
  table(
    [2400, 6626],
    [
      ["项目", "说明"],
      ["前端框架", "React 18 + Vite 5 + Tailwind CSS"],
      ["可视化 / 图标", "recharts（雷达图）· lucide-react"],
      ["路由", "HashRouter（相对路径打包，可嵌入任意子目录 / iframe / WordPress）"],
      ["数据", "演示版使用 src/data 模拟数据，评估引擎与知识库接口预留可替换"],
      ["部署", "腾讯云服务器 + 宝塔 Nginx；HTTPS（Let's Encrypt，自动续期）"],
      ["在线地址", "https://genai-demo.cn/drug-demo/"],
    ]
  )
);
children.push(img("shot_report_full.png", 430, 710));
children.push(caption("图 6　评估报告完整长图（线上实截）"));

// ---- 9. 非功能需求与后续规划 ----
children.push(h1("9. 非功能需求与后续规划"));
children.push(h2("9.1 非功能需求"));
children.push(bullet("可解释性：每条评分结论可追溯到具体来源。"));
children.push(bullet("可移植性：相对路径打包，便于嵌入官网或第三方平台。"));
children.push(bullet("响应式与中文本地化 UI。"));
children.push(h2("9.2 后续规划（非本期）"));
children.push(bullet("接入真实大模型 Deep Research 编排与多源知识库 API。"));
children.push(bullet("用户登录、权限与评估数据持久化。"));
children.push(bullet("完成域名 ICP 备案，恢复 HTTP 访问并提升合规性。"));
children.push(bullet("报告导出（PDF / Word）与历史版本对比。"));

children.push(
  new Paragraph({
    spacing: { before: 400 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "— 本文档配套演示平台：https://genai-demo.cn/drug-demo/ —", size: 18, color: GREY, italics: true })],
  })
);

// ================= DOC =================
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Microsoft YaHei", size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Microsoft YaHei", color: BRAND_DARK },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Microsoft YaHei", color: BRAND },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "b", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 240 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 960, hanging: 240 } } } },
      ] },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB", space: 4 } },
            children: [new TextRun({ text: "启星智谷 · 药物出海评估平台 PRD", size: 16, color: GREY })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "第 ", size: 16, color: GREY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY }),
              new TextRun({ text: " 页", size: 16, color: GREY }),
            ],
          })],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("PRD written:", OUT, buf.length, "bytes");
});
