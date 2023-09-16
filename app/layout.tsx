import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ReactQueryProviders from "./utils/ReactQueryProviders";
import RecoilRootWrapper from "@/app/utils/RecoilRootWrapper";
import { Suspense } from "react";
import Loading from "./loading";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Java Time",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body>
        <ReactQueryProviders>
          <RecoilRootWrapper>
            <ScrollToTop />
            <Header />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <Footer />
          </RecoilRootWrapper>
        </ReactQueryProviders>
      </body>
    </html>
  );
};
export default RootLayout;
