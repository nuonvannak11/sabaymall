'use client'

import { useTranslations } from 'next-intl'
import ItemCard from '@/components/ItemCard'

export default function MenuSection() {
  const t = useTranslations('menu')
  const foodItems = useTranslations('foodItems')

  const menuItems = [
    {
      key: 'chilliBurjis',
      imageSrc: 'https://placehold.co/150x150/FFF5E1/E67E22?text=Chilli+Burjis',
      imageAlt: 'Chilli Burjis'
    },
    {
      key: 'calabash',
      imageSrc: 'https://placehold.co/150x150/E8F8F5/1ABC9C?text=Calabash',
      imageAlt: 'Calabash'
    },
    {
      key: 'oregonYampah',
      imageSrc: 'https://placehold.co/150x150/F4ECF7/9B59B6?text=Oregon+Yampah',
      imageAlt: 'Oregon yampah'
    },
    {
      key: 'squab',
      imageSrc: 'https://placehold.co/150x150/FDEDEC/E74C3C?text=Squab',
      imageAlt: 'Squab'
    },
    {
      key: 'durian',
      imageSrc: 'https://placehold.co/150x150/FCF3CF/F1C40F?text=Durian',
      imageAlt: 'Durian'
    },
    {
      key: 'pummelo',
      imageSrc: 'https://placehold.co/150x150/EBF5FB/3498DB?text=Pummelo',
      imageAlt: 'Pummelo'
    },
    {
      key: 'scallop',
      imageSrc: 'https://placehold.co/150x150/EAEDED/2E86C1?text=Scallop',
      imageAlt: 'Scallop'
    },
    {
      key: 'medlar',
      imageSrc: 'https://placehold.co/150x150/F5EEF8/8E44AD?text=Medlar',
      imageAlt: 'Medlar'
    }
  ]

  return (
    <section className="py-12 md:py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {menuItems.map((item) => (
          <ItemCard
            key={item.key}
            name={foodItems(`${item.key}.name`)}
            category={foodItems(`${item.key}.category`)}
            price={foodItems(`${item.key}.price`)}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
          />
        ))}
      </div>

      <div className="text-center mt-16">
        <a href="#" className="btn btn-primary px-8">{t('exploreMore')}</a>
      </div>
    </section>
  )
} 