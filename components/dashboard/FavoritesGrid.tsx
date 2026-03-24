"use client";

import { useState, useEffect } from "react";
import { vehicles } from "@/data/vehicles";
import { Vehicle } from "@/types";
import VehicleCard from "@/components/VehicleCard";

export function FavoritesGrid() {
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      
      const favoriteVehicles = data
        .map((f: { vehicleId: string }) => vehicles.find((v) => v.id === f.vehicleId))
        .filter(Boolean) as Vehicle[];
      
      setFavorites(favoriteVehicles);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (vehicleId: string) => {
    try {
      await fetch(`/api/favorites?vehicleId=${vehicleId}`, { method: "DELETE" });
      setFavorites(favorites.filter((v) => v.id !== vehicleId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const localFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      await fetch("/api/favorites/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleIds: localFavorites }),
      });
      
      localStorage.removeItem("favorites");
      await fetchFavorites();
    } catch (err) {
      console.error("Failed to sync favorites:", err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Saved Favorites</h2>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Sync from Browser"}
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No favorites yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Save vehicles you like to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((vehicle) => (
            <div key={vehicle.id} className="relative">
              <VehicleCard vehicle={vehicle} />
              <button
                onClick={() => handleRemove(vehicle.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
