#!/usr/bin/env python3

from __future__ import annotations

import html
import json
import re
from pathlib import Path
from urllib import request


ROOT = Path(__file__).resolve().parents[1]
GITHUB_MARKDOWN_API = "https://api.github.com/markdown/raw"
USER_AGENT = "capm-for-agencies-static-builder"
SITE_URL = "https://newlocalmedia.github.io/capm-for-agencies"


PAGE_STYLE = """
  :root {
    --ink: #201d1a;
    --paper: #f8f2e8;
    --paper-deep: #efe6d8;
    --canvas: #e8ddcc;
    --line: rgba(32, 29, 26, 0.12);
    --line-strong: rgba(32, 29, 26, 0.2);
    --accent: #8c3f2f;
    --accent-soft: rgba(140, 63, 47, 0.08);
    --blue: #23486a;
    --muted: #6a635b;
    --shadow: 0 18px 50px rgba(32, 29, 26, 0.12);
    --radius: 24px;
  }

  * { box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    color: var(--ink);
    background:
      radial-gradient(circle at top left, rgba(140, 63, 47, 0.08), transparent 28%),
      radial-gradient(circle at top right, rgba(35, 72, 106, 0.09), transparent 24%),
      linear-gradient(180deg, #efe5d7 0%, #e7dccb 100%);
    font-family: Georgia, "Times New Roman", serif;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: var(--blue);
  }

  .shell {
    max-width: 1380px;
    margin: 0 auto;
    padding: 28px 20px 72px;
  }

  .masthead {
    display: grid;
    gap: 18px;
    background: linear-gradient(145deg, rgba(248, 242, 232, 0.92), rgba(239, 230, 216, 0.95));
    border: 1px solid rgba(32, 29, 26, 0.08);
    border-radius: 28px;
    box-shadow: var(--shadow);
    padding: 28px;
    margin-bottom: 28px;
  }

  .eyebrow {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .masthead-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(280px, 0.9fr);
    gap: 28px;
    align-items: start;
  }

  .masthead h1 {
    margin: 0 0 10px;
    font-size: clamp(2.4rem, 4vw, 4.2rem);
    line-height: 1;
    letter-spacing: -0.03em;
    color: #241d17;
  }

  .deck {
    margin: 0;
    max-width: 44rem;
    font-size: 1.15rem;
    color: #38322d;
  }

  .meta {
    display: grid;
    gap: 12px;
    align-content: start;
    padding: 18px 20px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.42);
    border: 1px solid rgba(32, 29, 26, 0.08);
  }

  .meta-copy {
    font-size: 0.98rem;
    color: var(--muted);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0 16px;
    border-radius: 999px;
    text-decoration: none;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    transition: transform 0.16s ease, background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
  }

  .button:hover {
    transform: translateY(-1px);
  }

  .button.primary {
    background: var(--accent);
    color: #fff8f3;
    border: 1px solid var(--accent);
  }

  .button.secondary {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(32, 29, 26, 0.1);
    color: var(--ink);
  }

  .layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  .toc-card,
  .article-card {
    background: rgba(248, 242, 232, 0.92);
    border: 1px solid rgba(32, 29, 26, 0.08);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .toc-card {
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    padding: 20px 18px 20px 32px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .toc-title {
    margin: 0 0 14px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .toc {
    display: grid;
    gap: 2px;
    overflow-y: auto;
    padding-right: 4px;
    padding-left: 18px;
  }

  .toc a {
    display: block;
    padding: 8px 10px;
    border-radius: 10px;
    text-decoration: none;
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.35;
  }

  .toc a.level-3,
  .toc a.level-4 {
    margin-left: 12px;
    font-size: 0.88rem;
  }

  .toc a:hover {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .article-card {
    overflow: hidden;
  }

  .article-frame {
    padding: 20px clamp(24px, 4vw, 56px) clamp(24px, 4vw, 56px);
  }

  .prose {
    max-width: 860px;
    margin: 0 auto;
    font-size: 1.08rem;
  }

  .prose > :first-child {
    margin-top: 0;
  }

  .prose h1,
  .prose h2,
  .prose h3,
  .prose h4 {
    color: #1d1915;
    line-height: 1.08;
    letter-spacing: -0.02em;
    scroll-margin-top: 80px;
  }

  .prose h1 {
    font-size: 2.8rem;
    margin: 0 0 1rem;
  }

  .prose h2 {
    font-size: 2rem;
    margin: 3rem 0 1rem;
  }

  .prose > .article-kicker + h2 {
    margin-top: 0;
  }

  .prose h3 {
    font-size: 1.45rem;
    margin: 2.2rem 0 0.8rem;
  }

  .prose h4 {
    font-size: 1.14rem;
    margin: 1.6rem 0 0.65rem;
  }

  .prose p,
  .prose ul,
  .prose ol,
  .prose blockquote,
  .prose table,
  .prose pre {
    margin: 0 0 1.1rem;
  }

  .prose ul,
  .prose ol {
    padding-left: 1.4rem;
  }

  .prose li + li {
    margin-top: 0.35rem;
  }

  .prose strong {
    color: #191512;
  }

  .prose code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.88em;
    background: rgba(35, 72, 106, 0.08);
    color: #193247;
    padding: 0.12em 0.34em;
    border-radius: 0.35em;
  }

  .prose pre {
    background: #201d1a;
    color: #f8f2e8;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    overflow-x: auto;
  }

  .prose pre code {
    display: block;
    padding: 0;
    overflow: visible;
    background: transparent;
    color: inherit;
    border-radius: 0;
  }

  .prose blockquote {
    padding: 1rem 1.2rem;
    border-left: 4px solid var(--accent);
    background: linear-gradient(135deg, rgba(140, 63, 47, 0.08), rgba(140, 63, 47, 0.02));
    border-radius: 0 14px 14px 0;
    color: #473f38;
  }

  .prose .reader-aside {
    float: right;
    width: min(21rem, 42%);
    margin: 0.1rem 0 1.1rem 1.4rem;
    padding: 1rem 1.1rem;
    border-radius: 18px;
    border: 1px solid rgba(32, 29, 26, 0.08);
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 10px 24px rgba(32, 29, 26, 0.08);
  }

  .prose .reader-aside .reader-aside-title {
    margin: 0 0 0.45rem;
    font-size: 0.95rem;
    line-height: 1.3;
    color: #241d17;
    font-weight: 700;
  }

  .prose .reader-aside p {
    margin: 0 0 0.6rem;
    font-size: 0.94rem;
    line-height: 1.5;
    color: var(--muted);
  }

  .prose .reader-aside ul {
    margin: 0;
    padding-left: 1.15rem;
  }

  .prose .reader-aside li {
    margin-top: 0.25rem;
  }

  .prose .reader-note {
    clear: both;
    margin: 1.25rem 0 1.15rem;
    padding: 1rem 1.1rem;
    border-radius: 18px;
    border: 1px solid rgba(35, 72, 106, 0.14);
    background: rgba(35, 72, 106, 0.06);
    box-shadow: 0 10px 24px rgba(32, 29, 26, 0.06);
  }

  .prose .reader-note p {
    margin: 0;
    color: #3d3934;
  }

  .prose .reader-note strong {
    color: #1f3650;
  }

  .prose h2#contents + ol {
    margin: 1.15rem 0 2.2rem;
    padding: 1.25rem 1.35rem 1.35rem 2.2rem;
    border-radius: 20px;
    border: 1px solid rgba(32, 29, 26, 0.08);
    background: rgba(255, 255, 255, 0.74);
    box-shadow: 0 12px 30px rgba(32, 29, 26, 0.07);
  }

  .prose h2#contents + ol > li {
    padding-left: 0.15rem;
  }

  .prose h2#contents + ol > li + li {
    margin-top: 0.55rem;
  }

  .prose h2#contents + ol ol {
    margin-top: 0.45rem;
    padding-left: 1.45rem;
  }

  .prose h2#contents + ol ol li + li {
    margin-top: 0.25rem;
  }

  .prose h2#contents + ol a {
    text-decoration: none;
  }

  .prose h2#contents + ol a:hover {
    text-decoration: underline;
  }

  .prose table {
    width: 100%;
    border-collapse: collapse;
    display: block;
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: 16px;
  }

  .prose thead,
  .prose tbody,
  .prose tr {
    width: 100%;
    display: table;
    table-layout: fixed;
  }

  .prose th,
  .prose td {
    padding: 0.8rem 0.95rem;
    border-bottom: 1px solid var(--line);
    vertical-align: top;
  }

  .prose h2#the-formula + p + p + table thead,
  .prose h2#the-formula + p + p + table tbody,
  .prose h2#the-formula + p + p + table tr {
    table-layout: auto;
  }

  .prose h2#the-formula + p + p + table th:first-child,
  .prose h2#the-formula + p + p + table td:first-child {
    width: 28%;
    white-space: nowrap;
  }

  .prose h2#the-formula + p + p + table th:last-child,
  .prose h2#the-formula + p + p + table td:last-child {
    width: 72%;
  }

  .prose tr:last-child td {
    border-bottom: 0;
  }

  .prose th {
    text-align: left;
    background: rgba(35, 72, 106, 0.08);
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .prose img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.9rem auto 0.7rem;
    border-radius: 18px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.52);
    box-shadow: 0 18px 36px rgba(32, 29, 26, 0.08);
  }

  .prose a:has(> img) {
    display: inline-block;
    cursor: zoom-in;
  }

  .prose .lead {
    font-size: 1.18rem;
    color: #38322d;
  }

  .article-kicker {
    margin: 0 0 0.45rem;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .empty-toc {
    color: var(--muted);
    font-size: 0.95rem;
  }

  .site-footer {
    max-width: 860px;
    margin: 28px auto 0;
    text-align: center;
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--muted);
  }

  .site-footer a {
    color: var(--blue);
  }

  .lightbox {
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 28px;
    background: rgba(24, 21, 18, 0.82);
    z-index: 9999;
  }

  .lightbox.is-open {
    display: flex;
  }

  .lightbox-dialog {
    position: relative;
    max-width: min(94vw, 1600px);
    max-height: 94vh;
  }

  .lightbox-image {
    display: block;
    max-width: 100%;
    max-height: calc(94vh - 48px);
    width: auto;
    height: auto;
    border-radius: 18px;
    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.35);
    background: #fffdf8;
  }

  .lightbox-close {
    position: absolute;
    top: -16px;
    right: -16px;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 999px;
    background: rgba(32, 29, 26, 0.88);
    color: #fffdf8;
    cursor: pointer;
    font-size: 28px;
    line-height: 1;
  }

  .lightbox-caption {
    margin-top: 12px;
    text-align: center;
    color: #f3ede3;
    font-size: 0.95rem;
  }

  @media (max-width: 980px) {
    .masthead-grid,
    .layout {
      grid-template-columns: 1fr;
    }

    .toc-card {
      position: static;
    }

    .prose .reader-aside {
      float: none;
      width: auto;
      margin: 0 0 1.1rem;
    }
  }

  @media (max-width: 640px) {
    .shell {
      padding: 18px 14px 48px;
    }

    .masthead,
    .article-frame {
      padding: 20px;
    }

    .prose {
      font-size: 1rem;
    }

    .prose h2 {
      font-size: 1.65rem;
    }
  }
"""


