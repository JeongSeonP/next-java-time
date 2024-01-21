import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ReactQueryProviders from "./utils/ReactQueryProviders";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: { default: "Java Time", template: "%s | Java Time" },
  description: "Java Time에서 커피리뷰를 공유해보세요",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body>
        <ReactQueryProviders>
          <ScrollToTop />
          <Header />
          {children}
          <Footer />
        </ReactQueryProviders>
      </body>
    </html>
  );
};
export default RootLayout;
