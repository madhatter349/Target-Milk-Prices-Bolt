import React, { useState } from 'react';
import { GridIcon, List, MapPin, Milk, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { StoreLocation } from '../types';

interface PriceMapProps {
  stores: StoreLocation[];
}

type ViewMode = 'grid' | 'list';
type SortOrder = 'none' | 'asc' | 'desc';

interface Filters {
  search: string;
  minPrice: number;
  maxPrice: number;
  state: string;
  sortOrder: SortOrder;
}

export default function PriceMap({ stores }: PriceMapProps) {
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    minPrice: Math.min(...stores.map(store => parseFloat(store.Price.replace('$', '')))),
    maxPrice: Math.max(...stores.map(store => parseFloat(store.Price.replace('$', '')))),
    state: '',
    sortOrder: 'none'
  });
  const [showFilters, setShowFilters] = useState(false);

  const minPrice = Math.min(...stores.map(store => parseFloat(store.Price.replace('$', ''))));
  const maxPrice = Math.max(...stores.map(store => parseFloat(store.Price.replace('$', ''))));
  const states = Array.from(new Set(stores.map(store => store.state))).sort();

  const getColorForPrice = (price: number) => {
    const percentage = (price - minPrice) / (maxPrice - minPrice);
    return `rgb(${Math.round(percentage * 255)}, ${Math.round((1 - percentage) * 255)}, 0)`;
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      store.city.toLowerCase().includes(filters.search.toLowerCase());
    const price = parseFloat(store.Price.replace('$', ''));
    const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
    const matchesState = !filters.state || store.state === filters.state;
    return matchesSearch && matchesPrice && matchesState;
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    if (filters.sortOrder === 'none') return 0;
    const priceA = parseFloat(a.Price.replace('$', ''));
    const priceB = parseFloat(b.Price.replace('$', ''));
    return filters.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Milk className="w-8 h-8" />
            Milk Price Tracker
          </h1>
          <div className="text-gray-600 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Showing {filteredStores.length} of {stores.length} locations</span>
              <div className="flex items-center gap-2 border-l pl-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Grid view"
                >
                  <GridIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
                }))}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded ${
                  filters.sortOrder !== 'none' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                {filters.sortOrder === 'asc' ? 'Price: Low to High' : filters.sortOrder === 'desc' ? 'Price: High to Low' : 'Sort by Price'}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`space-y-4 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by store name or city..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="relative pt-1">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Selected Range:</span>
                    <span>${filters.minPrice.toFixed(2)} - ${filters.maxPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="relative h-10 flex items-center">
                    <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
                    <div
                      className="absolute h-2 bg-blue-500 rounded-full"
                      style={{
                        left: `${((filters.minPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        right: `${100 - ((filters.maxPrice - minPrice) / (maxPrice - minPrice)) * 100}%`
                      }}
                    />
                    
                    {/* Min price handle */}
                    <div
                      className="absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-md hover:shadow-lg transform -translate-x-1/2"
                      style={{
                        left: `${((filters.minPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 20
                      }}
                      onMouseDown={(e) => {
                        const slider = e.currentTarget.parentElement;
                        if (!slider) return;
                        
                        const move = (moveEvent: MouseEvent) => {
                          const rect = slider.getBoundingClientRect();
                          const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                          const value = minPrice + (maxPrice - minPrice) * percent;
                          if (value < filters.maxPrice) {
                            setFilters(prev => ({ ...prev, minPrice: Number(value.toFixed(2)) }));
                          }
                        };
                        
                        const up = () => {
                          window.removeEventListener('mousemove', move);
                          window.removeEventListener('mouseup', up);
                        };
                        
                        window.addEventListener('mousemove', move);
                        window.addEventListener('mouseup', up);
                      }}
                    />
                    
                    {/* Max price handle */}
                    <div
                      className="absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-md hover:shadow-lg transform -translate-x-1/2"
                      style={{
                        left: `${((filters.maxPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 20
                      }}
                      onMouseDown={(e) => {
                        const slider = e.currentTarget.parentElement;
                        if (!slider) return;
                        
                        const move = (moveEvent: MouseEvent) => {
                          const rect = slider.getBoundingClientRect();
                          const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                          const value = minPrice + (maxPrice - minPrice) * percent;
                          if (value > filters.minPrice) {
                            setFilters(prev => ({ ...prev, maxPrice: Number(value.toFixed(2)) }));
                          }
                        };
                        
                        const up = () => {
                          window.removeEventListener('mousemove', move);
                          window.removeEventListener('mouseup', up);
                        };
                        
                        window.addEventListener('mousemove', move);
                        window.addEventListener('mouseup', up);
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${minPrice.toFixed(2)}</span>
                    <span>${maxPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={filters.state}
                onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price range legend */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">${minPrice.toFixed(2)}</span>
            <div className="flex-1 h-2 bg-gradient-to-r from-green-500 to-red-500 rounded"></div>
            <span className="text-sm text-gray-600">${maxPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Store list/grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedStores.map((store) => (
              <div
                key={store.store_id}
                className={`bg-white p-6 rounded-lg shadow-sm cursor-pointer transition-all
                  ${selectedStore?.store_id === store.store_id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}
                `}
                onClick={() => setSelectedStore(store)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.city}, {store.state}</p>
                  </div>
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ backgroundColor: getColorForPrice(parseFloat(store.Price.replace('$', ''))) }}
                  >
                    <span className="text-white font-semibold">{store.Price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {sortedStores.map((store) => (
            <div
              key={store.store_id}
              className={`p-4 cursor-pointer transition-all hover:bg-gray-50
                ${selectedStore?.store_id === store.store_id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}
              `}
              onClick={() => setSelectedStore(store)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  <div className="mt-1 flex items-center gap-x-4">
                    <p className="text-sm text-gray-600">{store.city}, {store.state}</p>
                    <p className="text-sm text-gray-500">{store.address_line1}</p>
                  </div>
                </div>
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full ml-4"
                  style={{ backgroundColor: getColorForPrice(parseFloat(store.Price.replace('$', ''))) }}
                >
                  <span className="text-white font-semibold">{store.Price}</span>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      {selectedStore && (
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{selectedStore.name}</h2>
            <button
              onClick={() => setSelectedStore(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 text-gray-900">{selectedStore.address_line1}</p>
              <p className="text-gray-900">
                {selectedStore.city}, {selectedStore.state} {selectedStore.postal_code}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {selectedStore.Price}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Store Details</h3>
              <div className="mt-1 text-gray-900">
                <p>Store ID: {selectedStore.store_id}</p>
                <p>Location: {selectedStore.quadrant_description}</p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  `${selectedStore.address_line1} ${selectedStore.city} ${selectedStore.state}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}