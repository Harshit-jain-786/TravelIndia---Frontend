import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Star, Heart, Image as ImageIcon, Search, SortAsc } from "lucide-react";
import AmenitiesList from "@/components/hotels/AmenitiesList";
import { cn } from "@/lib/utils";

function Destinations() {
  const { data: destinations, isLoading } = useQuery({
    queryKey: ["/api/destinations"],
    queryFn: async () => {
      const res = await fetch("/api/destinations/");
      if (!res.ok) throw new Error("Failed to fetch destinations");
      return res.json();
    },
    staleTime: 10_000,
    retry: 1,
  });

  // Wishlist logic
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popularity");

  // Filter and sort logic
  const filtered = destinations?.filter(dest => {
    if (!search.trim()) return true;
    const searchTerm = search.toLowerCase();
    const name = dest.name ? dest.name.toLowerCase() : "";
    const location = dest.location ? dest.location.toLowerCase() : "";
    const description = dest.description ? dest.description.toLowerCase() : "";
    return name.includes(searchTerm) || 
           location.includes(searchTerm) || 
           description.includes(searchTerm);
  }) || [];

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sort === "alphabetical") return a.name.localeCompare(b.name);
    return 0; // popularity default
  });

  return (
    <div className="min-h-screen">
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search destinations, locations, or descriptions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg",
                  "border-2 border-gray-200 focus:border-primary",
                  "outline-none focus:ring-2 focus:ring-primary/20",
                  "transition-all duration-200"
                )}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            <div className="relative w-full md:w-auto">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className={cn(
                  "appearance-none w-full md:w-48",
                  "pl-10 pr-8 py-3 rounded-lg",
                  "border-2 border-gray-200 focus:border-primary",
                  "outline-none focus:ring-2 focus:ring-primary/20",
                  "cursor-pointer transition-all duration-200"
                )}
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="rating">Sort by Rating</option>
                <option value="alphabetical">Sort A-Z</option>
              </select>
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary mb-4">Explore Destinations</h1>
            <p className="text-xl text-muted">Discover amazing places for your next adventure</p>
          </div>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-4 bg-gray-200 mb-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((dest) => {
                  const isWishlisted = wishlist.includes(dest.id);
                  const heroImage = (dest.gallery && dest.gallery.length > 0) ? dest.gallery[0] : dest.image;
                  return (
                    <Card key={dest.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                      {/* Hero image */}
                      <div className="relative">
                        {heroImage ? (
                          <img src={heroImage} alt={dest.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                          </div>
                        )}

                        {/* Type badge */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge className="bg-primary text-white text-xs px-2 py-1">{dest.type || 'Trip'}</Badge>
                        </div>

                        {/* Wishlist & rating */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          {dest.rating && (
                            <div className="flex items-center bg-white/80 rounded px-2 py-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="font-semibold">{dest.rating}</span>
                            </div>
                          )}
                          <button
                            className={`bg-white rounded-full p-2 shadow ${isWishlisted ? "text-pink-500" : "text-gray-400"}`}
                            onClick={() => {
                              setWishlist(prev => prev.includes(dest.id) ? prev.filter(id => id !== dest.id) : [...prev, dest.id]);
                            }}
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-secondary mb-1 line-clamp-1">{dest.name}</h3>
                            <p className="text-muted text-sm mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {dest.location}
                              {dest.coords && (
                                <a href={`https://www.google.com/maps/search/?api=1&query=${dest.coords.lat},${dest.coords.lng}`} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline text-xs">Map</a>
                              )}
                            </p>

                            <p className="text-muted text-sm mb-3 line-clamp-2">{dest.description || dest.overview || ''}</p>

                            {/* Amenities are shown in Quick View only */}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end gap-3">
                            <Link href={`/destinations/${dest.id}`}>
                              <Button className="bg-primary hover:bg-orange-600 text-white px-4 py-2">View</Button>
                            </Link>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="px-3 py-1">Quick View</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>{dest.name}</DialogTitle>
                                </DialogHeader>
                                <div className="grid lg:grid-cols-2 gap-4">
                                  <div>
                                    {dest.gallery && dest.gallery.length > 0 ? (
                                      <div className="grid grid-cols-2 gap-2">
                                        {dest.gallery.map((g,i) => (
                                          <img key={i} src={g} alt={`${dest.name} ${i+1}`} className="w-full h-40 object-cover rounded" />
                                        ))}
                                      </div>
                                    ) : (
                                      <img src={dest.image} alt={dest.name} className="w-full h-72 object-cover rounded" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-muted mb-3">{dest.description}</p>
                                    {dest.features && <AmenitiesList amenities={dest.features} displayCount={10} variant="grid" />}
                                    {dest.attractions && (
                                      <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Top Attractions</h4>
                                        <ul className="list-disc ml-5 text-sm text-gray-600">
                                          {dest.attractions.map((a,i) => <li key={i}>{a}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                    {dest.coords && (
                                      <div className="mt-4">
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${dest.coords.lat},${dest.coords.lng}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">Open in Google Maps</a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Destinations;
