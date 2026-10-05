import type { Metadata } from "next";
import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header, ParkingLot } from "@/components/Header";
import { FigureHost } from "@/components/FigureHost";

const serif = Source_Serif_4({
  variable: "--f-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
const sans = Schibsted_Grotesk({ variable: "--f-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISLP Quest",
  description:
    "Estude An Introduction to Statistical Learning com Python resolvendo no papel, em missões curtas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header />
        {children}
        <ParkingLot />
        <FigureHost />
      </body>
    </html>
  );
}
