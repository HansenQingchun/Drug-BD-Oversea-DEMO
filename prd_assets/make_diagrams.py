# -*- coding: utf-8 -*-
"""生成 PRD 配图：系统架构图、业务流程图、多维评估模型图。"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

FONT = "C:/Windows/Fonts/msyh.ttc"
fp = font_manager.FontProperties(fname=FONT)
font_manager.fontManager.addfont(FONT)
plt.rcParams["font.family"] = fp.get_name()
plt.rcParams["axes.unicode_minus"] = False

OUT = os.path.dirname(os.path.abspath(__file__))

# 配色
NAVY = "#1e3a5f"
BLUE = "#2563eb"
TEAL = "#0d9488"
AMBER = "#d97706"
SLATE = "#475569"
LIGHT = "#eef2f7"
CARD = "#f8fafc"


def rbox(ax, x, y, w, h, text, fc, ec, tc="white", fs=12, bold=True):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.08",
                         linewidth=1.5, facecolor=fc, edgecolor=ec, mutation_aspect=1)
    ax.add_patch(box)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            color=tc, fontsize=fs, fontweight="bold" if bold else "normal",
            linespacing=1.5)


def arrow(ax, x1, y1, x2, y2, color=SLATE, lw=2):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>",
                 mutation_scale=18, linewidth=lw, color=color))


# ---------------- 图1：系统架构图 ----------------
def architecture():
    fig, ax = plt.subplots(figsize=(11, 7.2), dpi=160)
    ax.set_xlim(0, 12); ax.set_ylim(0, 8); ax.axis("off")
    ax.text(6, 7.6, "图1  系统总体架构", ha="center", fontsize=17, fontweight="bold", color=NAVY)

    # 层标签
    layers = [
        (6.3, "使用者", SLATE),
        (4.9, "应用与交互层", BLUE),
        (3.5, "智能评估引擎", TEAL),
        (2.1, "数据与知识来源", AMBER),
        (0.7, "评估输出", NAVY),
    ]
    for y, t, c in layers:
        rbox(ax, 0.2, y, 1.5, 1.0, t, c, c, fs=11)

    # 使用者
    rbox(ax, 2.2, 6.3, 4.4, 1.0, "人类科学家  ·  录入药物信息 / 专业意见", "#64748b", "#475569", fs=11)
    rbox(ax, 7.0, 6.3, 4.7, 1.0, "启星智谷投资人  ·  投资专业意见录入", "#64748b", "#475569", fs=11)

    # 应用层
    rbox(ax, 2.2, 4.9, 9.5, 1.0,
         "药物出海评估平台 Web 应用（React SPA）\n管线看板 · 药物录入 · 评估报告 · 专家/投资人意见整合",
         BLUE, "#1d4ed8", fs=11)

    # 引擎层
    rbox(ax, 2.2, 3.5, 4.5, 1.0, "大模型 Deep Research\n（可选模型 · 多轮检索综合）", TEAL, "#0f766e", fs=11)
    rbox(ax, 7.2, 3.5, 4.5, 1.0, "多维评分与投资建议引擎\n（评分 · 依据 · 金额测算）", TEAL, "#0f766e", fs=11)

    # 数据层
    for i, t in enumerate(["PubMed\n文献", "ClinicalTrials\n临床试验", "bioRxiv 等\n预印本",
                            "立项决策\n支持文档", "专家/投资人\n手工意见"]):
        rbox(ax, 2.2 + i * 1.92, 2.1, 1.78, 1.0, t, AMBER, "#b45309", fs=10)

    # 输出层
    rbox(ax, 2.2, 0.7, 2.9, 1.0, "多维评分\n+ 详细理由", NAVY, "#0f172a", fs=10)
    rbox(ax, 5.3, 0.7, 2.9, 1.0, "厂家建议 /\n出海目的地", NAVY, "#0f172a", fs=10)
    rbox(ax, 8.4, 0.7, 3.3, 1.0, "措施建议 +\n投资金额区间", NAVY, "#0f172a", fs=10)

    # 箭头（层间）
    for x in [4.4, 9.3]:
        arrow(ax, x, 6.3, x, 5.9)
    arrow(ax, 6.95, 4.9, 6.95, 4.5)        # 应用->引擎
    arrow(ax, 4.45, 3.5, 4.45, 3.1)        # 引擎->数据
    arrow(ax, 9.45, 3.5, 9.45, 3.1)
    arrow(ax, 6.95, 2.1, 6.95, 1.7)        # 数据->输出
    # 引擎双向
    arrow(ax, 6.7, 4.0, 7.2, 4.0, color="#0f766e")
    arrow(ax, 7.2, 3.8, 6.7, 3.8, color="#0f766e")

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "fig1_architecture.png"), bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ---------------- 图2：业务流程图 ----------------
def workflow():
    fig, ax = plt.subplots(figsize=(11, 4.6), dpi=160)
    ax.set_xlim(0, 12); ax.set_ylim(0, 4); ax.axis("off")
    ax.text(6, 3.7, "图2  评估业务流程", ha="center", fontsize=17, fontweight="bold", color=NAVY)

    steps = [
        ("①\n录入候选\n出海药物", BLUE),
        ("②\n多源知识库\n自动检索", AMBER),
        ("③\n大模型 Deep\nResearch 综合", TEAL),
        ("④\n生成多维\n评分与依据", NAVY),
        ("⑤\n专家/投资人\n意见动态调整", "#7c3aed"),
        ("⑥\n输出报告与\n投资金额建议", "#0f172a"),
    ]
    n = len(steps); w = 1.7; gap = (12 - 0.4 - n * w) / (n - 1); x = 0.2; y = 1.6
    centers = []
    for t, c in steps:
        rbox(ax, x, y, w, 1.2, t, c, c, fs=10)
        centers.append(x + w)
        x += w + gap
    xs = 0.2
    for i in range(n - 1):
        x1 = 0.2 + i * (w + gap) + w
        arrow(ax, x1, y + 0.6, x1 + gap, y + 0.6, color=SLATE, lw=2.2)
    # 反馈回路
    ax.add_patch(FancyArrowPatch((0.2 + 4 * (w + gap) + w / 2, y),
                                 (0.2 + 3 * (w + gap) + w / 2, y),
                                 connectionstyle="arc3,rad=0.5", arrowstyle="-|>",
                                 mutation_scale=15, linewidth=1.8, color="#7c3aed", linestyle="--"))
    ax.text(6, 0.75, "人机协同：专家与投资人意见实时回流，多维评分与投资区间随之动态更新",
            ha="center", fontsize=10.5, color="#7c3aed")

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "fig2_workflow.png"), bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ---------------- 图3：多维评估模型（雷达图） ----------------
def scoring():
    dims = ["科学性\n（机制/靶点）", "临床证据\n强度", "市场潜力\n（出海）",
            "竞争格局", "法规与\n准入", "知识产权\n与壁垒"]
    vals = [8.6, 7.4, 8.9, 6.8, 7.9, 8.2]
    N = len(dims)
    angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
    vals2 = vals + vals[:1]; angles2 = angles + angles[:1]

    fig, ax = plt.subplots(figsize=(7.2, 6.6), dpi=160, subplot_kw=dict(polar=True))
    ax.set_theta_offset(np.pi / 2); ax.set_theta_direction(-1)
    ax.set_ylim(0, 10)
    ax.set_xticks(angles)
    ax.set_xticklabels(dims, fontproperties=fp, fontsize=11, color=NAVY)
    ax.set_yticks([2, 4, 6, 8, 10])
    ax.set_yticklabels(["2", "4", "6", "8", "10"], fontsize=9, color=SLATE)
    ax.plot(angles2, vals2, color=BLUE, linewidth=2.2)
    ax.fill(angles2, vals2, color=BLUE, alpha=0.22)
    for a, v in zip(angles, vals):
        ax.text(a, v + 0.5, f"{v}", ha="center", fontproperties=fp, fontsize=10,
                color=BLUE, fontweight="bold")
    ax.set_title("图3  多维评估模型示例（综合评分 8.1 / 10）",
                 fontproperties=fp, fontsize=15, fontweight="bold", color=NAVY, pad=24)
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "fig3_scoring.png"), bbox_inches="tight", facecolor="white")
    plt.close(fig)


if __name__ == "__main__":
    architecture()
    workflow()
    scoring()
    print("diagrams done")
