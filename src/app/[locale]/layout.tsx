import type { Metadata } from "next";
import "./globals.css";
import TranslationsProvider from "@/components/TranslationsProvider";
import { DefLayoutProps } from "@/types";
import initTranslations from "@/i18n";
import { ToastContainer } from "react-toastify";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: "no",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<DefLayoutProps>) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale);
  const theme = cookies().get("theme")?.value || "";

  return (
    <html lang={locale} className={`${theme}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${locale === "kh" ? "font-khmer" : "font-montserrat"}`}>
        <TranslationsProvider locale={locale} resources={resources}>
          {children}
          <ToastContainer />
        </TranslationsProvider>
      </body>
    </html>
  );
}
