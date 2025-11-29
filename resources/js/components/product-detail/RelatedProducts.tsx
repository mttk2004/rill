
import React from 'react';
import { Link } from '@inertiajs/react';
import { Product, Artist } from '../../types';
import ProductCard from '../ProductCard';

interface RelatedProductsProps {
  products: Product[];
  artists: Artist[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, artists }) => {
  if (products.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-16 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-2xl font-serif font-bold text-gray-900">Có thể bạn sẽ thích</h2>
         <Link to="/products" className="text-sm font-medium text-primary hover:text-accent">
           Xem tất cả
         </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map(relatedProduct => (
          <ProductCard 
            key={relatedProduct.id} 
            product={relatedProduct} 
            artist={artists.find(a => a.id === relatedProduct.artist_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
