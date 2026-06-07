#!/usr/bin/env python3
"""Inline a report's CSS and JS into a single self-contained HTML file.

The report is authored as index.html that links ./style.css and ./app.js
(easy to write and read). Browsers and inline previewers only reliably load
a single file, so before delivering we fold the stylesheet and script into
the HTML. Chart.js (if used) stays as a CDN <script> — that loads fine over
the network, including from a local file.

Usage:
    python inline_assets.py <input.html> [--assets <dir>] [--out <file.html>]

Defaults: assets dir = the input file's directory; output = <input stem>-report.html
next to the input.
"""

import argparse
import pathlib
import sys


def inline(
    html_path: pathlib.Path, assets_dir: pathlib.Path, out_path: pathlib.Path
) -> None:
    html = html_path.read_text(encoding="utf-8")
    css = (assets_dir / "style.css").read_text(encoding="utf-8")
    js = (assets_dir / "app.js").read_text(encoding="utf-8")

    link_tag = '<link rel="stylesheet" href="style.css">'
    script_tag = '<script src="app.js" defer></script>'

    if link_tag not in html:
        sys.exit(f"Could not find the stylesheet link to replace:\n  {link_tag}")
    if script_tag not in html:
        sys.exit(f"Could not find the app.js script tag to replace:\n  {script_tag}")

    # Guard against a literal </script> inside the JS prematurely closing the tag.
    js_safe = js.replace("</script>", "<\\/script>")

    html = html.replace(link_tag, "<style>\n" + css + "\n</style>")
    html = html.replace(script_tag, "<script>\n" + js_safe + "\n</script>")

    out_path.write_text(html, encoding="utf-8")
    kb = len(html.encode("utf-8")) / 1024
    print(f"Wrote {out_path} ({kb:.0f} KB, self-contained)")


def main() -> None:
    ap = argparse.ArgumentParser(description="Inline CSS/JS into a single HTML file.")
    ap.add_argument("input", type=pathlib.Path, help="The authored index.html")
    ap.add_argument(
        "--assets",
        type=pathlib.Path,
        default=None,
        help="Directory holding style.css and app.js (default: input's dir)",
    )
    ap.add_argument(
        "--out",
        type=pathlib.Path,
        default=None,
        help="Output path (default: <stem>-report.html next to input)",
    )
    args = ap.parse_args()

    html_path = args.input
    assets_dir = args.assets or html_path.parent
    out_path = args.out or html_path.with_name(
        html_path.stem.replace("index", "report").rstrip("-") + ".html"
    )
    if out_path == html_path:
        out_path = html_path.with_name(html_path.stem + "-report.html")

    inline(html_path, assets_dir, out_path)


if __name__ == "__main__":
    main()
