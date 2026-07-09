import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import sharp from 'sharp'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// POST /api/admin/vehicles — create a new vehicle listing with multiple images
// Accepts multipart/form-data:
//   - fields: make, model, year, variant, bodyType, fuelType, transmission, drivetrain,
//     condition, mileage, price, exteriorColor, interiorColor, engine, displacement,
//     horsepower, torque, doors, seats, description, city, region, isFeatured, isPremium
//   - files: images[] (multiple image files)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const make = String(formData.get('make') || '')
    const model = String(formData.get('model') || '')
    const year = Number(formData.get('year') || 2024)
    const variant = String(formData.get('variant') || '')
    const bodyType = String(formData.get('bodyType') || 'SUV')
    const fuelType = String(formData.get('fuelType') || 'Petrol')
    const transmission = String(formData.get('transmission') || 'Automatic')
    const drivetrain = String(formData.get('drivetrain') || 'FWD')
    const condition = String(formData.get('condition') || 'Used')
    const mileage = formData.get('mileage') ? Number(formData.get('mileage')) : null
    const price = Number(formData.get('price') || 0)
    const exteriorColor = String(formData.get('exteriorColor') || '')
    const interiorColor = String(formData.get('interiorColor') || '')
    const engine = String(formData.get('engine') || '')
    const displacement = String(formData.get('displacement') || '')
    const horsepower = formData.get('horsepower') ? Number(formData.get('horsepower')) : null
    const torque = formData.get('torque') ? Number(formData.get('torque')) : null
    const doors = Number(formData.get('doors') || 4)
    const seats = Number(formData.get('seats') || 5)
    const description = String(formData.get('description') || '')
    const city = String(formData.get('city') || 'Nairobi')
    const region = String(formData.get('region') || 'Nairobi')
    const isFeatured = formData.get('isFeatured') === 'true'
    const isPremium = formData.get('isPremium') === 'true'
    const dealerId = String(formData.get('dealerId') || '')

    if (!make || !model || !price) {
      return NextResponse.json({ error: 'Make, model, and price are required' }, { status: 400 })
    }

    // Generate slug
    const baseSlug = `${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const slug = `${baseSlug}-${year}-${crypto.randomBytes(3).toString('hex')}`
    const title = `${year} ${make} ${model}${variant ? ' ' + variant : ''}`

    // Collect image files
    const imageFiles = formData.getAll('images').filter((f) => f instanceof File) as File[]

    // Process and save images
    const imageUrls: string[] = []
    if (imageFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', slug)
      await mkdir(uploadDir, { recursive: true })

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const buffer = Buffer.from(await file.arrayBuffer())

        // Process with sharp: resize to max 1600px wide, JPEG 85%
        const processed = await sharp(buffer)
          .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer()

        const filename = `photo-${String(i + 1).padStart(2, '0')}.jpg`
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, processed)

        imageUrls.push(`/uploads/${slug}/${filename}`)
      }
    }

    // Parse features (comma-separated string → JSON array)
    const featuresStr = String(formData.get('features') || '')
    const features = JSON.stringify(
      featuresStr
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    )

    // Create the vehicle
    const vehicle = await db.vehicle.create({
      data: {
        slug,
        title,
        make,
        model,
        year,
        variant: variant || null,
        bodyType,
        fuelType,
        transmission,
        drivetrain,
        condition,
        mileage,
        price,
        currency: 'KES',
        exteriorColor: exteriorColor || null,
        interiorColor: interiorColor || null,
        engine: engine || null,
        displacement: displacement || null,
        horsepower,
        torque,
        doors,
        seats,
        features,
        description,
        images: JSON.stringify(imageUrls),
        status: 'active',
        isFeatured,
        isPremium,
        isVerified: true,
        viewsCount: 0,
        favoritesCount: 0,
        leadsCount: 0,
        city,
        region,
        location: `${city}, Kenya`,
        dealerId: dealerId || null,
      },
    })

    return NextResponse.json({ vehicle, imageCount: imageUrls.length })
  } catch (e: any) {
    console.error('Create vehicle error:', e)
    return NextResponse.json({ error: e.message || 'Failed to create vehicle' }, { status: 500 })
  }
}

// GET /api/admin/vehicles — list all vehicles for admin (including non-active)
export async function GET() {
  const vehicles = await db.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
    include: { dealer: true },
  })
  return NextResponse.json({ vehicles })
}
