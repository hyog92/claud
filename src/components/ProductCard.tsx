'use client';

import Image from 'next/image';
import { CoupangProduct } from '@/lib/coupang';

interface ProductCardProps {
  product: CoupangProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.productImage || '/placeholder.png'}
          alt={product.productName}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {product.isRocket && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              로켓배송
            </span>
          )}
          {product.isFreeShipping && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              무료배송
            </span>
          )}
        </div>
        {product.rank && product.rank <= 10 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center">
            {product.rank}위
          </div>
        )}
      </div>
      <div className="p-4">
        {product.categoryName && (
          <p className="text-xs text-gray-500 mb-1">{product.categoryName}</p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          {product.productName}
        </h3>
        <p className="mt-2 text-lg font-bold text-red-600">
          {formatPrice(product.productPrice)}원
        </p>
      </div>
    </a>
  );
}