PAGES = [
    {
        "source": ROOT / "theory" / "capm-for-agencies.md",
        "output": ROOT / "theory" / "index.html",
        "title": "CAPM for Agencies — Theory and Background",
        "description": "The long-form theory behind CAPM for Agencies: the full argument, formulas, worked examples, limitations, and B-Corp extension.",
        "social_image": "/theory/figures/capm-comparison.png",
        "eyebrow": "Theory and Background",
        "heading": "CAPM for Agencies",
        "deck": "This is the theory behind the decision cards: the deeper argument, its assumptions, the math, some cool line charts, and a little economics history. There's also a section explaining how CAPM is adapted to \u24b7 Lab Standards and the \u24b7 Impact Assessment (BIA).",
        "deck_link_text": "the decision cards",
        "deck_link_href": "../index.html",
        "meta": "Use this version when you want the full argument, not just the calculator. The hybrid layer is presented here as pricing governance rather than a literal asset-pricing engine.",
        "actions": [
            ("Open the Decision Cards", "../index.html", "primary"),
            ("Overview", "../overview/index.html", "secondary"),
            ("TL;DR", "../tldr/price-the-work-before-you-plan-it.html", "secondary"),
            ("Walkthrough", "../tldr/walkthrough.html", "secondary"),
            ("Decision Guide", "../tldr/decision-guide.html", "secondary"),
            ("Why Discovery Comes First", "../essays/systems-thinking-for-web-development-agencies.html", "secondary"),
            ("Calibration Notes", "../tldr/calibration-notes.html", "secondary"),
        ],
        "toc_min": 2,
        "toc_max": 4,
        "lead": True,
    },
    {
        "source": ROOT / "tldr" / "CAPM for Agencies_ Price the Work Before You Plan It.md",
        "output": ROOT / "tldr" / "price-the-work-before-you-plan-it.html",
        "title": "CAPM for Agencies — Short Overview",
        "description": "A short explanation of CAPM for Agencies: why most agencies price risk backwards, how the hybrid model works as pricing governance, and how deals clear or fail the hurdle.",
        "social_image": "/theory/figures/layer2-blended-beta.png",
        "eyebrow": "Short Overview",
        "heading": "Price the Work Before You Plan It",
        "article_kicker": "CAPM for Agencies",
        "toc_skip_first_heading": True,
        "deck": "A short introduction to the CAPM model and the problem we're trying to solve with it: <strong>most agencies price work only after they have started imagining delivery</strong>. Learn what we're borrowing from finance, why the hybrid approach is best understood as pricing governance rather than prediction, and how proposed deal economics either clear the hurdle or fail it. We also explain why enterprise agencies may lean toward the pure approach while small and mid-sized agencies often begin with the hybrid one.",
        "deck_html": True,
        "meta": "Start here if you want the thesis without the theory. This is the best first read for most people.",
        "actions": [
            ("Open the Decision Cards", "../index.html", "primary"),
            ("Overview", "../overview/index.html", "secondary"),
            ("Walkthrough", "./walkthrough.html", "secondary"),
            ("Decision Guide", "./decision-guide.html", "secondary"),
            ("Calibration Notes", "./calibration-notes.html", "secondary"),
            ("Why Discovery Comes First", "../essays/systems-thinking-for-web-development-agencies.html", "secondary"),
            ("Understand the Theory", "../theory/index.html", "secondary"),
        ],
        "toc_min": 2,
        "toc_max": 3,
        "lead": False,
    },
    {
        "source": ROOT / "tldr" / "CAPM for Agencies — Walkthrough.md",
        "output": ROOT / "tldr" / "walkthrough.html",
        "title": "CAPM for Agencies — Walkthrough",
        "description": "A concrete example of how to use the Decision Cards: start with the defaults, score one realistic agency deal, compare the proposed margin to the hurdle, and make the call.",
        "social_image": "/theory/figures/layer2-blended-beta.png",
        "eyebrow": "Walkthrough",
        "heading": "One Deal, Start to Finish",
        "article_kicker": "CAPM for Agencies",
        "toc_skip_first_heading": True,
        "deck": "A concrete example of how the Decision Cards are meant to be used: start with the default calibration, score one realistic engagement, compare the proposed margin to the hurdle, and decide whether to proceed, reprice, or sell discovery first.",
        "meta": "Use this when you want one realistic agency example before running the cards yourself.",
        "actions": [
            ("Open the Decision Cards", "../index.html", "primary"),
            ("Overview", "../overview/index.html", "secondary"),
            ("TL;DR", "./price-the-work-before-you-plan-it.html", "secondary"),
            ("Decision Guide", "./decision-guide.html", "secondary"),
            ("Calibration Notes", "./calibration-notes.html", "secondary"),
            ("Why Discovery Comes First", "../essays/systems-thinking-for-web-development-agencies.html", "secondary"),
            ("Understand the Theory", "../theory/index.html", "secondary"),
        ],
        "toc_min": 2,
        "toc_max": 3,
        "lead": False,
    },
    {
        "source": ROOT / "tldr" / "CAPM for Agencies — Decision Guide.md",
        "output": ROOT / "tldr" / "decision-guide.html",
        "title": "CAPM for Agencies — Decision Guide",
        "description": "A practical presales guide for scoring risk, setting baselines, comparing proposed margin to the hurdle, and deciding whether to proceed, reprice, or sell discovery first.",
        "social_image": "/theory/figures/layer2-blended-beta.png",
        "eyebrow": "Decision Guide",
        "heading": "CAPM for Agencies — Decision Guide",
        "toc_skip_first_heading": True,
        "deck": "A practical presales guide for running the CAPM model: set baselines, score the current environment and the deal, compare proposed margin to the hurdle, then decide whether to proceed, reprice, or sell discovery first.",
        "meta": "Use this when you want the procedure rather than the theory. It tracks the current decision logic in the decision cards.",
        "actions": [
            ("Open the Decision Cards", "../index.html", "primary"),
            ("Overview", "../overview/index.html", "secondary"),
            ("TL;DR", "./price-the-work-before-you-plan-it.html", "secondary"),
            ("Walkthrough", "./walkthrough.html", "secondary"),
            ("Calibration Notes", "./calibration-notes.html", "secondary"),
            ("Why Discovery Comes First", "../essays/systems-thinking-for-web-development-agencies.html", "secondary"),
            ("Understand the Theory", "../theory/index.html", "secondary"),
        ],
        "toc_min": 2,
        "toc_max": 3,
        "lead": False,
    },
    {
        "source": ROOT / "tldr" / "CAPM for Agencies — Calibration Notes.md",
        "output": ROOT / "tldr" / "calibration-notes.html",
        "title": "CAPM for Agencies — Calibration Notes",
        "description": "Implementation detail for the current Decision Cards build: score mappings, calibration choices, and sanity-test scenarios for the CAPM for Agencies model.",
        "social_image": "/theory/figures/bcorp-impact-adjusted-return.png",
        "eyebrow": "Calibration Notes",
        "heading": "How the Current Decision Cards Are Calibrated",
        "toc_skip_first_heading": True,
        "deck": "Implementation detail for data nerds: the current score mappings, the moderation changes to the B-Corp overlay, and a few sanity-test scenarios run against the live calculator.",
        "meta": "Use this when you want to inspect the current decision-card math and calibration choices rather than just use the workflow.",
        "actions": [
            ("Open the Decision Cards", "../index.html", "primary"),
            ("Overview", "../overview/index.html", "secondary"),
            ("TL;DR", "./price-the-work-before-you-plan-it.html", "secondary"),
            ("Decision Guide", "./decision-guide.html", "secondary"),
            ("Walkthrough", "./walkthrough.html", "secondary"),
            ("Calibration Notes", "./calibration-notes.html", "secondary"),
            ("Why Discovery Comes First", "../essays/systems-thinking-for-web-development-agencies.html", "secondary"),
            ("Understand the Theory", "../theory/index.html", "secondary"),
        ],
        "toc_min": 2,
        "toc_max": 3,
        "lead": False,
    },
    {
        "source": ROOT / "essays" / "Systems Thinking for Web Development Agencies.md",
        "output": ROOT / "essays" / "systems-thinking-for-web-development-agencies.html",
        "title": "Why Discovery Comes First — Systems Thinking for Web Development Agencies",
        "description": "A companion essay on why discovery, migration, caching, and implementation need to be framed as systems problems rather than isolated technical tasks.",
        "social_image": "/theory/figures/capm-comparison.png",
        "eyebrow": "Companion Essay",
        "heading": "Why Discovery Comes First",
        "deck": "A companion essay on why some agency work should begin with a discovery phase: migration, caching, and implementation decisions often go wrong when they are framed as narrow technical tasks instead of connected systems problems.",
        "meta": "Use this when you want the upstream discovery argument behind better pricing, scoping, and delivery decisions — and then jump back into the Decision Cards.",
        "actions": [
            ("Open the Decision Cards", "../index.html", "primary"),
            ("Walkthrough", "../tldr/walkthrough.html", "secondary"),
            ("Decision Guide", "../tldr/decision-guide.html", "secondary"),
            ("Understand the Theory", "../theory/index.html", "secondary"),
            ("Overview", "../overview/index.html", "secondary"),
        ],
        "toc_min": 2,
        "toc_max": 3,
        "lead": False,
    },
]


