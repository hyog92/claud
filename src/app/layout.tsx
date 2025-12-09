import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "쿠팡 상품 검색 | Coupang Product Search",
  description: "쿠팡 파트너스 API를 활용한 상품 검색 서비스입니다. 원하는 상품을 검색하고 최저가로 구매하세요.",
  keywords: ["쿠팡", "상품검색", "쿠팡파트너스", "Coupang", "쇼핑"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
