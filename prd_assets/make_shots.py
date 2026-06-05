# -*- coding: utf-8 -*-
"""用 Playwright 截取线上平台真实界面，供 PRD 配图。"""
from playwright.sync_api import sync_playwright
import os, time

OUT = os.path.dirname(os.path.abspath(__file__))
BASE = "https://genai-demo.cn/drug-demo/"

def run():
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": 1440, "height": 900},
                            device_scale_factor=2, ignore_https_errors=True)
        pg = ctx.new_page()

        # 看板页
        pg.goto(BASE + "#/", wait_until="networkidle", timeout=60000)
        time.sleep(2.5)
        pg.screenshot(path=os.path.join(OUT, "shot_dashboard.png"), full_page=True)
        print("dashboard ok")

        # 报告页（顶部一屏：综合评分 + 多维评估）
        pg.goto(BASE + "#/report/qx-101", wait_until="networkidle", timeout=60000)
        time.sleep(3)
        pg.screenshot(path=os.path.join(OUT, "shot_report_top.png"), full_page=False)
        print("report top ok")

        # 报告页整页
        pg.screenshot(path=os.path.join(OUT, "shot_report_full.png"), full_page=True)
        print("report full ok")

        b.close()

if __name__ == "__main__":
    run()
