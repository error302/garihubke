// GariHub KE — Seed Script
// Generates a rich, realistic dataset for a premium Kenyan vehicle marketplace.
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// Curated image pool by body type — high-quality Unsplash editorial shots
const IMG = {
  suv: [
    'https://images.unsplash.com/photo-1519440767-ec5d7d65d127?w=1200&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80',
  ],
  sedan: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80',
  ],
  pickup: [
    'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1200&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80',
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1200&q=80',
  ],
  hatch: [
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
  ],
  coupe: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80',
  ],
  van: [
    'https://images.unsplash.com/photo-1597007030739-6d2e7172ee71?w=1200&q=80',
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80',
  ],
  electric: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80',
  ],
}

const interiorShots = [
  'https://images.unsplash.com/photo-TBD?w=1200&q=80', // placeholder removed below
  'https://images.unsplash.com/photo-1542228262-3d663b306a53?w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
]

const kenyanCities = [
  { city: 'Nairobi', region: 'Nairobi' },
  { city: 'Mombasa', region: 'Coast' },
  { city: 'Kisumu', region: 'Nyanza' },
  { city: 'Nakuru', region: 'Rift Valley' },
  { city: 'Eldoret', region: 'Rift Valley' },
  { city: 'Thika', region: 'Central' },
  { city: 'Kiambu', region: 'Central' },
]

const dealersSeed = [
  {
    name: 'Simba Corporation',
    slug: 'simba-corporation',
    description: "East Africa's premier automotive group representing globally renowned brands with over 50 years of heritage.",
    phone: '+254 709 111 000',
    email: 'sales@simbacorp.com',
    website: 'https://simbacorp.com',
    city: 'Nairobi', region: 'Nairobi',
    address: 'Mombasa Road, Nairobi',
    rating: 4.8, reviewsCount: 1284, isVerified: true, isPremium: true, totalSales: 3420,
    responseRate: 98, responseTime: 'within 30 minutes',
  },
  {
    name: 'CMC Motors',
    slug: 'cmc-motors',
    description: 'Heritage dealer for premium European brands. Authorized sales, service and parts since 1948.',
    phone: '+254 709 222 111',
    email: 'info@cmc.co.ke',
    city: 'Nairobi', region: 'Nairobi',
    address: 'Lusaka Road, Industrial Area',
    rating: 4.6, reviewsCount: 932, isVerified: true, isPremium: true, totalSales: 2180,
    responseRate: 95, responseTime: 'within 1 hour',
  },
  {
    name: 'Toyota Kenya',
    slug: 'toyota-kenya',
    description: 'Official Toyota distributor in Kenya. New, certified pre-owned and after-sales service.',
    phone: '+254 709 333 222',
    email: 'sales@toyota.co.ke',
    city: 'Nairobi', region: 'Nairobi',
    address: 'Mombasa Road',
    rating: 4.7, reviewsCount: 2104, isVerified: true, isPremium: true, totalSales: 5120,
    responseRate: 99, responseTime: 'within 15 minutes',
  },
  {
    name: 'Plymouth Auto',
    slug: 'plymouth-auto',
    description: 'Specialist importer of Japanese domestic market vehicles. Direct auction access.',
    phone: '+254 722 444 555',
    email: 'info@plymouthauto.co.ke',
    city: 'Mombasa', region: 'Coast',
    address: 'Nyali Road, Mombasa',
    rating: 4.4, reviewsCount: 412, isVerified: true, isPremium: false, totalSales: 870,
    responseRate: 88, responseTime: 'within 2 hours',
  },
  {
    name: 'Isuzu EA',
    slug: 'isuzu-ea',
    description: 'Commercial and pickup specialist. Built tough for African terrain.',
    phone: '+254 709 555 666',
    email: 'sales@isuzuea.co.ke',
    city: 'Nakuru', region: 'Rift Valley',
    address: 'Eldoret-Nakuru Highway',
    rating: 4.5, reviewsCount: 678, isVerified: true, isPremium: false, totalSales: 1430,
    responseRate: 92, responseTime: 'within 1 hour',
  },
  {
    name: 'Riara Auto',
    slug: 'riara-auto',
    description: 'Independent dealer of luxury and performance vehicles. Curated, certified, delivered.',
    phone: '+254 733 777 888',
    email: 'hello@riaraauto.com',
    city: 'Nairobi', region: 'Nairobi',
    address: 'Ngong Road, Kilimani',
    rating: 4.9, reviewsCount: 287, isVerified: true, isPremium: true, totalSales: 410,
    responseRate: 100, responseTime: 'within 20 minutes',
  },
]

