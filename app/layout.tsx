import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosnetix — Personalized skincare, backed by science",
  description: "The first cosmetic analysis tool personalized to your biology. Skin microbiome research turned into evidence-weighted recommendations.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}