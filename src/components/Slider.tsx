"use client";

import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";

interface SliderProp {
  id: number;
  name: string;
  category: string;
  img: string;
  createdAt: string;
}

export default function Slider({ sliders }: { sliders: SliderProp[] }) {
  const { t } = useTranslation();

  if (!sliders || sliders.length === 0) {
    return (
      <section className="w-full py-12 md:py-24">
        <div className="w-full max-w-none">
          <div className="relative w-full">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{
                clickable: true,
                el: ".swiper-pagination",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={false}
              className="hero-swiper w-full">
              <SwiperSlide>
                <div className="relative w-full">
                  <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Page Not Found
                      </h2>
                      <p className="text-lg md:text-xl">No slides available.</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="swiper-button-prev !text-brand-red !bg-white !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg !left-4"></div>
            <div className="swiper-button-next !text-brand-red !bg-white !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg !right-4"></div>
            <div className="swiper-pagination !bottom-4"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24">
      <div className="w-full max-w-none">
        <div className="relative w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="hero-swiper w-full">
            {sliders.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full">
                  <img
                    src={slide.img}
                    alt={slide.name}
                    className="w-full h-[250px] md:h-[400px] object-cover"
                  />
                  <Link
                    href="/"
                    className="dark:button-dark dark:text-theme-dark absolute left-4 bottom-4 text-xl md:text-3xl font-bold mb-0 bg-white/80 px-4 py-2 rounded shadow hover:bg-white">
                    {t("Shop now")}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev !text-brand-red !bg-white !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg !left-4"></div>
          <div className="swiper-button-next !text-brand-red !bg-white !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg !right-4"></div>
          <div className="swiper-pagination !bottom-4"></div>
        </div>
      </div>
    </section>
  );
}
