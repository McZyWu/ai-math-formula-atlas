"use client";

import katex from "katex";

export function MathFormula({
  latex,
  display = false,
  className = "",
}: {
  latex: string;
  display?: boolean;
  className?: string;
}) {
  let html: string;
  try {
    html = katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
      output: "html",
    });
  } catch {
    html = `<code>${latex}</code>`;
  }

  return (
    <span
      className={`math-formula ${display ? "math-formula--display" : ""} ${className}`}
      aria-label={latex}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