HEADING_RE = re.compile(
    r'<div class="markdown-heading"><h([1-6]) class="heading-element">(.*?)</h\1><a id="user-content-([^"]+)" class="anchor"[^>]*>.*?</a></div>',
    re.DOTALL,
)
TAG_RE = re.compile(r"<[^>]+>")

TOKEN_REPLACEMENTS = {
    "[[APP_CARDS_ASIDE]]": """
<aside class="reader-aside">
  <p class="reader-aside-title">Open the live cards</p>
  <p>If you want to move between the text and the tool, jump straight into the interactive decision cards:</p>
  <ul>
    <li><a href="../index.html#layer1-card">Layer 1 card</a></li>
    <li><a href="../index.html#layer2-card">Layer 2 card</a></li>
    <li><a href="../index.html#bcorp-card">B-Corp card</a></li>
  </ul>
</aside>
""".strip(),
    "[[PLANNING_NOTE_ASIDE]]": """
<aside class="reader-note">
  <p><strong>Clarification:</strong> Price before you plan is narrower than it sounds: price before delivery planning is committed, not before the solutions team has done enough technical assessment to judge complexity, client concerns, and whether implementation or discovery is the thing to sell.</p>
</aside>
""".strip()
}


def render_markdown(markdown_text: str) -> str:
    req = request.Request(
        GITHUB_MARKDOWN_API,
        data=markdown_text.encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "text/plain",
            "User-Agent": USER_AGENT,
            "Accept": "text/html",
        },
    )
    with request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8")


