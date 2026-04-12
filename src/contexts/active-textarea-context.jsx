"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";

const ActiveTextareaContext = createContext({
  insertSymbol: () => {},
  register: () => {},
});

export function ActiveTextareaProvider({ children }) {
  const editorsRef = useRef({});
  const activeRef = useRef(null);

  const register = useCallback((id, ref, value, onChange, setActive = false) => {
    editorsRef.current[id] = { onChange, ref, value };

    if (setActive) {
      activeRef.current = id;
    }
  }, []);

  const insertSymbol = useCallback((symbol) => {
    const activeId = activeRef.current;

    if (!activeId) {
      return;
    }

    const editor = editorsRef.current[activeId];

    if (!editor) {
      return;
    }

    const element = editor.ref.current;

    if (!element) {
      return;
    }

    const start = element.selectionStart ?? editor.value.length;
    const end = element.selectionEnd ?? start;

    editor.onChange(
      editor.value.slice(0, start) + symbol + editor.value.slice(end),
    );

    requestAnimationFrame(() => {
      element.focus();
      const nextPosition = start + symbol.length;
      element.setSelectionRange(nextPosition, nextPosition);
    });
  }, []);

  const value = useMemo(
    () => ({
      insertSymbol,
      register,
    }),
    [insertSymbol, register],
  );

  return (
    <ActiveTextareaContext.Provider value={value}>
      {children}
    </ActiveTextareaContext.Provider>
  );
}

export function useActiveTextarea() {
  return useContext(ActiveTextareaContext);
}
