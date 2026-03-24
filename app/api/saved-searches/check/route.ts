import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { vehicles } from "@/data/vehicles";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const savedSearches = await db.savedSearch.findMany({
      where: { userId: session.user.id },
    });
    
    const results = await Promise.all(
      savedSearches.map(async (search) => {
        const filters = JSON.parse(search.filters);
        let matchCount = 0;
        
        vehicles.forEach((vehicle) => {
          let matches = true;
          
          if (filters.category && vehicle.category !== filters.category) matches = false;
          if (filters.make && vehicle.make !== filters.make) matches = false;
          if (filters.model && vehicle.model !== filters.model) matches = false;
          if (filters.minPrice && vehicle.price < Number(filters.minPrice)) matches = false;
          if (filters.maxPrice && vehicle.price > Number(filters.maxPrice)) matches = false;
          if (filters.yearMin && vehicle.year < Number(filters.yearMin)) matches = false;
          if (filters.yearMax && vehicle.year > Number(filters.yearMax)) matches = false;
          if (filters.fuelType?.length && !filters.fuelType.includes(vehicle.fuelType)) matches = false;
          if (filters.transmission?.length && !filters.transmission.includes(vehicle.transmission)) matches = false;
          
          if (matches) matchCount++;
        });
        
        await db.savedSearch.update({
          where: { id: search.id },
          data: { lastChecked: new Date() },
        });
        
        return { id: search.id, name: search.name, matchCount };
      })
    );
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Check saved searches error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
