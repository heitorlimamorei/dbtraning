"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CodeMirror, {
  EditorView,
  keymap,
} from "@uiw/react-codemirror";
import { SQLite, sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { useActiveTextarea } from "@/contexts/active-textarea-context";

export function SQLEditor({ onChange, onRun, placeholder, value }) {
  const onRunRef = useRef(onRun);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  const extensions = useMemo(
    () => [
      sql({ dialect: SQLite }),
      EditorView.contentAttributes.of({
        "aria-label": "Editor SQL",
        spellcheck: "false",
      }),
      keymap.of([
        {
          key: "Mod-Enter",
          run() {
            onRunRef.current?.();
            return true;
          },
        },
      ]),
    ],
    [],
  );

  return (
    <div
      style={{
        background: "#282C34",
        border: `2px solid ${isFocused ? "#528BFF" : "#3E4451"}`,
        borderRadius: 12,
        boxShadow: isFocused ? "0 0 0 3px rgba(82, 139, 255, 0.16)" : "none",
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.15s, box-shadow 0.15s",
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
      <CodeMirror
        basicSetup={{
          foldGutter: false,
          highlightActiveLineGutter: false,
          lineNumbers: false,
        }}
        className="sql-code-editor"
        extensions={extensions}
        indentWithTab
        minHeight="150px"
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        theme={oneDark}
        value={value}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
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