def strip_tags(value: str) -> str:
    return html.unescape(TAG_RE.sub("", value)).replace("\n", " ").strip()


def replace_tokens(rendered_html: str) -> str:
    updated = rendered_html
    for token, replacement in TOKEN_REPLACEMENTS.items():
        updated = updated.replace(f"<p>{token}</p>", replacement)
        updated = updated.replace(f"{token}</p>", replacement)
        updated = updated.replace(token, replacement)
    return updated


def normalize_headings(rendered_html: str):
    toc_entries = []

    def replace_heading(match: re.Match[str]) -> str:
        level = int(match.group(1))
        inner_html = match.group(2)
        slug = match.group(3)
        text = re.sub(r"\s+", " ", strip_tags(inner_html))
        toc_entries.append((level, slug, text))
        return f'<h{level} id="{html.escape(slug)}">{inner_html}</h{level}>'

    normalized = HEADING_RE.sub(replace_heading, rendered_html)
    return normalized, toc_entries


def build_toc(entries, level_min: int, level_max: int, skip_first_heading: bool = False) -> str:
    filtered = [entry for entry in entries if level_min <= entry[0] <= level_max]
    if skip_first_heading and filtered:
        filtered = filtered[1:]
    if not filtered:
        return '<p class="empty-toc">No section headings.</p>'

    return "\n".join(
        f'<a class="level-{level}" href="#{html.escape(slug)}">{html.escape(text)}</a>'
        for level, slug, text in filtered
    )


