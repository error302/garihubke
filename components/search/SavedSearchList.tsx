"use client";

import { useState, useEffect } from "react";

interface SavedSearch {
  id: string;
  name: string;
  filters: string;
  createdAt: string;
  lastChecked: string;
}

export function SavedSearchList() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState<string | null>(null);
  const [matchCounts, setMatchCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      const res = await fetch("/api/saved-searches");
      const data = await res.json();
      setSearches(data);
    } catch (err) {
      console.error("Failed to fetch searches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/saved-searches?id=${id}`, { method: "DELETE" });
      setSearches(searches.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete search:", err);
    }
  };

  const handleCheck = async (id: string) => {
    setChecking(id);
    try {
      const res = await fetch("/api/saved-searches/check", { method: "POST" });
      const data = await res.json();
      const counts: Record<string, number> = {};
      data.forEach((item: { id: string; matchCount: number }) => {
        counts[item.id] = item.matchCount;
      });
      setMatchCounts(counts);
    } catch (err) {
      console.error("Failed to check searches:", err);
    } finally {
      setChecking(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const parseFilters = (filtersStr: string) => {
    try {
      return JSON.parse(filtersStr);
    } catch {
      return {};
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (searches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500">No saved searches</p>
        <p className="text-sm text-gray-400 mt-2">
          Save a search from the vehicles page to get notified of new matches
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searches.map((search) => {
        const filters = parseFilters(search.filters);
        return (
          <div key={search.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{search.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {formatDate(search.createdAt)}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {filters.category}
                    </span>
                  )}
                  {filters.make && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {filters.make}
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      Min: {filters.minPrice}
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      Max: {filters.maxPrice}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {matchCounts[search.id] !== undefined && matchCounts[search.id] > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-sm font-medium rounded">
                    {matchCounts[search.id]} new
                  </span>
                )}
                <button
                  onClick={() => handleCheck(search.id)}
                  disabled={checking === search.id}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  {checking === search.id ? "Checking..." : "Check"}
                </button>
                <button
                  onClick={() => handleDelete(search.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
