'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="text-center py-16">
      <h2 className="text-4xl md:text-5xl font-extrabold">
        {t('title')}
        <br />
        <span className="text-brand-red">{t('subtitle')}</span>
      </h2>
    </footer>
  )
} 