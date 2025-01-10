import React from 'react';
import PriceMap from './components/PriceMap';
import { StoreLocation } from './types';

function App() {
  const [stores, setStores] = React.useState<StoreLocation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('https://raw.githubusercontent.com/madhatter349/Target-Milk-Prices---Jan-9-2025/refs/heads/main/all_store_details_with_products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }
        return response.json();
      })
      .then(data => {
        setStores(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading data</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PriceMap stores={stores} />
  );
}
export default App;