def absolute_page_url(output_path: Path) -> str:
    relative = output_path.relative_to(ROOT).as_posix()
    return f"{SITE_URL}/{relative}"


def absolute_asset_url(asset_path: str) -> str:
    return f"{SITE_URL}{asset_path}"


def build_social_meta(page: dict) -> str:
    description = page.get("description") or strip_tags(page.get("deck", ""))
    page_url = absolute_page_url(page["output"])
    image_url = absolute_asset_url(page.get("social_image", "/theory/figures/capm-comparison.png"))
    title = page["title"]
    og_type = page.get("og_type", "article")

    return "\n".join([
        f'<meta name="description" content="{html.escape(description)}">',
        f'<link rel="canonical" href="{html.escape(page_url)}">',
        f'<meta property="og:site_name" content="CAPM for Agencies">',
        f'<meta property="og:type" content="{html.escape(og_type)}">',
        f'<meta property="og:title" content="{html.escape(title)}">',
        f'<meta property="og:description" content="{html.escape(description)}">',
        f'<meta property="og:url" content="{html.escape(page_url)}">',
        f'<meta property="og:image" content="{html.escape(image_url)}">',
        '<meta property="og:image:type" content="image/png">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{html.escape(title)}">',
        f'<meta name="twitter:description" content="{html.escape(description)}">',
        f'<meta name="twitter:image" content="{html.escape(image_url)}">',
    ])


