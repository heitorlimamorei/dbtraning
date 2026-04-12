"use client";

import { useEffect, useRef } from "react";
import { useActiveTextarea } from "@/contexts/active-textarea-context";
import { HighlightedSQL } from "@/components/training/sql-highlight";

export function SQLEditor({ onChange, onRun, placeholder, value }) {
  const textareaRef = useRef(null);
  const overlayRef = useRef(null);

  function syncScroll() {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      onRun?.();
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const nextValue = value.slice(0, start) + "  " + value.slice(end);

      onChange(nextValue);

      requestAnimationFrame(() => {
        event.target.selectionStart = start + 2;
        event.target.selectionEnd = start + 2;
      });
    }
  }

  const sharedStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    lineHeight: 1.7,
    padding: "14px 16px",
    paddingTop: 28,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  return (
    <div
      style={{
        background: "#282C34",
        border: "2px solid #3E4451",
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.2s",
      }}
    >
      <div
        style={{
          background: "#3E4451",
          borderRadius: 6,
          color: "#61AFEF",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1,
          padding: "2px 8px",
          position: "absolute",
          right: 8,
          top: 6,
          zIndex: 3,
        }}
      >
        SQL
      </div>
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          ...sharedStyle,
          color: "#ABB2BF",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          position: "absolute",
          zIndex: 1,
        }}
      >
        <HighlightedSQL code={value} />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
        style={{
          ...sharedStyle,
          background: "transparent",
          border: "none",
          boxSizing: "border-box",
          caretColor: "#528BFF",
          color: "transparent",
          minHeight: 130,
          outline: "none",
          position: "relative",
          resize: "vertical",
          width: "100%",
          zIndex: 2,
        }}
        onBlur={(event) => {
          const container = event.target.closest('[data-editor="sql"]');

          if (container) {
            container.style.borderColor = "#3E4451";
          }
        }}
        onFocus={(event) => {
          const container = event.target.closest('[data-editor="sql"]');

          if (container) {
            container.style.borderColor = "#528BFF";
          }
        }}
      />
    </div>
  );
}

export function RAEditor({ editorId, onChange, placeholder, value }) {
  const textareaRef = useRef(null);
  const { register } = useActiveTextarea();

  useEffect(() => {
    if (textareaRef.current) {
      register(editorId, textareaRef, value, onChange);
    }
  }, [editorId, onChange, register, value]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          background: "#FFF5EC",
          borderRadius: 6,
          color: "#E8A87C",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1,
          padding: "2px 8px",
          position: "absolute",
          right: 10,
          top: 8,
          zIndex: 2,
        }}
      >
        RA
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        onFocus={() => register(editorId, textareaRef, value, onChange, true)}
        style={{
          background: "#F8F9FC",
          border: "2px solid #E2E4EA",
          borderRadius: 12,
          boxSizing: "border-box",
          color: "#1A1D29",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.7,
          minHeight: 90,
          outline: "none",
          padding: "14px 16px",
          paddingTop: 28,
          resize: "vertical",
          transition: "border-color 0.2s",
          width: "100%",
        }}
        onBlur={(event) => {
          event.target.style.borderColor = "#E2E4EA";
        }}
        onFocusCapture={(event) => {
          event.target.style.borderColor = "#E8A87C";
        }}
      />
    </div>
  );
}
