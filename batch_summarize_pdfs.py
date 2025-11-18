"""Batch summarize PDF papers related to indoor emergency navigation.

This script discovers PDF files within a directory (default: ``literature/``), extracts
raw text, and passes the content to a placeholder summarization function. The resulting
metadata is written to both JSON and CSV outputs for downstream analysis.

The implementation intentionally separates

* file discovery and I/O
* text extraction
* language-model based summarization (represented by ``summarize_paper``)

so that ``summarize_paper`` can later be replaced with an OpenAI API call or any other
summarization backend without touching the surrounding plumbing.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Dict, Iterable, List

try:
    from pypdf import PdfReader  # type: ignore
except ImportError:  # pragma: no cover - helper message for missing dependency.
    PdfReader = None


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""

    parser = argparse.ArgumentParser(
        description="Extract text from PDFs and summarize them into JSON/CSV records."
    )
    parser.add_argument(
        "root_dir",
        nargs="?",
        default="literature",
        help="Directory containing PDF files (default: literature/).",
    )
    parser.add_argument(
        "--json-output",
        default="literature_summary.json",
        help="Path to the JSON output file (default: literature_summary.json).",
    )
    parser.add_argument(
        "--csv-output",
        default="literature_summary.csv",
        help="Path to the CSV output file (default: literature_summary.csv).",
    )
    return parser.parse_args()


def find_pdf_files(root_dir: Path) -> Iterable[Path]:
    """Yield all PDF files recursively under ``root_dir`` in sorted order."""

    if not root_dir.exists():
        raise FileNotFoundError(f"Directory not found: {root_dir}")

    return sorted(root_dir.rglob("*.pdf"))


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extract raw text from a PDF file using ``pypdf``.

    Args:
        pdf_path: Path to the PDF file.

    Returns:
        A string containing concatenated page text.
    """

    if PdfReader is None:
        raise RuntimeError(
            "pypdf is required for text extraction. Please install it via 'pip install pypdf'."
        )

    reader = PdfReader(str(pdf_path))
    page_texts: List[str] = []
    for page in reader.pages:
        try:
            page_texts.append(page.extract_text() or "")
        except Exception as exc:  # pragma: no cover - defensive logging hook.
            raise RuntimeError(f"Failed to extract text from {pdf_path}: {exc}") from exc
    return "\n".join(page_texts)


def summarize_paper(text: str, filename: str) -> Dict[str, str]:
    """Summarize the paper represented by ``text``.

    This function is a placeholder that defines the exact interface expected from a
    language-model powered summarizer. Replace the body with a call to OpenAI (or any
    other API) that returns a dictionary with the required fields.

    Args:
        text: The raw text content extracted from the PDF.
        filename: Name of the PDF file, useful for generating IDs or providing context.

    Returns:
        A dictionary with the schema documented in the module docstring:
        ``id``, ``title``, ``year``, ``venue``, ``study_type``, ``environment``,
        ``interface_type``, ``task``, ``participants``, ``measures``, ``main_findings``,
        ``relevance_to_my_thesis``.
    """

    # NOTE: Replace this stub with an actual LLM call in the future.
    return {
        "id": filename,
        "title": "TBD",
        "year": "",
        "venue": "",
        "study_type": "",
        "environment": "",
        "interface_type": "",
        "task": "",
        "participants": "",
        "measures": "",
        "main_findings": "- Placeholder finding\n- Add LLM output here",
        "relevance_to_my_thesis": "Placeholder relevance for future LLM integration.",
    }


def summarize_pdfs(pdf_paths: Iterable[Path]) -> List[Dict[str, str]]:
    """Extract text and summarize each PDF file."""

    summaries: List[Dict[str, str]] = []
    for pdf_path in pdf_paths:
        text = extract_text_from_pdf(pdf_path)
        summary = summarize_paper(text=text, filename=pdf_path.name)
        summaries.append(summary)
    return summaries


def write_json(data: List[Dict[str, str]], output_path: Path) -> None:
    """Write summaries to a UTF-8 JSON file."""

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def write_csv(data: List[Dict[str, str]], output_path: Path) -> None:
    """Write summaries to a CSV file with a fixed column order."""

    if not data:
        return

    fieldnames = list(data[0].keys())
    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)


def main() -> None:
    """Entry point for command-line execution."""

    args = parse_args()
    root_dir = Path(args.root_dir)

    pdf_paths = list(find_pdf_files(root_dir))
    summaries = summarize_pdfs(pdf_paths)

    write_json(summaries, Path(args.json_output))
    write_csv(summaries, Path(args.csv_output))


if __name__ == "__main__":
    main()
