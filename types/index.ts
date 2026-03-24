export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type Transmission = 'manual' | 'automatic';
export type Category = 'cars' | 'motorbikes' | 'trucks' | 'vans';

export interface Seller {
  name: string;
  phone: string;
  location: string;
}

export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  description: string;
  images: string[];
  seller: Seller;
  features: string[];
  category: Category;
  createdAt: string;
}
