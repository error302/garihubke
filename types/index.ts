export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type Transmission = 'manual' | 'automatic';
export type Category = 'cars' | 'motorbikes' | 'trucks' | 'vans';
export type BodyType = 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'wagon' | 'pickup' | 'van' | 'truck' | 'bus';
export type EngineSize = 'below_1500' | '1500_2000' | '2000_3000' | '3000_4000' | 'above_4000';
export type Color = 'white' | 'black' | 'silver' | 'blue' | 'red' | 'green' | 'yellow' | 'brown' | 'other';

export interface Seller {
  name: string;
  phone: string;
  location: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
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
  bodyType?: BodyType;
  color?: Color;
  engineSize?: number;
}
