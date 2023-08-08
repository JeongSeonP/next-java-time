// "use client";
import Header from "@/components/common/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";
import Footer from "@/components/common/Footer";
import RecoilRootWrapper from "@/components/common/RecoilRootWrapper";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Java Time",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body>
        <RecoilRootWrapper>
          <Header />
          {children}
          <Footer />
        </RecoilRootWrapper>
      </body>
    </html>
  );
};
export default RootLayout;