// Curated vehicle catalogue. (No Unsplash queries used inside seed body — images pulled from IMG pool above.)
const vehiclesSeed = [
  // Toyotas
  { make: 'Toyota', model: 'Land Cruiser 300', year: 2024, variant: 'ZX', bodyType: 'SUV', fuelType: 'Diesel', transmission: 'Automatic', drivetrain: '4WD', condition: 'New', mileage: 0, price: 14500000, exteriorColor: 'Pearl White', interiorColor: 'Black', engine: '3.3L V6 Twin Turbo', displacement: '3.3L', horsepower: 309, torque: 700, doors: 5, seats: 7, features: ['4WD', 'Panoramic Sunroof', 'Leather Seats', 'Apple CarPlay', '360 Camera', 'Adaptive Cruise', 'Lane Keep Assist', 'Heated Seats', 'Cooled Seats', 'Power Tailgate', 'Wireless Charging', 'JBL Audio', 'Heads-up Display', 'Adaptive Suspension', 'Multi-Terrain Monitor'], description: 'The benchmark for African luxury SUVs. Unmatched reliability, legendary off-road capability, and a cabin trimmed like a private jet. Full main-dealer service history available.', dealerSlug: 'toyota-kenya', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
  { make: 'Toyota', model: 'Hilux', year: 2023, variant: 'GR Sport', bodyType: 'Pickup', fuelType: 'Diesel', transmission: 'Automatic', drivetrain: '4WD', condition: 'Used', mileage: 18500, price: 7200000, exteriorColor: 'Emotional Red', interiorColor: 'Black', engine: '2.8L', displacement: '2.8L', horsepower: 204, torque: 500, doors: 4, seats: 5, features: ['4WD', 'Differential Lock', 'Apple CarPlay', 'Reverse Camera', 'Hill Start Assist', 'Cruise Control', 'Bilstein Suspension', 'Skid Plate', 'Side Steps'], description: 'Single-owner GR Sport Hilux. Built for the bush, kitted for the city. Diff locks front and rear, factory Bilstein shocks, full Toyota service record.', dealerSlug: 'toyota-kenya', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
  { make: 'Toyota', model: 'RAV4', year: 2023, variant: 'Hybrid', bodyType: 'SUV', fuelType: 'Hybrid', transmission: 'CVT', drivetrain: 'AWD', condition: 'Used', mileage: 24000, price: 5400000, exteriorColor: 'Silver Metallic', interiorColor: 'Black', engine: '2.5L Hybrid', displacement: '2.5L', horsepower: 222, torque: 221, doors: 5, seats: 5, features: ['AWD', 'Apple CarPlay', 'Lane Assist', 'Adaptive Cruise', 'Power Tailgate', 'Heated Seats', 'Wireless Charging', 'Bird\'s Eye View Camera'], description: 'Fuel-sipping AWD hybrid SUV. 25 km/L on the highway. Perfect for Nairobi traffic and weekend upcountry trips alike.', dealerSlug: 'toyota-kenya', city: 'Thika', isFeatured: false, isPremium: false, isVerified: true },
  { make: 'Toyota', model: 'Prado', year: 2022, variant: 'TX-L', bodyType: 'SUV', fuelType: 'Diesel', transmission: 'Automatic', drivetrain: '4WD', condition: 'Used', mileage: 42000, price: 8800000, exteriorColor: 'Graphite', interiorColor: 'Beige', engine: '2.8L', displacement: '2.8L', horsepower: 204, torque: 500, doors: 5, seats: 7, features: ['4WD', 'Leather Seats', 'Apple CarPlay', '360 Camera', 'Cooled Seats', 'Power Tailgate', 'Multi-Terrain Select', 'Kinetic Suspension'], description: 'Seven-seat family icon. Captains chairs, cooled seats, and that famous go-anywhere 4WD system. Spotless interior.', dealerSlug: 'simba-corporation', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
  { make: 'Toyota', model: 'Axio', year: 2021, variant: 'Hybrid', bodyType: 'Sedan', fuelType: 'Hybrid', transmission: 'CVT', drivetrain: 'FWD', condition: 'Used', mileage: 58000, price: 2950000, exteriorColor: 'White Pearl', interiorColor: 'Black', engine: '1.8L Hybrid', displacement: '1.8L', horsepower: 122, torque: 142, doors: 4, seats: 5, features: ['Apple CarPlay', 'Reverse Camera', 'Cruise Control', 'Push Start', 'Auto Wipers'], description: 'The sensible Nairobi commuter car. 28 km/L in traffic, low maintenance, certified hybrid battery health.', dealerSlug: 'plymouth-auto', city: 'Mombasa', isFeatured: false, isPremium: false, isVerified: true },
  { make: 'Toyota', model: 'Hiace', year: 2022, variant: 'GL', bodyType: 'Van', fuelType: 'Diesel', transmission: 'Manual', drivetrain: 'RWD', condition: 'Used', mileage: 61000, price: 4800000, exteriorColor: 'White', interiorColor: 'Grey', engine: '2.8L', displacement: '2.8L', horsepower: 150, torque: 360, doors: 5, seats: 15, features: ['Reverse Camera', 'Bluetooth', 'Air Conditioning', 'Roof Rack', 'Steel Wheels'], description: 'Matatu/SACCO ready Hiace. Recently serviced, new tyres all round, valid inspection. Seat configuration 3-2-2-2-2.', dealerSlug: 'isuzu-ea', city: 'Nakuru', isFeatured: false, isPremium: false, isVerified: true },

  // Mercedes-Benz
  { make: 'Mercedes-Benz', model: 'GLE 450', year: 2024, variant: 'AMG Line', bodyType: 'SUV', fuelType: 'Plugin Hybrid', transmission: 'Automatic', drivetrain: 'AWD', condition: 'New', mileage: 0, price: 17500000, exteriorColor: 'Obsidian Black', interiorColor: 'Macchiato', engine: '3.0L Inline-6 + EV', displacement: '3.0L', horsepower: 381, torque: 600, doors: 5, seats: 5, features: ['Air Suspension', 'Burmester Audio', 'Panoramic Roof', 'MBUX', 'Augmented Reality Nav', 'Heated & Cooled Seats', '360 Camera', 'Steering Massage', 'Driver Assistance Pro', 'Wireless CarPlay', 'Head-Up Display', 'Night Package', 'AMG Line Exterior', '21" AMG Wheels'], description: 'Flagship luxury SUV with the latest MBUX cockpit,半-autonomous Driving Assistance Pro and a plug-in hybrid powertrain that does 100km on electric alone. A statement on Mombasa Road.', dealerSlug: 'cmc-motors', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
  { make: 'Mercedes-Benz', model: 'C 300', year: 2023, variant: 'Avantgarde', bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'RWD', condition: 'Used', mileage: 19000, price: 8200000, exteriorColor: 'Selenite Grey', interiorColor: 'Black', engine: '2.0L Turbo', displacement: '2.0L', horsepower: 258, torque: 400, doors: 4, seats: 5, features: ['MBUX', 'Burmester Audio', 'Apple CarPlay', 'Heated Seats', 'Active Brake Assist', 'Ambient Lighting 64 colors', 'Power Seats Memory'], description: 'Executive sedan in showroom condition. Still under factory warranty. Two-tone leather, ambient lighting, full digital cockpit.', dealerSlug: 'riara-auto', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
  { make: 'Mercedes-Benz', model: 'S 500', year: 2022, variant: 'Maybach', bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'AWD', condition: 'Used', mileage: 22000, price: 24500000, exteriorColor: 'Diamond White', interiorColor: 'Crystal White/Navy', engine: '3.0L Inline-6', displacement: '3.0L', horsepower: 429, torque: 520, doors: 4, seats: 5, features: ['Maybach Executive Seats', 'Rear Massage Seats', 'Chauffeur Package', 'Burmester 4D', 'Magic Sky Control Sunroof', 'Air Suspension', 'Rear Axle Steering', 'MBUX Rear', 'Night Vision', 'Driver Assistance Pro'], description: 'The pinnacle of African luxury motoring. Maybach rear compartment, 4D Burmester surround, executive reclining seats with hot-stone massage. Owner relocating — priced to sell.', dealerSlug: 'riara-auto', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },

  // BMW
  { make: 'BMW', model: 'X5', year: 2023, variant: 'xDrive40i M Sport', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'AWD', condition: 'Used', mileage: 28000, price: 13800000, exteriorColor: 'Alpine White', interiorColor: 'Cognac', engine: '3.0L Inline-6 Turbo', displacement: '3.0L', horsepower: 375, torque: 520, doors: 5, seats: 5, features: ['M Sport Package', 'Adaptive Air Suspension', 'Harman Kardon', 'Panoramic Roof', 'Laser Headlights', 'Heated/Cooled Seats', 'Gesture Control', 'Parking Assistant Plus', 'Live Cockpit Pro', 'Wireless CarPlay'], description: 'M Sport X5 with adaptive air suspension and laser headlights. The benchmark driving dynamics SUV, in stunning Cognac Vernasca leather.', dealerSlug: 'cmc-motors', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
  { make: 'BMW', model: '330i', year: 2022, variant: 'M Sport', bodyType: 'Sedan', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'RWD', condition: 'Used', mileage: 31000, price: 7200000, exteriorColor: 'Tanzanite Blue', interiorColor: 'Black', engine: '2.0L Turbo', displacement: '2.0L', horsepower: 258, torque: 400, doors: 4, seats: 5, features: ['M Sport', 'Harman Kardon', 'Panoramic Roof', 'Heated Seats', 'Adaptive Cruise', 'Live Cockpit', 'CarPlay', 'Adaptive M Suspension'], description: 'The ultimate driving machine, M Sport spec. Adaptive M suspension, Harmon Kardon audio, and that perfect 50:50 balance.', dealerSlug: 'riara-auto', city: 'Nairobi', isFeatured: false, isPremium: false, isVerified: true },

  // Land Rover
  { make: 'Land Rover', model: 'Range Rover Sport', year: 2024, variant: 'P460e HSE', bodyType: 'SUV', fuelType: 'Plugin Hybrid', transmission: 'Automatic', drivetrain: 'AWD', condition: 'New', mileage: 0, price: 21500000, exteriorColor: 'Santorini Black', interiorColor: 'Ebony/Cirrus', engine: '3.0L Inline-6 PHEV', displacement: '3.0L', horsepower: 460, torque: 700, doors: 5, seats: 5, features: ['Air Suspension', 'Meridian Surround', 'Pano Roof', 'Terrain Response 2', 'Cabin Air Purification', 'Massage Seats', 'Matrix LED', 'Heads-up Display', '360 Camera', 'Wade Sensing', 'Dynamic Launch', 'Electronic Air Suspension'], description: 'The new Range Rover Sport PHEV. 100km of pure electric range plus the legendary Terrain Response 2 system. Wade sensing up to 900mm. The definitive statement on the road.', dealerSlug: 'cmc-motors', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
  { make: 'Land Rover', model: 'Defender 110', year: 2023, variant: 'P300 HSE', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: '4WD', condition: 'Used', mileage: 16000, price: 14800000, exteriorColor: 'Pangea Green', interiorColor: 'Light Oyster', engine: '2.0L Turbo', displacement: '2.0L', horsepower: 300, torque: 400, doors: 5, seats: 5, features: ['4WD', 'Electronic Air Suspension', 'Meridian', 'Panoramic Roof', 'Matrix LED', 'Wade Sensing', 'Terrain Response 2', 'Heated Seats', 'Activity Key', 'Storage Pack'], description: 'The reborn icon. Pangea Green over Light Oyster, air suspension, factory roof rack. Wading depth 900mm. Perfect for the Mara and the members club.', dealerSlug: 'simba-corporation', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },

  // Porsche
  { make: 'Porsche', model: 'Cayenne', year: 2023, variant: 'S Coupe', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'AWD', condition: 'Used', mileage: 14000, price: 19800000, exteriorColor: 'Carrara White', interiorColor: 'Bordeaux', engine: '4.0L V8 Twin Turbo', displacement: '4.0L', horsepower: 468, torque: 600, doors: 5, seats: 4, features: ['Burmester 4D', 'Adaptive Air Suspension', 'PCCB', 'Sport Chrono', '21" Spyder Wheels', 'Panoramic Roof', 'Massage Seats', 'Lane Change Assist', 'BOSE to Burmester Upgrade', 'Cayenne S Coupe Sport Package'], description: 'Cayenne S Coupe with the 4.0L twin-turbo V8 — the last of its kind. Burmester 4D, PCCB ceramic brakes, full Sport Chrono. A 911 you can take the family in.', dealerSlug: 'riara-auto', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },

  // Audi
  { make: 'Audi', model: 'Q7', year: 2023, variant: '55 TFSI quattro', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'AWD', condition: 'Used', mileage: 22000, price: 13200000, exteriorColor: 'Mythos Black', interiorColor: 'Okapi Brown', engine: '3.0L V6 Turbo', displacement: '3.0L', horsepower: 340, torque: 500, doors: 5, seats: 7, features: ['quattro', 'Air Suspension', 'Bang & Olufsen 3D', 'Virtual Cockpit Plus', 'Panoramic Roof', 'Heated/Cooled Seats', 'Matrix LED', '360 Camera', 'Traffic Jam Assist', 'Phone Box'], description: 'Seven-seat Q7 in desirable Okapi Brown. Air suspension, B&O 3D, full virtual cockpit. The thinking executive\'s choice.', dealerSlug: 'cmc-motors', city: 'Nairobi', isFeatured: false, isPremium: true, isVerified: true },

  // Mazda
  { make: 'Mazda', model: 'CX-5', year: 2022, variant: 'Carbon Edition', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'AWD', condition: 'Used', mileage: 35000, price: 4900000, exteriorColor: 'Polymetal Grey', interiorColor: 'Black', engine: '2.5L', displacement: '2.5L', horsepower: 194, torque: 258, doors: 5, seats: 5, features: ['AWD', 'Apple CarPlay', 'Bose Audio', 'Heated Seats', 'Sunroof', '360 Camera', 'Radar Cruise', 'Lane Keep'], description: 'Reliable, stylish, and economical. CX-5 Carbon Edition with the 2.5L naturally aspirated engine — bulletproof for Kenyan roads.', dealerSlug: 'plymouth-auto', city: 'Kisumu', isFeatured: false, isPremium: false, isVerified: true },

  // Honda
  { make: 'Honda', model: 'CR-V', year: 2022, variant: 'Touring', bodyType: 'SUV', fuelType: 'Hybrid', transmission: 'CVT', drivetrain: 'AWD', condition: 'Used', mileage: 39000, price: 5200000, exteriorColor: 'Platinum White', interiorColor: 'Black', engine: '2.0L Hybrid', displacement: '2.0L', horsepower: 215, torque: 315, doors: 5, seats: 5, features: ['AWD', 'Honda Sensing', 'Apple CarPlay', 'Wireless Charging', 'Heated Seats', 'Panoramic Roof', 'Power Tailgate', 'BOSE Audio'], description: 'Hybrid CR-V Touring. Honda Sensing safety suite, panoramic roof, Bose audio. The family SUV that just works.', dealerSlug: 'plymouth-auto', city: 'Mombasa', isFeatured: false, isPremium: false, isVerified: true },

  // Nissan
  { make: 'Nissan', model: 'Patrol', year: 2022, variant: 'Nismo', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: '4WD', condition: 'Used', mileage: 28000, price: 9800000, exteriorColor: 'Gun Metallic', interiorColor: 'Black', engine: '5.6L V8', displacement: '5.6L', horsepower: 400, torque: 560, doors: 5, seats: 7, features: ['4WD', 'Nismo Bodykit', 'Bose Audio', 'Apple CarPlay', '360 Camera', 'Heated/Cooled Seats', 'Power Tailgate', 'Differential Lock'], description: 'The other big Japanese 4×4. 5.6L V8 with Nismo bodykit. A statement alternative to the Land Cruiser.', dealerSlug: 'simba-corporation', city: 'Nairobi', isFeatured: false, isPremium: false, isVerified: true },

  // Subaru
  { make: 'Subaru', model: 'Outback', year: 2023, variant: 'Touring', bodyType: 'Wagon', fuelType: 'Petrol', transmission: 'CVT', drivetrain: 'AWD', condition: 'Used', mileage: 21000, price: 6200000, exteriorColor: 'Crystal Black', interiorColor: 'Ivory', engine: '2.4L Turbo', displacement: '2.4L', horsepower: 260, torque: 376, doors: 5, seats: 5, features: ['Symmetrical AWD', 'X-Mode', 'EyeSight', 'Panoramic Roof', 'Harman Kardon', 'Heated Seats', 'Ventilated Seats', 'Reverse Auto Braking'], description: 'Symmetrical AWD wagon with X-Mode for the off-the-beaten-path crowd. Loaded Touring trim with ventilated seats.', dealerSlug: 'plymouth-auto', city: 'Eldoret', isFeatured: false, isPremium: false, isVerified: true },

  // Mitsubishi
  { make: 'Mitsubishi', model: 'Outlander', year: 2022, variant: 'PHEV', bodyType: 'SUV', fuelType: 'Plugin Hybrid', transmission: 'CVT', drivetrain: 'AWD', condition: 'Used', mileage: 32000, price: 5800000, exteriorColor: 'Red Diamond', interiorColor: 'Black', engine: '2.4L PHEV', displacement: '2.4L', horsepower: 224, torque: 350, doors: 5, seats: 5, features: ['AWD', 'PHEV', 'Apple CarPlay', 'Bose Audio', 'Heated Seats', 'Power Tailgate', '360 Camera', 'Adaptive Cruise'], description: 'Plug-in hybrid AWD SUV. 50km pure EV range for daily commutes, 4WD for weekends. Bose audio, full safety suite.', dealerSlug: 'isuzu-ea', city: 'Nakuru', isFeatured: false, isPremium: false, isVerified: true },

  // Hyundai
  { make: 'Hyundai', model: 'Tucson', year: 2023, variant: 'Elite', bodyType: 'SUV', fuelType: 'Hybrid', transmission: 'Automatic', drivetrain: 'AWD', condition: 'Used', mileage: 18000, price: 5400000, exteriorColor: 'Abyss Black', interiorColor: 'Black', engine: '1.6L Turbo Hybrid', displacement: '1.6L', horsepower: 230, torque: 350, doors: 5, seats: 5, features: ['AWD', 'Hybrid', 'Bose Audio', 'Apple CarPlay', 'Heated Seats', 'Sunroof', 'Adaptive Cruise', 'Blind Spot Monitor'], description: 'Sharp-looking hybrid Tucson with the full Elite pack. Bose audio, sunroof, full ADAS. Striking parametric grille.', dealerSlug: 'plymouth-auto', city: 'Mombasa', isFeatured: false, isPremium: false, isVerified: true },

  // Kia
  { make: 'Kia', model: 'Sportage', year: 2023, variant: 'GT-Line', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Automatic', drivetrain: 'AWD', condition: 'Used', mileage: 20000, price: 4700000, exteriorColor: 'Snow White Pearl', interiorColor: 'Black', engine: '2.5L', displacement: '2.5L', horsepower: 187, torque: 241, doors: 5, seats: 5, features: ['AWD', 'Apple CarPlay', 'Bose Audio', 'Heated Seats', 'Sunroof', 'Smart Cruise', '360 Camera', 'Wireless Charging'], description: 'GT-Line Sportage. Bold styling, premium cabin, Bose audio. The smart value pick in the compact SUV segment.', dealerSlug: 'plymouth-auto', city: 'Kisumu', isFeatured: false, isPremium: false, isVerified: true },

  // Suzuki
  { make: 'Suzuki', model: 'Jimny', year: 2024, variant: 'XL', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'Manual', drivetrain: '4WD', condition: 'New', mileage: 0, price: 3850000, exteriorColor: 'Kinetic Yellow', interiorColor: 'Black', engine: '1.5L', displacement: '1.5L', horsepower: 103, torque: 134, doors: 3, seats: 4, features: ['4WD', 'Differential Lock', 'Apple CarPlay', 'Reverse Camera', 'Hill Descent Control', 'Hill Hold', 'Steel Wheels'], description: 'The little 4×4 that could. Cult following, go-anywhere capability, and looks that make everyone smile. Brand new with warranty.', dealerSlug: 'simba-corporation', city: 'Nairobi', isFeatured: true, isPremium: false, isVerified: true },

  // Isuzu
  { make: 'Isuzu', model: 'D-Max', year: 2023, variant: 'LS-M 4x4', bodyType: 'Pickup', fuelType: 'Diesel', transmission: 'Automatic', drivetrain: '4WD', condition: 'Used', mileage: 25000, price: 6200000, exteriorColor: 'Mineral White', interiorColor: 'Black', engine: '3.0L', displacement: '3.0L', horsepower: 177, torque: 430, doors: 4, seats: 5, features: ['4WD', 'Diff Lock', 'Apple CarPlay', 'Reverse Camera', 'Leather Seats', 'Roll Bar', 'Side Steps', 'Tow Bar'], description: 'Heavy-duty LS-M D-Max with the legendary 3.0L diesel. Built for the farm and the site. Tow bar, side steps, roll bar factory fitted.', dealerSlug: 'isuzu-ea', city: 'Eldoret', isFeatured: false, isPremium: false, isVerified: true },

  // Ford
  { make: 'Ford', model: 'Ranger', year: 2023, variant: 'Wildtrak 3.0', bodyType: 'Pickup', fuelType: 'Diesel', transmission: 'Automatic', drivetrain: '4WD', condition: 'Used', mileage: 27000, price: 7400000, exteriorColor: 'Aluminium', interiorColor: 'Black', engine: '3.0L V6', displacement: '3.0L', horsepower: 250, torque: 600, doors: 4, seats: 5, features: ['4WD', 'Diff Lock', 'Matrix LED', 'B&O Audio', 'Apple CarPlay', 'Adaptive Cruise', 'Lane Keep', 'Front Camera', 'Skid Plate', 'Sports Bar'], description: 'Wildtrak V6 — the cult favorite. B&O audio, matrix LED, adaptive cruise. One of the most capable pickups ever built.', dealerSlug: 'simba-corporation', city: 'Nairobi', isFeatured: true, isPremium: false, isVerified: true },

  // VW
  { make: 'Volkswagen', model: 'Tiguan', year: 2022, variant: 'R-Line', bodyType: 'SUV', fuelType: 'Petrol', transmission: 'DCT', drivetrain: 'AWD', condition: 'Used', mileage: 30000, price: 5900000, exteriorColor: 'Deep Black', interiorColor: 'Black', engine: '2.0L TSI', displacement: '2.0L', horsepower: 184, torque: 300, doors: 5, seats: 5, features: ['4MOTION AWD', 'R-Line', 'Beats Audio', 'Panoramic Roof', 'Digital Cockpit', 'Adaptive Cruise', 'Heated Seats', 'Park Assist'], description: 'Tiguan R-Line with 4MOTION AWD and Beats audio. German driving dynamics in a family-friendly package.', dealerSlug: 'cmc-motors', city: 'Nairobi', isFeatured: false, isPremium: false, isVerified: true },

  // Tesla-style EV (sold as EV but generic)
  { make: 'BYD', model: 'Atto 3', year: 2024, variant: 'Extended Range', bodyType: 'SUV', fuelType: 'Electric', transmission: 'Automatic', drivetrain: 'AWD', condition: 'New', mileage: 0, price: 6800000, exteriorColor: 'Ski White', interiorColor: 'Blue/Grey', engine: 'Dual Electric', displacement: 'EV', horsepower: 204, torque: 310, doors: 5, seats: 5, features: ['AWD', '60.5 kWh Battery', '420km Range', 'Rotating Touchscreen', 'Wireless Charging', 'Heat Pump', 'V2L', 'ADAS', 'Panoramic Roof', 'Power Tailgate'], description: 'The EV that actually makes sense in Kenya. 420km range, V2L to power your home during blackouts, DC fast charging. Rotating 15.6" infotainment screen.', dealerSlug: 'riara-auto', city: 'Nairobi', isFeatured: true, isPremium: true, isVerified: true },
]

// Articles / blog content
const articlesSeed = [
  { slug: 'best-suvs-kenya-2024', title: 'Best SUVs for Kenyan Roads in 2024', excerpt: 'From the iconic Land Cruiser to the practical RAV4 Hybrid — our picks for the most capable SUVs you can buy in Kenya this year.', category: 'Buying Guides', author: 'James Mwangi', readMins: 8, content: 'Long-form guide content here.' },
  { slug: 'mpesa-car-finance', title: 'How to Finance Your Next Car with M-Pesa', excerpt: 'A step-by-step guide to M-Pesa-backed vehicle financing — what it costs, who qualifies, and how to apply in minutes.', category: 'Finance', author: 'Achieng Ouya', readMins: 6, content: 'Long-form guide content here.' },
  { slug: 'importing-japan-jdm', title: 'JDM Importing: What You Need to Know', excerpt: 'Japanese Domestic Market cars are wildly popular in Kenya. Here is the entire import process, end-to-end, with real numbers.', category: 'Importing', author: 'Peter Kamau', readMins: 12, content: 'Long-form guide content here.' },
  { slug: 'electric-cars-kenya', title: 'Electric Cars in Kenya: The Honest Truth', excerpt: 'Charging, range, maintenance, and resale. Everything you need to know before going electric in Kenya.', category: 'Electric', author: 'Achieng Ouya', readMins: 9, content: 'Long-form guide content here.' },
]

async function main() {
  console.log('Seeding dealers...')
  for (const d of dealersSeed) {
    await db.dealer.create({ data: d as any })
  }

  console.log('Seeding vehicles...')
  for (const v of vehiclesSeed) {
    const dealer = await db.dealer.findUnique({ where: { slug: v.dealerSlug } })
    if (!dealer) continue
    const pool = (IMG as any)[v.bodyType === 'Pickup' ? 'pickup' : v.bodyType === 'Van' ? 'van' : v.bodyType === 'Wagon' ? 'suv' : v.bodyType === 'Sedan' ? 'sedan' : v.bodyType === 'Coupe' ? 'coupe' : v.bodyType === 'Hatchback' ? 'hatch' : v.fuelType === 'Electric' ? 'electric' : 'suv'] || IMG.suv
    const interior = interiorShots.filter((u) => !u.includes('TBD'))
    const images = JSON.stringify([
      pool[0], pool[1] || pool[0], pool[2] || pool[0],
      interior[0], interior[1] || interior[0],
    ])
    const slug = `${v.make}-${v.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + v.year + '-' + Math.floor(Math.random() * 9999)
    const title = `${v.year} ${v.make} ${v.model}${v.variant ? ' ' + v.variant : ''}`
    await db.vehicle.create({
      data: {
        slug,
        title,
        make: v.make,
        model: v.model,
        year: v.year,
        variant: v.variant,
        bodyType: v.bodyType,
        fuelType: v.fuelType,
        transmission: v.transmission,
        drivetrain: v.drivetrain,
        condition: v.condition,
        mileage: v.mileage,
        price: v.price,
        exteriorColor: v.exteriorColor,
        interiorColor: v.interiorColor,
        engine: v.engine,
        displacement: v.displacement,
        horsepower: v.horsepower,
        torque: v.torque,
        doors: v.doors,
        seats: v.seats,
        features: JSON.stringify(v.features),
        description: v.description,
        images,
        status: 'active',
        isFeatured: v.isFeatured,
        isPremium: v.isPremium,
        isVerified: v.isVerified,
        viewsCount: Math.floor(Math.random() * 1500) + 100,
        favoritesCount: Math.floor(Math.random() * 200) + 5,
        leadsCount: Math.floor(Math.random() * 30),
        city: v.city,
        region: kenyanCities.find((c) => c.city === v.city)?.region || 'Nairobi',
        location: v.city + ', Kenya',
        dealerId: dealer.id,
      },
    })
  }

  console.log('Seeding users...')
  await db.user.create({
    data: { email: 'admin@garihub.co.ke', name: 'Site Admin', role: 'admin' },
  })

  console.log('Seeding articles...')
  for (const a of articlesSeed) {
    await db.article.create({ data: a })
  }

  console.log('Seeding sample leads...')
  const vs = await db.vehicle.findMany({ take: 12 })
  const leadTypes = ['inquiry', 'test_drive', 'offer', 'finance', 'trade_in']
  const leadStatuses = ['new', 'contacted', 'qualified', 'closed', 'lost']
  const names = ['Wanjiku Kamau', 'Brian Otieno', 'Faith Wanjiru', 'Hassan Ali', 'Grace Mutua', 'Daniel Kiprop', 'Lillian Achieng', 'Samuel Njoroge']
  for (let i = 0; i < 30; i++) {
    const v = vs[Math.floor(Math.random() * vs.length)]
    await db.lead.create({
      data: {
        vehicleId: v.id,
        dealerId: v.dealerId,
        type: leadTypes[Math.floor(Math.random() * leadTypes.length)],
        status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
        name: names[Math.floor(Math.random() * names.length)],
        email: `lead${i}@example.com`,
        phone: '+254 7' + (Math.floor(Math.random() * 90000000) + 10000000),
        message: 'I am interested in this vehicle. Is it still available and can I schedule a viewing this week?',
        budget: v.price,
      },
    })
  }

  console.log('Seeding reviews...')
  for (const v of vs) {
    const num = Math.floor(Math.random() * 4) + 1
    for (let i = 0; i < num; i++) {
      await db.review.create({
        data: {
          vehicleId: v.id,
          dealerId: v.dealerId,
          rating: Math.floor(Math.random() * 2) + 4,
          title: ['Excellent buy', 'Worth every shilling', 'Smooth process', 'Highly recommend'][Math.floor(Math.random() * 4)],
          comment: 'Smooth, professional experience from enquiry to test drive. The car was exactly as described. Highly recommended.',
          author: names[Math.floor(Math.random() * names.length)],
        },
      })
    }
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
