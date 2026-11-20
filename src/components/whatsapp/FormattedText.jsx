import React, { Fragment } from "react";

const TOKEN = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|```[^`]+```)/g;

export function highlightSubstrings(content, highlight = "", isCurrentMatch = false) {
  if (!highlight || !content || typeof content !== "string") return content;
  const needle = highlight.trim();
  if (!needle) return content;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${escaped})`, "ig");
  const parts = content.split(pattern);

  return parts.map((part, index) =>
    part.toLowerCase() === needle.toLowerCase() ? (
      <mark
        key={index}
        className={`rounded-xs px-0.5 text-inherit transition-all ${
          isCurrentMatch
            ? "bg-[#ff9e00] text-black font-semibold shadow-xs"
            : "bg-[#ffe08a] text-inherit font-medium"
        }`}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function FormattedText({ text = "", highlight = "", isCurrentMatch = false }) {
  if (!text) return null;

  return (
    <>
      {text.split("\n").map((line, li, arr) => (
        <Fragment key={li}>
          {line.split(TOKEN).map((part, i) => {
            if (/^\*[^*]+\*$/.test(part)) {
              return (
                <strong key={i} className="font-semibold text-inherit">
                  {highlightSubstrings(part.slice(1, -1), highlight, isCurrentMatch)}
                </strong>
              );
            }
            if (/^_[^_]+_$/.test(part)) {
              return (
                <em key={i} className="italic text-inherit">
                  {highlightSubstrings(part.slice(1, -1), highlight, isCurrentMatch)}
                </em>
              );
            }
            if (/^~[^~]+~$/.test(part)) {
              return (
                <s key={i} className="line-through text-inherit">
                  {highlightSubstrings(part.slice(1, -1), highlight, isCurrentMatch)}
                </s>
              );
            }
            if (/^```[^`]+```$/.test(part)) {
              return (
                <code key={i} className="rounded bg-black/5 px-1 py-0.5 font-mono text-[13px]">
                  {highlightSubstrings(part.slice(3, -3), highlight, isCurrentMatch)}
                </code>
              );
            }
            return (
              <Fragment key={i}>
                {highlightSubstrings(part, highlight, isCurrentMatch)}
              </Fragment>
            );
          })}
          {li < arr.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}
