import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "streamdown/styles.css";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Treinamento BD",
  description: "Treinamento de Algebra Relacional e SQL com SQLite no navegador.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${ibmPlexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
