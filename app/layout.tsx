"use client";

import Header from "@/components/common/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";
import Footer from "@/components/common/Footer";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Java Time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <RecoilRoot>
        <body>
          <Header />
          {children}
          <Footer />
        </body>
      </RecoilRoot>
    </html>
  );
}
