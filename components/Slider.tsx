'use client'

import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Slider() {
  const t = useTranslations('hero')

  const slides = [
    {
      id: 1,
      title: 'Slide 1',
      image: 'https://placehold.co/1200x600/FFF0F0/FF6347?text=Slide+1'
    },
    {
      id: 2,
      title: 'Slide 2',
      image: 'https://placehold.co/1200x600/E8F8F5/1ABC9C?text=Slide+2'
    },
    {
      id: 3,
      title: 'Slide 3',
      image: 'https://placehold.co/1200x600/F4ECF7/9B59B6?text=Slide+3'
    }
  ]

  return (
    <section className="w-full py-12 md:py-24">
      <div className="w-full max-w-none">
        {/* Full Width Swiper Slider */}
        <div className="relative w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="hero-swiper w-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full h-[300px] md:h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                      <p className="text-lg md:text-xl">Discover amazing content</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev !text-brand-red !bg-white !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg !left-4"></div>
          <div className="swiper-button-next !text-brand-red !bg-white !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg !right-4"></div>
          
          {/* Custom Pagination */}
          <div className="swiper-pagination !bottom-4"></div>
        </div>
      </div>
    </section>
  )
} 