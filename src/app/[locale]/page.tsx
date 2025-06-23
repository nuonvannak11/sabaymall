import Header from '@/components/Header'
import Slider from '@/components/Slider'
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Header />
      <Slider sliders={[]} />
      <ProductSection products={[]} />
      <Footer />
    </div>
  )
} 