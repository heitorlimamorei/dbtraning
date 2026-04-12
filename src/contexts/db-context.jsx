"use client";

import { createContext, useContext } from "react";

const DbContext = createContext(null);

export function DbProvider({ children, value }) {
  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}

export function useDb() {
  return useContext(DbContext);
}
