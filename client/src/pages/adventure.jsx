import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Clock, Users, Mountain, MapPin, Filter } from "lucide-react";

export default function Adventure() {
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [sortBy, setSortBy] = useState("title");

    const { data: packages, isLoading } = useQuery({
        queryKey: ["/api/adventures", { category: "adventure" }],
        queryFn: async () => {
            const res = await fetch("/api/adventures/?category=adventure");
            if (!res.ok) throw new Error("Failed to fetch adventures");
            return res.json();
        },
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: "bg-green-100 text-green-800",
            moderate: "bg-yellow-100 text-yellow-800",
            challenging: "bg-orange-100 text-orange-800",
            extreme: "bg-red-100 text-red-800",
        };
        return colors[difficulty] || "bg-gray-100 text-gray-600";
    };

    // Mock adventure activities for structure
    const adventureTypes = [
        {
            id: 1,
            title: "Mountain Trekking",
            description: "Conquer peaks and explore scenic mountain trails",
            icon: Mountain,
            count: 24,
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
        },
        {
            id: 2,
            title: "Rock Climbing",
            description: "Scale challenging cliffs and rock formations",
            icon: Mountain,
            count: 18,
            image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
        },
        {
            id: 3,
            title: "Water Sports",
            description: "Thrilling water adventures and aquatic activities",
            icon: Mountain,
            count: 32,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
        },
        {
            id: 4,
            title: "Wildlife Safari",
            description: "Encounter exotic wildlife in their natural habitat",
            icon: Mountain,
            count: 16,
            image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
        }
    ];

    const filteredPackages = packages?.filter(pkg => {
        const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Mock difficulty filter based on package title/description keywords
        let matchesDifficulty = true;
        if (difficultyFilter !== "all") {
            // This would be replaced with actual difficulty data from backend
            const difficulty = pkg.title.toLowerCase().includes("extreme") ? "extreme" :
                pkg.title.toLowerCase().includes("challenging") ? "challenging" :
                    pkg.title.toLowerCase().includes("easy") ? "easy" : "moderate";
            matchesDifficulty = difficulty === difficultyFilter;
        }

        return matchesSearch && matchesDifficulty;
    }).sort((a, b) => {
        switch (sortBy) {
            case "price":
                return parseFloat(a.price) - parseFloat(b.price);
            case "duration":
                return a.duration - b.duration;
            case "rating":
                return parseFloat(b.rating) - parseFloat(a.rating);
            case "title":
            default:
                return a.title.localeCompare(b.title);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded mb-4 w-64"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="bg-gray-300 h-48"></div>
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-4"></div>
                                        <div className="h-8 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
    <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">
                        Adventure Tours
                    </h1>
                    <p className="text-xl text-gray-600">
                        Embark on thrilling adventures and create unforgettable memories
                    </p>
                </div>

                {/* Adventure Types */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="adventure-types-title">
                        Adventure Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {adventureTypes.map((type) => (
                            <Card
                                key={type.id}
                                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                                data-testid={`adventure-type-${type.id}`}
                            >
                                <div className="relative">
                                    <img
                                        src={type.image}
                                        alt={type.title}
                                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-bold text-lg">{type.title}</h3>
                                        <p className="text-sm opacity-90">{type.count} adventures</p>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-gray-600 text-sm">{type.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search adventures..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                                data-testid="input-search-adventures"
                            />
                        </div>

                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger data-testid="select-difficulty-filter">
                                <SelectValue placeholder="Difficulty Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="challenging">Challenging</SelectItem>
                                <SelectItem value="extreme">Extreme</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger data-testid="select-sort-by">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title">Title</SelectItem>
                                <SelectItem value="price">Price</SelectItem>
                                <SelectItem value="duration">Duration</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex items-center text-gray-600">
                            <Filter className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                                {filteredPackages?.length || 0} adventures
                            </span>
                        </div>
                    </div>
                </div>

                {/* Adventure Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages?.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            data-testid={`adventure-card-${pkg.id}`}
                        >
                            <div className="relative">
                                <img
                                    src={pkg.imageUrl}
                                    alt={pkg.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-adventure-green text-white">
                                        Adventure
                                    </Badge>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Badge className={getDifficultyColor("moderate")}>
                                        Moderate
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-sunset-orange mr-1 fill-current" />
                                        <span className="text-sm font-medium" data-testid={`adventure-rating-${pkg.id}`}>
                                            {pkg.rating} ({pkg.reviewCount})
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>India</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid={`adventure-title-${pkg.id}`}>
                                    {pkg.title}
                                </h3>

                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {pkg.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span data-testid={`adventure-duration-${pkg.id}`}>
                                            {pkg.duration} Days
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Users className="w-4 h-4 mr-1" />
                                        <span data-testid={`adventure-group-size-${pkg.id}`}>
                                            Max {pkg.maxGroupSize}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-adventure-green" data-testid={`adventure-price-${pkg.id}`}>
                                            {formatPrice(pkg.price)}
                                        </span>
                                        <span className="text-gray-500 text-sm">/person</span>
                                    </div>
                                    <Button
                                        className="bg-adventure-green hover:bg-green-700"
                                        data-testid={`button-book-adventure-${pkg.id}`}
                                    >
                                        Book Adventure
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )) || []}
                </div>

                {/* Empty State */}
                {(!filteredPackages || filteredPackages.length === 0) && !isLoading && (
                    <div className="text-center py-12">
                        <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            No adventures found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your search or filters to find more adventures.
                        </p>
                    </div>
                )}

                {/*
                        <Card className="mt-8 bg-gradient-to-br from-adventure-green to-green-700 text-white">
                            <CardContent className="p-8">
                                <h2 className="text-3xl font-bold mb-6 text-center">
                                    Adventure with Safety First
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mountain className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
                                        <p className="opacity-90">
                                            Professional and certified adventure guides with years of experience
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Small Groups</h3>
                                        <p className="opacity-90">
                                            Limited group sizes ensure personalized attention and safety
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Star className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Quality Equipment</h3>
                                        <p className="opacity-90">
                                            Top-grade safety equipment and gear for all adventure activities
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        */}
            </div>
        </div>
    );
}
