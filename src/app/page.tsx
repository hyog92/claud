'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { CoupangProduct } from '@/lib/coupang';

export default function Home() {
  const [products, setProducts] = useState<CoupangProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'search' | 'goldbox'>('search');

  const handleSearch = async (keyword: string) => {
    setIsLoading(true);
    setError(null);
    setSearchKeyword(keyword);
    setActiveTab('search');

    try {
      const response = await fetch(`/api/products/search?keyword=${encodeURIComponent(keyword)}&limit=20`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGoldbox = async () => {
    setIsLoading(true);
    setError(null);
    setActiveTab('goldbox');
    setSearchKeyword('');

    try {
      const response = await fetch('/api/products/goldbox');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch goldbox products');
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-red-600">
              쿠팡 상품 검색
            </h1>
            <span className="text-sm text-gray-500">Powered by Coupang Partners</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-red-600 to-red-500">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            쿠팡에서 원하는 상품을 찾아보세요
          </h2>
          <p className="text-red-100 mb-8">
            수백만 개의 상품을 빠르게 검색하고 최저가로 구매하세요
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => searchKeyword && handleSearch(searchKeyword)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            검색 결과
          </button>
          <button
            onClick={loadGoldbox}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'goldbox'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            골드박스 (베스트)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Info */}
        {searchKeyword && activeTab === 'search' && !isLoading && (
          <p className="text-gray-600 mb-6">
            <span className="font-semibold">&quot;{searchKeyword}&quot;</span> 검색 결과: {products.length}개 상품
          </p>
        )}

        {activeTab === 'goldbox' && !isLoading && products.length > 0 && (
          <p className="text-gray-600 mb-6">
            오늘의 골드박스 추천 상품
          </p>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-medium">오류가 발생했습니다</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-sm mt-2 text-red-500">
              Tip: .env.local 파일에 COUPANG_ACCESS_KEY와 COUPANG_SECRET_KEY가 설정되어 있는지 확인하세요.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
            <p className="mt-4 text-gray-500">상품을 검색하고 있습니다...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchKeyword ? '검색 결과가 없습니다' : '상품을 검색해보세요'}
            </h3>
            <p className="text-gray-500">
              {searchKeyword
                ? '다른 검색어로 다시 시도해보세요'
                : '위 검색창에 원하는 상품명을 입력하세요'}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
          <p className="text-xs mt-2">
            © {new Date().getFullYear()} Coupang Product Search. Built with Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
