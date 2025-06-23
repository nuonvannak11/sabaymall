import ItemCard from '@/components/ItemCard';
import { productController } from '@/actions/controller/product_controller';
import React from 'react';

// Define a basic Product type to match your data structure
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
}

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || '';
  const products: Product[] = query
    ? productController.getProductByName(query)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Search Results for: <span className="text-brand-red">{query}</span>
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ItemCard
              key={product.id}
              name={product.name}
              category={product.category}
              price={`$${product.price}`}
              imageSrc={product.img}
              imageAlt={product.name}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-12">
          {query ? `No products found matching "${query}".` : 'Please enter a search term.'}
        </p>
      )}
    </div>
  );
};

export default SearchPage; 