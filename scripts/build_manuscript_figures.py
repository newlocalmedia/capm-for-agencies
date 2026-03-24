#!/usr/bin/env python3

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "manuscript" / "figures"

WIDTH = 1600
HEIGHT = 980
PADDING_X = 110
PADDING_Y = 120

COLORS = {
    "paper": "#f8f2e8",
    "paper_deep": "#efe6d8",
    "canvas": "#e8ddcc",
    "ink": "#201d1a",
    "muted": "#6a635b",
    "line": "#d4c8b6",
    "axis": "#7d7468",
    "accent": "#8c3f2f",
    "blue": "#23486a",
    "green": "#426347",
    "gold": "#ba8a2d",
    "red": "#9f4032",
    "white": "#fffdf8",
}

GEORGIA = Path("/System/Library/Fonts/Supplemental/Georgia.ttf")
GEORGIA_BOLD = Path("/System/Library/Fonts/Supplemental/Georgia Bold.ttf")
GEORGIA_ITALIC = Path("/System/Library/Fonts/Supplemental/Georgia Italic.ttf")
MENLO = Path("/System/Library/Fonts/Menlo.ttc")


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        return ImageFont.truetype(str(path), size=size)
    except OSError:
        return ImageFont.load_default()


TITLE_FONT = load_font(GEORGIA_BOLD, 52)
SUBTITLE_FONT = load_font(GEORGIA_ITALIC, 24)
LABEL_FONT = load_font(GEORGIA_BOLD, 24)
BODY_FONT = load_font(GEORGIA, 24)
SMALL_FONT = load_font(GEORGIA, 20)
MONO_FONT = load_font(MENLO, 20)
MONO_SMALL = load_font(MENLO, 17)


@dataclass
class PlotArea:
    x0: int
    y0: int
    x1: int
    y1: int
    x_max: float
    y_max: float
    x_min: float = 0.0
    y_min: float = 0.0

    def map(self, x: float, y: float) -> tuple[int, int]:
        px = self.x0 + (x - self.x_min) / (self.x_max - self.x_min) * (self.x1 - self.x0)
        py = self.y1 - (y - self.y_min) / (self.y_max - self.y_min) * (self.y1 - self.y0)
        return int(px), int(py)


def new_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (WIDTH, HEIGHT), COLORS["canvas"])
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        (34, 34, WIDTH - 34, HEIGHT - 34),
        radius=36,
        fill=COLORS["paper"],
        outline=COLORS["line"],
        width=2,
    )
    draw.rounded_rectangle(
        (58, 58, WIDTH - 58, HEIGHT - 58),
        radius=28,
        fill=COLORS["paper"],
        outline=COLORS["paper_deep"],
        width=2,
    )
    return img, draw


def text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, font, fill: str = COLORS["ink"], anchor: str | None = None):
    draw.text(xy, value, font=font, fill=fill, anchor=anchor)


def multiline_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, font, fill: str = COLORS["ink"], spacing: int = 7):
    draw.multiline_text(xy, value, font=font, fill=fill, spacing=spacing)


def draw_title(draw: ImageDraw.ImageDraw, title: str, subtitle: str):
    text(draw, (PADDING_X, 82), title, TITLE_FONT)
    text(draw, (PADDING_X, 146), subtitle, SUBTITLE_FONT, fill=COLORS["muted"])


