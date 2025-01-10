export interface StoreLocation {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_line3?: string;
  city: string;
  state: string;  // Full state name
  region: string; // State abbreviation
  postal_code: string;
  country: string;
  Price: string;  // Price comes as string with $ prefix
  store_id: string;
  quadrant_description: string;
  quadrant_code: string;
  intersection_description?: string;
  county?: string;
  "Product Title"?: string;
}
