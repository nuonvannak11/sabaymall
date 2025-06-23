'use client'

interface ItemCardProps {
  name: string
  category: string
  price: string
  imageSrc: string
  imageAlt: string
}

export default function ItemCard({ name, category, price, imageSrc, imageAlt }: ItemCardProps) {
  return (
    <div className="food-card">
      <img 
        src={imageSrc} 
        alt={imageAlt} 
        className="w-28 h-28 mx-auto rounded-full -mt-12 mb-4 object-cover border-4 border-white"
      />
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-gray-400">{category}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-extrabold">{price}</p>
        <button className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors">
          +
        </button>
      </div>
    </div>
  )
} 