import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ReactQueryProviders from "./utils/ReactQueryProviders";
import RecoilRootWrapper from "@/app/utils/RecoilRootWrapper";
import { Suspense } from "react";
import Loading from "./loading";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Java Time",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
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
