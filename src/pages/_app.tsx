// src/pages/_app.tsx
import type { AppProps } from "next/app"
import "@/styles/globals.css"   // ไฟล์ที่เราสร้างไว้ใน src/styles/globals.css

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
