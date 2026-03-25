import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deliveryRates = [
  { county: 'Nairobi', baseFee: 0, perKmFee: 0 },
  { county: 'Mombasa', baseFee: 0, perKmFee: 0 },
  { county: 'Kisumu', baseFee: 5000, perKmFee: 45 },
  { county: 'Nakuru', baseFee: 3000, perKmFee: 40 },
  { county: 'Eldoret', baseFee: 8000, perKmFee: 55 },
  { county: 'Kakamega', baseFee: 6000, perKmFee: 45 },
  { county: 'Meru', baseFee: 7000, perKmFee: 50 },
  { county: 'Kiambu', baseFee: 2000, perKmFee: 35 },
  { county: 'Nyeri', baseFee: 5000, perKmFee: 45 },
  { county: 'Kisii', baseFee: 7000, perKmFee: 50 },
  { county: 'Narok', baseFee: 6000, perKmFee: 45 },
  { county: 'Kajiado', baseFee: 4000, perKmFee: 40 },
  { county: 'Machakos', baseFee: 5000, perKmFee: 45 },
  { county: 'Kitui', baseFee: 8000, perKmFee: 55 },
  { county: 'Embu', baseFee: 6000, perKmFee: 50 },
  { county: 'Garissa', baseFee: 15000, perKmFee: 70 },
  { county: 'Mandera', baseFee: 25000, perKmFee: 90 },
  { county: 'Wajir', baseFee: 22000, perKmFee: 85 },
  { county: 'Lamu', baseFee: 12000, perKmFee: 65 },
];

async function main() {
  for (const rate of deliveryRates) {
    await prisma.deliveryRate.upsert({
      where: { county: rate.county },
      update: rate,
      create: rate,
    });
  }
  console.log('Seeded delivery rates');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
