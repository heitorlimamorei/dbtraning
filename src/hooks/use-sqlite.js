"use client";

import { useEffect, useState } from "react";
import { SEED_SQL } from "@/data/training-data";

export function useSqlite() {
  const [database, setDatabase] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let disposed = false;
    let dbInstance = null;

    async function loadDatabase() {
      try {
        const initializeSqlJs =
          window.initSqlJs ||
          (await new Promise((resolve, reject) => {
            const script = document.createElement("script");

            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.min.js";
            script.onload = () => resolve(window.initSqlJs);
            script.onerror = reject;

            document.head.appendChild(script);
          }));

        const SQL = await initializeSqlJs({
          locateFile: (file) =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
        });

        if (disposed) {
          return;
        }

        dbInstance = new SQL.Database();
        dbInstance.run(SEED_SQL);
        setDatabase(dbInstance);
        setStatus("ready");
      } catch (error) {
        console.error("sql.js init failed:", error);

        if (!disposed) {
          setStatus("error");
        }
      }
    }

    loadDatabase();

    return () => {
      disposed = true;

      if (dbInstance) {
        dbInstance.close();
      }
    };
  }, []);

  return {
    database,
    status,
  };
}
