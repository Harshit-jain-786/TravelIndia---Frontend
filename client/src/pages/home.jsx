import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Hotel, Package, ArrowRight, Star } from "lucide-react";
import GlobalSearchBar from "@/components/GlobalSearchBar";

export default function Home() {
  const { data: featuredPackages, isLoading: packagesLoading } = useQuery({
    queryKey: ["/api/packages", { featured: "true" }],
  });

  const { data: destinations, isLoading: destinationsLoading } = useQuery({
    queryKey: ["/api/destinations"],
  });

  const { data: hotels, isLoading: hotelsLoading } = useQuery({
    queryKey: ["/api/hotels"],
  });

  return (
    <>
      <div className="w-full flex items-center justify-center border-t border-gray-100 bg-white py-10 ">
        {/* Search bar only on home page, below navbar */}
        <GlobalSearchBar />
      </div>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(255, 107, 53, 0.9) 0%, rgba(30, 58, 138, 0.8) 100%), url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80')`
          }}
          data-testid="hero-section"
        >
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="hero-title">
              Discover Incredible India
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90" data-testid="hero-subtitle">
              Experience the beauty, culture, and adventure that India has to offer
            </p>
            <Link href="/packages">
              <Button
                size="lg"
                className="bg-accent hover:bg-yellow-500 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
                data-testid="button-explore-now"
              >
                Explore Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Quick Search Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-secondary mb-12" data-testid="section-title-plan-trip">
              Plan Your Perfect Trip
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Link href="/flights">
                <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer" data-testid="card-quick-search-flights">
                  <CardContent className="pt-6">
                    <Plane className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-secondary mb-2">Book Flights</h3>
                    <p className="text-muted">Find the best deals on domestic and international flights</p>
                    <Button variant="link" className="mt-4 text-primary p-0" data-testid="button-search-flights">
                      Search Flights <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/hotels">
                <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer" data-testid="card-quick-search-hotels">
                  <CardContent className="pt-6">
                    <Hotel className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-secondary mb-2">Book Hotels</h3>
                    <p className="text-muted">Discover comfortable stays across India</p>
                    <Button variant="link" className="mt-4 text-primary p-0" data-testid="button-find-hotels">
                      Find Hotels <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/packages">
                <Card className="text-center p-6 hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer" data-testid="card-quick-search-packages">
                  <CardContent className="pt-6">
                    <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-secondary mb-2">Travel Packages</h3>
                    <p className="text-muted">Complete travel packages for unforgettable experiences</p>
                    <Button variant="link" className="mt-4 text-primary p-0" data-testid="button-view-packages">
                      View Packages <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-secondary mb-12" data-testid="section-title-popular-destinations">
              Popular Destinations
            </h2>
            {destinationsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-300 mb-2"></div>
                      <div className="h-4 bg-gray-200 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-300 w-24"></div>
                        <div className="h-8 bg-gray-300 w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations?.slice(0, 4).map((destination) => (
                  <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" data-testid={`card-destination-${destination.id}`}>
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-secondary mb-2">{destination.name}</h3>
                      <p className="text-muted mb-4">{destination.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold text-lg">From ₹8,999</span>
                        <Link href={`/destinations/${destination.id}`}>
                          <Button className="bg-primary text-white hover:bg-orange-600" data-testid={`button-view-destination-${destination.id}`}>
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <Link href="/destinations">
                <Button className="bg-primary hover:bg-orange-600 text-white font-semibold px-8">
                  View All Destinations <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-secondary mb-12" data-testid="section-title-featured-packages">
              Featured Packages
            </h2>
            {packagesLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="w-full h-56 bg-gray-300"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-300 mb-3"></div>
                      <div className="h-16 bg-gray-200 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-8 bg-gray-300 w-32"></div>
                        <div className="h-10 bg-gray-300 w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPackages?.slice(0, 4).map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" data-testid={`card-featured-package-${pkg.id}`}>
                    <img
                      src={pkg.photo}
                      alt={pkg.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                          {pkg.duration} Days
                        </span>
                        <div className="flex items-center text-accent">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span className="font-medium">{pkg.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary mb-2">{pkg.name}</h3>
                      <p className="text-muted mb-4 line-clamp-2">{pkg.shortDescription}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold text-lg">₹{parseInt(pkg.price).toLocaleString('en-IN')}</span>
                        <Link href={`/packages/${pkg.id}`}>
                          <Button className="bg-primary text-white hover:bg-orange-600" data-testid={`button-book-package-${pkg.id}`}>
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <Link href="/packages">
                <Button className="bg-primary hover:bg-orange-600 text-white font-semibold px-8">
                  View All Packages <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Hotels */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-secondary mb-12" data-testid="section-title-featured-hotels">
              Featured Hotels
            </h2>
            {hotelsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-300 mb-2"></div>
                      <div className="h-4 bg-gray-200 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-300 w-24"></div>
                        <div className="h-8 bg-gray-300 w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {hotels?.slice(0, 4).map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" data-testid={`card-hotel-${hotel.id}`}>
                    <img
                      src={hotel.photo}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-accent">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span className="font-medium">{hotel.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary mb-2">{hotel.name}</h3>
                      <p className="text-muted mb-4 line-clamp-2">{hotel.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold text-lg">From ₹{parseInt(hotel.price_per_night).toLocaleString('en-IN')}</span>
                        <Link href={`/hotels/${hotel.id}`}>
                          <Button className="bg-primary text-white hover:bg-orange-600" data-testid={`button-view-hotel-${hotel.id}`}>
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <Link href="/hotels">
                <Button className="bg-primary hover:bg-orange-600 text-white font-semibold px-8">
                  View All Hotels <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
