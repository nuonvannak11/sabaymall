import React from "react";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "@/i18n";
import { DefPageProps } from "@/types";

const namespaces = ["translations", "chats"];

export default async function Home({ params, searchParams }: DefPageProps) {
  const [{ locale }, { lang, token }] = await Promise.all([
    params,
    searchParams,
  ]);
  const language = lang || locale;
  const { resources, t } = await initTranslations(language, namespaces);
  
  return (
    <TranslationsProvider
      locale={language}
      resources={resources}
      namespaces={namespaces}
    >
    </TranslationsProvider>
  );
}