def build_structured_data(page: dict) -> str:
    description = page.get("description") or strip_tags(page.get("deck", ""))
    page_url = absolute_page_url(page["output"])
    image_url = absolute_asset_url(page.get("social_image", "/theory/figures/capm-comparison.png"))
    data = {
        "@context": "https://schema.org",
        "@type": page.get("schema_type", "Article"),
        "headline": page["title"],
        "description": description,
        "url": page_url,
        "image": [image_url],
        "author": {
            "@type": "Person",
            "name": "Dan Knauss",
            "url": "https://dan.knauss.ca/",
        },
        "publisher": {
            "@type": "Organization",
            "name": "New Local Media",
            "url": "https://newlocalmedia.com/",
        },
        "isPartOf": {
            "@type": "WebSite",
            "name": "CAPM for Agencies",
            "url": SITE_URL + "/",
        },
    }
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + '</script>'


def build_actions(actions) -> str:
    return "\n".join(
        f'<a class="button {kind}" href="{html.escape(href)}">{html.escape(label)}</a>'
        for label, href, kind in actions
    )


def build_deck(page: dict) -> str:
    deck = page["deck"] if page.get("deck_html") else html.escape(page["deck"])
    link_text = page.get("deck_link_text")
    if not link_text:
        return deck

    link = f'<a href="{html.escape(page["deck_link_href"])}">{html.escape(link_text)}</a>'
    target = link_text if page.get("deck_html") else html.escape(link_text)
    return deck.replace(target, link, 1)


