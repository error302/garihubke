export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuelType: string;
  transmission: string;
  description: string;
  features?: string;
  images: string;
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
  category: string;
  status: string;
  seller: {
    name: string;
    phone: string;
    location: string;
    county?: string;
    city?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
