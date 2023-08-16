import Header from "@/components/common/Header";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import RecoilRootWrapper from "@/components/common/RecoilRootWrapper";
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
        <RecoilRootWrapper>
          <Header />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Footer />
        </RecoilRootWrapper>
      </body>
    </html>
  );
};
export default RootLayout;
