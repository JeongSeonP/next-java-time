import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ReactQueryProviders from "./utils/ReactQueryProviders";
import RecoilRootWrapper from "@/app/utils/RecoilRootWrapper";
import { Suspense } from "react";
import Loading from "./loading";

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
