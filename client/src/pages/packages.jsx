import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PackageCard from "@/components/packages/PackageCard";

export default function Packages() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: packages, isLoading, error } = useQuery({
    queryKey: ["/api/packages"],
    onError: (err) => {
      console.error("Error fetching packages:", err);
    },
  });

  // Log any errors in data fetching
  if (error) {
    console.error("Packages fetch error:", error);
  }

  const categories = [
    { id: "all", name: "All Packages" },
    { id: "Adventure", name: "Adventure" },
    { id: "Cultural", name: "Cultural" },
    { id: "Beach", name: "Beach" },
    { id: "Hill Stations", name: "Hill Stations" },
  ];

  const getInclusionIcon = (inclusion) => {
    const icons = {
      "Flights": Plane,
      "4-star accommodation": Hotel,
      "All meals": Utensils,
      "Private transport": Car,
      "Heritage hotels": Hotel,
      "Photo tours": Camera,
      "Cultural shows": Music,
      "Water sports": Waves,
      "Shopping tours": ShoppingBag,
    };

    return icons[inclusion] || Calendar;
  };

  const filteredPackages = packages?.filter(pkg =>
    selectedCategory === "all" || pkg.category === selectedCategory
  );

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary mb-4" data-testid="page-title-packages">
              Travel Packages
            </h1>
            <p className="text-xl text-muted">Complete travel experiences crafted just for you</p>
          </div>

          {/* Package Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`px-6 py-2 rounded-full font-medium ${selectedCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-white border-gray-300 hover:border-primary hover:text-primary"
                  }`}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`filter-category-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Package Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <CardContent className="p-5">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-12 bg-gray-200 mb-4"></div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="h-7 bg-gray-300 w-24 mb-1"></div>
                        <div className="h-4 bg-gray-200 w-16"></div>
                      </div>
                      <div className="h-6 bg-gray-300 w-12"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 bg-gray-200 flex-1 rounded"></div>
                      <div className="h-9 bg-gray-300 flex-1 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages?.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} data-testid={`card-package-${pkg.id}`} />
              ))}
            </div>
          )}

          {filteredPackages?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No packages found for the selected category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
