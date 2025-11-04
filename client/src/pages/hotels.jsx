import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Wifi, Car, Utensils, Waves, Dumbbell, Sparkles } from "lucide-react";
import { Link } from "wouter";
import AmenitiesList from "@/components/hotels/AmenitiesList";

export default function Hotels() {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    checkin: "",
    checkout: "",
    price: "",
  });

  const [filters, setFilters] = useState({
    starRating: null,
    amenities: [],
  });

  const { data: hotels, isLoading } = useQuery({
    queryKey: ["/api/hotels"],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // No-op: filtering is done below
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      "Free WiFi": Wifi,
      "Swimming Pool": Waves,
      "Restaurant": Utensils,
      "Gym": Dumbbell,
      "Spa": Sparkles,
      "Airport Shuttle": Car,
    };
    return icons[amenity] || Utensils;
  };

  // Filter hotels based on searchParams and filters
  const filteredHotels = hotels?.filter((hotel) => {
    const matchesDestination = searchParams.destination.trim() === "" || hotel.location?.toLowerCase().includes(searchParams.destination.trim().toLowerCase());
    const matchesPrice = searchParams.price.trim() === "" || parseInt(hotel.price_per_night) <= parseInt(searchParams.price);
    // Star rating filter: check average rating from reviews
    const avgRating = hotel.reviews && hotel.reviews.length > 0 ? hotel.reviews.reduce((acc, r) => acc + r.rating, 0) / hotel.reviews.length : null;
    const matchesStar = !filters.starRating || (avgRating && Math.round(avgRating) === filters.starRating);
    // Amenities
    const amenitiesArr = Array.isArray(hotel.amenities) ? hotel.amenities : typeof hotel.amenities === 'string' ? hotel.amenities.split(',') : [];
    const matchesAmenities = !filters.amenities.length || filters.amenities.every(a => amenitiesArr.includes(a));
    return matchesDestination && matchesPrice && matchesStar && matchesAmenities;
  });

  useEffect(() => {
    // Remove automatic logout/redirect logic from hotels.jsx
    // Only redirect if user is not logged in on initial load
    const user = localStorage.getItem("user");
    if (!user) window.location.href = "/login";
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary mb-4" data-testid="page-title-hotels">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-muted">Discover comfortable and luxurious accommodations</p>
          </div>

          {/* Hotel Search Form */}
          <Card className="max-w-4xl mx-auto shadow-xl mb-12">
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="grid md:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="form-hotel-search">
                {/* Destination */}
                <div className="lg:col-span-1">
                  <Label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="destination"
                      placeholder="Mumbai"
                      className="pl-10"
                      value={searchParams.destination}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                      data-testid="input-hotel-destination"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="lg:col-span-1">
                  <Label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="checkin"
                      type="date"
                      className="pl-10"
                      value={searchParams.checkin}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkin: e.target.value }))}
                      data-testid="input-hotel-checkin"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="lg:col-span-1">
                  <Label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="checkout"
                      type="date"
                      className="pl-10"
                      value={searchParams.checkout}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkout: e.target.value }))}
                      data-testid="input-hotel-checkout"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="lg:col-span-1">
                  <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      placeholder="e.g. 5000"
                      value={searchParams.price}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, price: e.target.value }))}
                      data-testid="input-hotel-price"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="lg:col-span-1">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</Label>
                  <Button type="submit" className="w-full bg-primary hover:bg-orange-600 text-white font-semibold" data-testid="button-search-hotels">
                    Search Hotels
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Filter Options */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                className={`border-gray-300 hover:border-primary hover:text-primary ${filters.starRating === 5 ? 'border-primary text-primary' : ''}`}
                data-testid="filter-5-star"
                onClick={() => setFilters(prev => ({ ...prev, starRating: prev.starRating === 5 ? null : 5 }))}
              >
                <Star className="mr-2 h-4 w-4" />
                5 Star
              </Button>
              <Button
                variant="outline"
                className={`border-gray-300 hover:border-primary hover:text-primary ${filters.starRating === 4 ? 'border-primary text-primary' : ''}`}
                data-testid="filter-4-star"
                onClick={() => setFilters(prev => ({ ...prev, starRating: prev.starRating === 4 ? null : 4 }))}
              >
                <Star className="mr-2 h-4 w-4" />
                4 Star
              </Button>
              <Button
                variant="outline"
                className={`border-gray-300 hover:border-primary hover:text-primary ${filters.amenities.includes('Swimming Pool') ? 'border-primary text-primary' : ''}`}
                data-testid="filter-pool"
                onClick={() => setFilters(prev => ({ ...prev, amenities: prev.amenities.includes('Swimming Pool') ? prev.amenities.filter(a => a !== 'Swimming Pool') : [...prev.amenities, 'Swimming Pool'] }))}
              >
                <Waves className="mr-2 h-4 w-4" />
                Swimming Pool
              </Button>
              <Button
                variant="outline"
                className={`border-gray-300 hover:border-primary hover:text-primary ${filters.amenities.includes('Free WiFi') ? 'border-primary text-primary' : ''}`}
                data-testid="filter-wifi"
                onClick={() => setFilters(prev => ({ ...prev, amenities: prev.amenities.includes('Free WiFi') ? prev.amenities.filter(a => a !== 'Free WiFi') : [...prev.amenities, 'Free WiFi'] }))}
              >
                <Wifi className="mr-2 h-4 w-4" />
                Free WiFi
              </Button>
              <Button
                variant="outline"
                className={`border-gray-300 hover:border-primary hover:text-primary ${filters.amenities.includes('Restaurant') ? 'border-primary text-primary' : ''}`}
                data-testid="filter-restaurant"
                onClick={() => setFilters(prev => ({ ...prev, amenities: prev.amenities.includes('Restaurant') ? prev.amenities.filter(a => a !== 'Restaurant') : [...prev.amenities, 'Restaurant'] }))}
              >
                <Utensils className="mr-2 h-4 w-4" />
                Restaurant
              </Button>
            </div>
          </div>

          {/* Hotel Results */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-4 bg-gray-200 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-gray-300 w-32"></div>
                      <div className="h-10 bg-gray-300 w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels?.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-all duration-300" data-testid={`card-hotel-${hotel.id}`}>
                  <img
                    src={hotel.photo}
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="flex text-accent mr-2">
                        {Array.from({ length: hotel.starRating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-muted">
                        Rating: {hotel.reviews && hotel.reviews.length > 0
                          ? (hotel.reviews.reduce((acc, r) => acc + r.rating, 0) / hotel.reviews.length).toFixed(1)
                          : "N/A"} ({hotel.reviews ? hotel.reviews.length : 0} reviews)
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-secondary mb-2" data-testid={`text-hotel-name-${hotel.id}`}>
                      {hotel.name}
                    </h3>
                    <p className="text-muted mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hotel.location}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-primary" data-testid={`text-hotel-price-${hotel.id}`}>
                          ₹{parseInt(hotel.price_per_night).toLocaleString('en-IN')}
                        </span>
                        <span className="text-muted">/night</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/hotels/${hotel.id}`}>
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" data-testid={`button-view-hotel-${hotel.id}`}>
                            View
                          </Button>
                        </Link>
                        <Link href="/checkout" state={{ type: 'hotel', item: hotel }}>
                          <Button className="bg-primary hover:bg-orange-600 text-white font-medium" data-testid={`button-book-hotel-${hotel.id}`}>
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <AmenitiesList amenities={hotel.amenities} displayCount={3} variant="inline" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