def draw_axes(draw: ImageDraw.ImageDraw, area: PlotArea, x_ticks: Iterable[float], y_ticks: Iterable[float], x_label: str, y_label: str):
    draw.line((area.x0, area.y0, area.x0, area.y1), fill=COLORS["axis"], width=3)
    draw.line((area.x0, area.y1, area.x1, area.y1), fill=COLORS["axis"], width=3)

    for y in y_ticks:
        px0, py = area.map(area.x_min, y)
        px1, _ = area.map(area.x_max, y)
        draw.line((px0, py, px1, py), fill=COLORS["line"], width=1)
        text(draw, (px0 - 18, py), f"{int(y)}%", MONO_SMALL, fill=COLORS["muted"], anchor="rm")

    for x in x_ticks:
        px, py0 = area.map(x, area.y_min)
        _, py1 = area.map(x, area.y_max)
        draw.line((px, py0, px, py1), fill=COLORS["line"], width=1)
        text(draw, (px, py0 + 18), f"{x:.1f}", MONO_SMALL, fill=COLORS["muted"], anchor="ma")

    text(draw, ((area.x0 + area.x1) // 2, area.y1 + 62), x_label, LABEL_FONT, fill=COLORS["muted"], anchor="ma")
    text(draw, (area.x0 - 72, (area.y0 + area.y1) // 2), y_label, LABEL_FONT, fill=COLORS["muted"], anchor="ma")


def draw_line(draw: ImageDraw.ImageDraw, area: PlotArea, points: list[tuple[float, float]], fill: str, width: int = 6):
    mapped = [area.map(x, y) for x, y in points]
    draw.line(mapped, fill=fill, width=width, joint="curve")


def circle(draw: ImageDraw.ImageDraw, center: tuple[int, int], radius: int, fill: str, outline: str = COLORS["white"], width: int = 3):
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill, outline=outline, width=width)


def dashed_line(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], fill: str, width: int = 2, dash: int = 12, gap: int = 10):
    x0, y0 = start
    x1, y1 = end
    dx = x1 - x0
    dy = y1 - y0
    length = (dx ** 2 + dy ** 2) ** 0.5
    if not length:
        return
    ux = dx / length
    uy = dy / length
    dist = 0
    while dist < length:
        seg_start = dist
        seg_end = min(dist + dash, length)
        sx = x0 + ux * seg_start
        sy = y0 + uy * seg_start
        ex = x0 + ux * seg_end
        ey = y0 + uy * seg_end
        draw.line((sx, sy, ex, ey), fill=fill, width=width)
        dist += dash + gap


def label_box(draw: ImageDraw.ImageDraw, xy: tuple[int, int], label: str, fill: str, text_fill: str = COLORS["white"]):
    x, y = xy
    w = int(draw.textlength(label, font=MONO_FONT)) + 28
    h = 38
    draw.rounded_rectangle((x, y, x + w, y + h), radius=16, fill=fill)
    text(draw, (x + w // 2, y + h // 2 + 1), label, MONO_FONT, fill=text_fill, anchor="mm")


def save_outputs(img: Image.Image, stem: str):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    png_path = OUT_DIR / f"{stem}.png"
    pdf_path = OUT_DIR / f"{stem}.pdf"
    img.save(png_path, format="PNG", optimize=True)
    img.convert("RGB").save(pdf_path, format="PDF", resolution=150.0)


def wrap_text(draw: ImageDraw.ImageDraw, value: str, font, width: int) -> str:
    words = value.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        trial = " ".join(current + [word])
        if draw.textlength(trial, font=font) <= width or not current:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return "\n".join(lines)


def build_security_market_line():
    img, draw = new_canvas()
    draw_title(draw, "Security Market Line", "The baseline CAPM view: higher beta demands higher return.")
    area = PlotArea(200, 250, 1120, 820, 2.2, 30, 0, 0)
    draw_axes(draw, area, [0.0, 0.5, 1.0, 1.5, 2.0], [5, 10, 15, 20, 25, 30], "β (systematic risk)", "Required return")

    rf = 8
    premium = 9
    draw_line(draw, area, [(0, rf), (2.0, rf + premium * 2.0)], COLORS["accent"], width=7)
    rf_point = area.map(0, rf)
    circle(draw, rf_point, 10, COLORS["accent"])
    text(draw, (rf_point[0] + 22, rf_point[1] - 18), "R_f", MONO_FONT, fill=COLORS["accent"])

    above = area.map(1.45, 24.5)
    below = area.map(1.55, 18.0)
    on_line = area.map(0.85, rf + premium * 0.85)

    circle(draw, above, 12, COLORS["green"])
    circle(draw, below, 12, COLORS["red"])
    circle(draw, on_line, 11, COLORS["blue"])

    text(draw, (above[0] + 20, above[1] - 28), "Above the line:\npriced better than required", BODY_FONT, fill=COLORS["green"])
    text(draw, (below[0] + 22, below[1] - 12), "Below the line:\nunderpricing risk", BODY_FONT, fill=COLORS["red"])
    text(draw, (on_line[0] - 12, on_line[1] - 54), "On the line:\nmeets the hurdle", BODY_FONT, fill=COLORS["blue"], anchor="ra")

    callout = (1160, 286, 1510, 650)
    draw.rounded_rectangle(callout, radius=26, fill="#fffaf4", outline=COLORS["line"], width=2)
    label_box(draw, (1190, 316), "E(R) = R_f + β × (R_m − R_f)", COLORS["blue"])
    explainer = (
        "For agency work, the line is a minimum acceptable margin.\n\n"
        "The intercept is your baseline low-risk margin.\n"
        "The slope is the reward required for taking on more systematic risk."
    )
    wrapped = "\n\n".join(wrap_text(draw, block, BODY_FONT, 280) for block in explainer.split("\n\n"))
    multiline_text(draw, (1190, 382), wrapped, BODY_FONT, fill=COLORS["ink"], spacing=10)
    save_outputs(img, "security-market-line")


def build_layer1_calibration():
    img, draw = new_canvas()
    draw_title(draw, "Layer One: Systematic Calibration", "Systematic conditions rotate the line steeper or flatter for every deal.")
    area = PlotArea(180, 250, 1120, 820, 2.2, 34, 0, 0)
    draw_axes(draw, area, [0.0, 0.5, 1.0, 1.5, 2.0], [5, 10, 15, 20, 25, 30], "β (baseline engagement risk)", "Required margin")

    rf = 9
    calm = [(0, rf), (2.0, 21)]
    base = [(0, rf), (2.0, 25)]
    turbulent = [(0, rf), (2.0, 30)]
    draw_line(draw, area, calm, COLORS["green"], width=5)
    draw_line(draw, area, base, COLORS["blue"], width=5)
    draw_line(draw, area, turbulent, COLORS["accent"], width=6)

    beta = 1.2
    px, _ = area.map(beta, 0)
    draw.line((px, area.y0, px, area.y1), fill=COLORS["gold"], width=3)
    for name, point, color in [
        ("Calm market", area.map(beta, rf + (21 - rf) / 2.0 * beta), COLORS["green"]),
        ("Normal market", area.map(beta, rf + (25 - rf) / 2.0 * beta), COLORS["blue"]),
        ("Turbulent market", area.map(beta, rf + (30 - rf) / 2.0 * beta), COLORS["accent"]),
    ]:
        circle(draw, point, 10, color)
        text(draw, (point[0] + 20, point[1] - 10), name, BODY_FONT, fill=color)

    draw.polygon([(930, 255), (965, 255), (948, 215)], fill=COLORS["accent"])
    text(draw, (1000, 206), "Talent crunch, platform instability,\nregulatory repricing", BODY_FONT, fill=COLORS["accent"])
    text(draw, (992, 680), "Same engagement beta.\nDifferent margin hurdle\nonce Layer One changes.", LABEL_FONT, fill=COLORS["ink"])

    formula_box = (1160, 286, 1510, 648)
    draw.rounded_rectangle(formula_box, radius=26, fill="#fffaf4", outline=COLORS["line"], width=2)
    label_box(draw, (1190, 316), "L1 Output", COLORS["accent"])
    explainer = (
        "Periodic portfolio review sets:\n\n"
        "• the baseline risk premium\n"
        "• what β = 1.0 means right now\n"
        "• whether the whole line gets steeper or flatter"
    )
    wrapped = "\n\n".join(wrap_text(draw, block, BODY_FONT, 290) for block in explainer.split("\n\n"))
    multiline_text(draw, (1190, 382), wrapped, BODY_FONT, spacing=11)
    save_outputs(img, "layer1-systematic-calibration")


def build_layer2_blended_beta():
    img, draw = new_canvas()
    draw_title(draw, "Layer Two: Blended Beta", "Engagement score plus Layer One factor produces the pricing-governance coefficient.")
    area = PlotArea(180, 250, 1120, 820, 2.2, 34, 0, 0)
    draw_axes(draw, area, [0.0, 0.5, 1.0, 1.5, 2.0], [5, 10, 15, 20, 25, 30], "Blended β", "Required margin")

    rf = 9
    line_end = 28
    draw_line(draw, area, [(0, rf), (2.0, line_end)], COLORS["blue"], width=6)

    engagements = [
        ("Safe bet", 0.85, 19.5, COLORS["green"], "Clear the hurdle"),
        ("Stretch project", 1.35, 22.5, COLORS["gold"], "Close enough to renegotiate"),
        ("Money pit", 1.85, 20.5, COLORS["red"], "Fails the hurdle"),
    ]
    for label, beta, proposed, color, verdict in engagements:
        required = rf + (line_end - rf) / 2.0 * beta
        req_pt = area.map(beta, required)
        prop_pt = area.map(beta, proposed)
        dashed_line(draw, req_pt, prop_pt, fill=color, width=3)
        circle(draw, req_pt, 9, COLORS["blue"])
        circle(draw, prop_pt, 12, color)
        text(draw, (prop_pt[0] + 18, prop_pt[1] - 16), f"{label}\n{verdict}", BODY_FONT, fill=color)

    formula_box = (1160, 254, 1510, 708)
    draw.rounded_rectangle(formula_box, radius=26, fill="#fffaf4", outline=COLORS["line"], width=2)
    label_box(draw, (1190, 280), "Hybrid formula", COLORS["blue"])
    formula = "Blended β =\n(Engagement score / 21)\n× Layer One factor"
    multiline_text(draw, (1190, 342), formula, MONO_FONT, fill=COLORS["ink"], spacing=11)
    note = (
        "This is not market covariance.\n"
        "It is a governance coefficient\n"
        "for comparing proposed margin\n"
        "to the required margin."
    )
    multiline_text(draw, (1190, 470), note, BODY_FONT, fill=COLORS["ink"], spacing=10)
    text(draw, (1190, 630), "Governance, not precision.", LABEL_FONT, fill=COLORS["accent"])
    save_outputs(img, "layer2-blended-beta")


def draw_panel_box(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, subtitle: str):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=24, fill="#fffaf4", outline=COLORS["line"], width=2)
    text(draw, (x0 + 24, y0 + 24), title, LABEL_FONT, fill=COLORS["ink"])
    text(draw, (x0 + 24, y0 + 60), subtitle, SMALL_FONT, fill=COLORS["muted"])


def draw_panel_axes(draw: ImageDraw.ImageDraw, area: PlotArea):
    draw.line((area.x0, area.y0, area.x0, area.y1), fill=COLORS["axis"], width=2)
    draw.line((area.x0, area.y1, area.x1, area.y1), fill=COLORS["axis"], width=2)


def build_comparison():
    img, draw = new_canvas()
    draw_title(draw, "Standard, Layered, and B-Corp CAPM", "Same structure, different uses: finance model, pricing governance, and impact-adjusted governance.")

    panel_w = 392
    gutter = 36
    top = 240
    left = 96
    boxes = []
    for i in range(3):
        x0 = left + i * (panel_w + gutter)
        x1 = x0 + panel_w
        boxes.append((x0, top, x1, 790))

    panel_meta = [
        ("Standard CAPM", "Pure finance model"),
        ("Layered agency CAPM", "Systematic + engagement risk"),
        ("B-Corp agency CAPM", "Impact-adjusted hurdle"),
    ]
    for box, meta in zip(boxes, panel_meta):
        draw_panel_box(draw, box, meta[0], meta[1])

    areas = [
        PlotArea(box[0] + 42, box[1] + 122, box[2] - 34, box[3] - 80, 2.1, 30, 0, 0)
        for box in boxes
    ]

    rf = 8
    for area in areas:
        draw_panel_axes(draw, area)

    # Standard panel
    draw_line(draw, areas[0], [(0, rf), (2.0, 26)], COLORS["accent"], width=5)
    for label, x, y, color in [("Asset A", 0.8, 15.5, COLORS["blue"]), ("Asset B", 1.6, 23.0, COLORS["green"])]:
        pt = areas[0].map(x, y)
        circle(draw, pt, 9, color)
        text(draw, (pt[0] + 14, pt[1] - 14), label, SMALL_FONT, fill=color)
    text(draw, (boxes[0][0] + 26, boxes[0][3] - 48), "Question: does return justify risk?", SMALL_FONT, fill=COLORS["muted"])

    # Layered panel
    draw_line(draw, areas[1], [(0, rf), (2.0, 22)], COLORS["green"], width=4)
    draw_line(draw, areas[1], [(0, rf), (2.0, 27)], COLORS["blue"], width=5)
    beta = 1.3
    req = areas[1].map(beta, rf + (27 - rf) / 2.0 * beta)
    deal = areas[1].map(beta, 22.5)
    dashed_line(draw, req, deal, fill=COLORS["gold"], width=3)
    circle(draw, req, 8, COLORS["blue"])
    circle(draw, deal, 10, COLORS["gold"])
    text(draw, (deal[0] + 12, deal[1] - 10), "Actual deal", SMALL_FONT, fill=COLORS["gold"])
    text(draw, (boxes[1][0] + 26, boxes[1][3] - 48), "Question: does the deal clear the hurdle?", SMALL_FONT, fill=COLORS["muted"])

    # B-Corp panel
    draw_line(draw, areas[2], [(0, rf), (2.0, 27)], COLORS["blue"], width=5)
    mission_ghost = areas[2].map(1.0, 17.5)
    mission_real = areas[2].map(1.0, 14.0)
    harm_ghost = areas[2].map(1.6, 23.2)
    harm_real = areas[2].map(1.6, 27.0)
    for start, end, color in [(mission_ghost, mission_real, COLORS["green"]), (harm_ghost, harm_real, COLORS["red"])]:
        dashed_line(draw, start, end, fill=color, width=3)
        circle(draw, start, 8, COLORS["paper_deep"], outline=COLORS["muted"], width=2)
        circle(draw, end, 10, color)
    text(draw, (mission_real[0] + 14, mission_real[1] - 16), "Mission-aligned\nimpact discount", SMALL_FONT, fill=COLORS["green"])
    text(draw, (harm_real[0] + 14, harm_real[1] - 12), "Harm premium", SMALL_FONT, fill=COLORS["red"])
    text(draw, (boxes[2][0] + 26, boxes[2][3] - 48), "Question: what risk and impact should clear?", SMALL_FONT, fill=COLORS["muted"])

    save_outputs(img, "capm-comparison")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    build_security_market_line()
    build_layer1_calibration()
    build_layer2_blended_beta()
    build_comparison()
    print(f"built figures in {OUT_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