def build_footer() -> str:
    return (
        'A <a href="https://newlocalmedia.com/">New Local Media</a> project · '
        '<a href="https://linkedin.com/in/danknauss">LinkedIn</a> · '
        '<a href="mailto:dan@newlocalmedia.com?subject=CAPM%20for%20Agencies%20feedback">Feedback</a> · '
        '<a href="https://github.com/newlocalmedia/capm-for-agencies/issues">Issues</a><br>'
        ' '
        'This repository and its web content are licensed under the '
        '<a href="https://creativecommons.org/licenses/by-sa/4.0/">'
        'Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)'
        '</a>. See the <a href="../LICENSE">LICENSE</a>.'
    )


def build_html(page: dict, article_html: str, toc_html: str) -> str:
    article_intro = ""
    if page.get("article_kicker"):
        article_intro = f'<div class="article-kicker">{html.escape(page["article_kicker"])}</div>'

    lead_script = """
  <script>
    const firstParagraph = document.querySelector('.prose p');
    if (firstParagraph) {
      firstParagraph.classList.add('lead');
    }
  </script>
""" if page["lead"] else ""

    lightbox_script = """
  <script>
    const lightbox = document.querySelector('[data-lightbox]');
    const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
    const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
    const lightboxClose = lightbox?.querySelector('[data-lightbox-close]');
    const imageLinks = document.querySelectorAll('.prose a[href$=".png"], .prose a[href$=".jpg"], .prose a[href$=".jpeg"], .prose a[href$=".webp"]');

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function openLightbox(href, altText) {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = href;
      lightboxImage.alt = altText || '';
      if (lightboxCaption) {
        lightboxCaption.textContent = altText || '';
      }
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    imageLinks.forEach((link) => {
      const image = link.querySelector('img');
      if (!image) return;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openLightbox(link.getAttribute('href'), image.getAttribute('alt'));
      });
    });

    lightbox?.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightboxClose?.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    });
  </script>
"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(page["title"])}</title>
{build_social_meta(page)}
{build_structured_data(page)}
<style>
{PAGE_STYLE}
</style>
</head>
<body>
  <div class="shell">
    <header class="masthead">
      <div class="eyebrow">{html.escape(page["eyebrow"])}</div>
      <div class="masthead-grid">
        <div>
          <h1>{html.escape(page["heading"])}</h1>
          <p class="deck">{build_deck(page)}</p>
        </div>
        <div class="meta">
          <div class="meta-copy">{html.escape(page["meta"])}</div>
          <div class="actions">
            {build_actions(page["actions"])}
          </div>
        </div>
      </div>
    </header>

    <div class="layout">
      <aside class="toc-card">
        <h2 class="toc-title">On This Page</h2>
        <nav class="toc">
          {toc_html}
        </nav>
      </aside>

      <main class="article-card">
        <div class="article-frame">
          <article class="prose">
            {article_intro}
            {article_html}
          </article>
          <footer class="site-footer">
            {build_footer()}
          </footer>
        </div>
      </main>
    </div>
  </div>
  <div class="lightbox" data-lightbox aria-hidden="true">
    <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded image view">
      <button class="lightbox-close" type="button" aria-label="Close image" data-lightbox-close>&times;</button>
      <img class="lightbox-image" src="" alt="" data-lightbox-image>
      <div class="lightbox-caption" data-lightbox-caption></div>
    </div>
  </div>
{lead_script}
{lightbox_script}
</body>
</html>
"""


def generate_page(page: dict) -> None:
    markdown_text = page["source"].read_text(encoding="utf-8")
    rendered_html = render_markdown(markdown_text)
    rendered_html = replace_tokens(rendered_html)
    normalized_html, toc_entries = normalize_headings(rendered_html)
    toc_html = build_toc(
        toc_entries,
        page["toc_min"],
        page["toc_max"],
        page.get("toc_skip_first_heading", False),
    )
    output_html = build_html(page, normalized_html, toc_html)
    page["output"].write_text(output_html, encoding="utf-8")


def main() -> None:
    for page in PAGES:
        generate_page(page)
        print(f"built {page['output'].relative_to(ROOT)}")


if __name__ == "__main__":
    main()
