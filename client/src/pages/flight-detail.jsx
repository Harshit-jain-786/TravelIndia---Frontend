// Airport lookup table
const AIRPORTS = {
    "Delhi": "Indira Gandhi International Airport (DEL)",
    "New Delhi": "Indira Gandhi International Airport (DEL)",
    "Mumbai": "Chhatrapati Shivaji Maharaj International Airport (BOM)",
    "Bombay": "Chhatrapati Shivaji Maharaj International Airport (BOM)",
    "Bangalore": "Kempegowda International Airport (BLR)",
    "Bengaluru": "Kempegowda International Airport (BLR)",
    "Chennai": "Chennai International Airport (MAA)",
    "Kolkata": "Netaji Subhas Chandra Bose International Airport (CCU)",
    "Hyderabad": "Rajiv Gandhi International Airport (HYD)",
    "Goa": "Goa International Airport (GOI)",
    "Jaipur": "Jaipur International Airport (JAI)",
    "Ahmedabad": "Sardar Vallabhbhai Patel International Airport (AMD)",
    "Pune": "Pune Airport (PNQ)",
    "Jalandhar": "Sri Guru Ram Dass Jee International Airport (ATQ)",
    "Ludhiana": "Ludhiana Airport (LUH)",
    "Patiala": "Chandigarh International Airport (IXC)",
    // Add more as needed
};

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FlightMap from "@/components/FlightMap";
import { Plane, MapPin, Clock, Share2, Luggage, Ban, Wifi, Utensils, MonitorPlay, Check, X } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";
import LiveWeather from "@/components/LiveWeather";

function formatDateTimeHM(dateString) {
    const d = new Date(dateString);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm} ${d.toLocaleDateString()}`;
}

// Automatically format city name for API (add country code if available)
function getWeatherLocation(city) {
    // Try city with country, then city only, then fallback to nearest major city
    const cityCountryMap = {
        "Delhi": "Delhi,IN",
        "New Delhi": "Delhi,IN",
        "Mumbai": "Mumbai,IN",
        "Bombay": "Mumbai,IN",
        "Bangalore": "Bangalore,IN",
        "Bengaluru": "Bangalore,IN",
        "Chennai": "Chennai,IN",
        "Kolkata": "Kolkata,IN",
        "Hyderabad": "Hyderabad,IN",
        "Goa": "Goa,IN",
        "Jaipur": "Jaipur,IN",
        "Ahmedabad": "Ahmedabad,IN",
        "Pune": "Pune,IN",
        "Jalandhar": "Amritsar,IN",
        "Ludhiana": "Amritsar,IN",
        "Patiala": "Chandigarh,IN"
    };
    // If not found, fallback to Delhi
    return cityCountryMap[city] || city || "Delhi,IN";
}

export default function FlightDetail() {
    // Feature: booking status
    const [bookingStatus, setBookingStatus] = useState("");
    // Feature: review likes/dislikes
    const [reviewVotes, setReviewVotes] = useState({});
    const [match, params] = useRoute("/flights/:id");
    const flightId = params?.id;

    const queryClient = useQueryClient();
    const { data: flight, isLoading, error } = useQuery({
        queryKey: ["/api/flights", flightId],
        queryFn: async () => {
            const res = await fetch(`/api/flights/${flightId}/`, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch flight");
            return res.json();
        },
        enabled: !!flightId,
        refetchOnWindowFocus: true,
    });

    // Feature: show price trend (use backend data if available)
    const priceTrend = flight && flight.price_trend ? flight.price_trend : (flight ? [flight.price, flight.price + 500, flight.price - 200, flight.price + 300] : []);

    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ["/api/flights/" + flightId + "/reviews"],
        enabled: !!flightId,
    });

    const [user] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [reviewError, setReviewError] = useState("");

    const reviewMutation = useMutation({
        mutationFn: async (review) => {
            setReviewError("");
            const res = await fetch(`/api/flights/${flightId}/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(review),
            });
            if (res.status === 401) {
                setReviewError("You must be logged in to submit a review.");
                throw new Error("Unauthorized");
            }
            if (!res.ok) throw new Error("Failed to submit review");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["/api/flights/" + flightId + "/reviews"]);
        },
    });

    const deleteReviewMutation = useMutation({
        mutationFn: async (reviewId) => {
            const res = await fetch(`/api/flights/reviews/${reviewId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            if (res.status === 401) throw new Error("Unauthorized");
            if (!res.ok) throw new Error("Failed to delete review");
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["/api/flights/" + flightId + "/reviews"]);
        },
    });

    // Animated loading skeleton with gradient shimmer
    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 bg-gradient-to-b from-orange-50 via-white to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="w-full h-64 bg-white/70 backdrop-blur-md rounded-xl shadow mb-8"></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
                                <div className="h-32 bg-gray-100 rounded"></div>
                                <div className="h-64 bg-gray-100 rounded"></div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="h-96 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !flight) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-secondary mb-4">Flight Not Found</h1>
                    <p className="text-muted mb-8">The flight you're looking for doesn't exist.</p>
                    <Link href="/flights">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            Browse All Flights
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Amenities helper chips
    const amenityChips = (() => {
        const defaultAmenities = ["WiFi", "Meals", "Entertainment"];
        const text = flight.amenities || defaultAmenities.join(", ");
        return text.split(",").map(a => a.trim()).filter(Boolean);
    })();

    // Distance helper
    function getDistanceKm([lat1, lon1], [lat2, lon2]) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-b from-orange-50 via-white to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* HERO SECTION */}
                <div
                    className="relative mb-8 p-6 rounded-2xl shadow-lg text-white"
                    style={flight.destination_image ? {
                        backgroundImage: `url(${flight.destination_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '320px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    } : {}}
                >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff5c2f] via-orange-400 to-yellow-400 opacity-60 pointer-events-none"></div>
                    <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Plane className="w-12 h-12 text-white drop-shadow-lg" />
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
                                    {flight.from_location} → {flight.to_location}
                                </h1>
                                <p className="text-sm opacity-90 mt-1">
                                    {AIRPORTS[flight.from_location] || flight.from_location} ➝ {AIRPORTS[flight.to_location] || flight.to_location}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {flight.airline_logo && (
                                <img
                                    src={flight.airline_logo}
                                    alt="Airline Logo"
                                    className="h-12 w-12 object-contain drop-shadow-md"
                                />
                            )}
                            <Badge className="bg-white text-[#ff5c2f] px-3 py-1 text-sm font-bold shadow">
                                {flight.airline}
                            </Badge>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/30 border-white text-white hover:bg-white/40 transition"
                                onClick={() => { navigator.clipboard.writeText(window.location.href); setBookingStatus("Link copied!"); }}
                                title="Share"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: main */}
                    <div className="lg:col-span-2 space-y-7">
                        {/* route + time */}
                        <div className="flex items-center flex-wrap gap-4">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span className="text-lg">
                                    {flight.from_location} → {flight.to_location}
                                    {AIRPORTS[flight.to_location] && (
                                        <span className="ml-2 text-xs font-semibold text-[#ff5c2f]">
                                            ({AIRPORTS[flight.to_location]})
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <span className="text-lg">
                                    Departure: {flight.departure ? formatDateTimeHM(flight.departure) : "N/A"} | Arrival: {flight.arrival ? formatDateTimeHM(flight.arrival) : "N/A"}
                                </span>
                            </div>
                        </div>
                        {flight.description && (
                            <div className="text-base leading-relaxed text-gray-700 bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow">
                                {flight.description}
                            </div>
                        )}

                        {/* Amenities & Policies */}
                        <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Amenities & Policies</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Luggage className="w-4 h-4 text-[#ff5c2f]" />
                                            <span>Baggage Allowance: <span className="font-semibold">{flight.baggage_allowance || "20kg"}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Ban className="w-4 h-4 text-[#ff5c2f]" />
                                            <span>Cancellation: <span className="font-semibold">{flight.cancellation_policy || "Refundable with fee"}</span></span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {amenityChips.map((a, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-[#ff5c2f] border border-orange-100 text-sm"
                                                title={a}
                                            >
                                                {a.toLowerCase().includes("wifi") && <Wifi className="w-3 h-3" />}
                                                {a.toLowerCase().includes("meal") && <Utensils className="w-3 h-3" />}
                                                {a.toLowerCase().includes("entertain") && <MonitorPlay className="w-3 h-3" />}
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Flights */}
                        <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Related Flights</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="flex flex-wrap gap-4">
                                    {flight.related_flights && flight.related_flights.length > 0 ? (
                                        flight.related_flights.map((rf, i) => (
                                            <Card key={rf.id || i} className="p-3 w-56 bg-white/90 border hover:shadow-md transition">
                                                <CardContent className="p-0 text-sm">
                                                    <div className="font-semibold text-gray-700">Alternative Date</div>
                                                    <div className="text-gray-600">{rf.departure}</div>
                                                    <div className="mt-2 text-orange-600 font-bold">₹{rf.price}</div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <>
                                            <Card className="p-3 w-56 bg-white/90 border hover:shadow-md transition">
                                                <CardContent className="p-0 text-sm">
                                                    <div className="font-semibold text-gray-700">Alternative Date</div>
                                                    <div className="text-gray-600">Tomorrow</div>
                                                    <div className="mt-2 text-orange-600 font-bold">₹{flight.price + 300}</div>
                                                </CardContent>
                                            </Card>
                                            <Card className="p-3 w-56 bg-white/90 border hover:shadow-md transition">
                                                <CardContent className="p-0 text-sm">
                                                    <div className="font-semibold text-gray-700">Alternative Airline</div>
                                                    <div className="text-gray-600">Indigo</div>
                                                    <div className="mt-2 text-orange-600 font-bold">₹{flight.price + 500}</div>
                                                </CardContent>
                                            </Card>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Grid */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <span>Details</span>
                                <span className="text-[#ff5c2f]">✈️</span>
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { icon: "🔢", label: "Flight Number", value: flight.flightNumber },
                                    { icon: "💺", label: "Class", value: flight.flight_class ? flight.flight_class.charAt(0).toUpperCase() + flight.flight_class.slice(1) : "" },
                                    { icon: "💰", label: "Price", value: `₹${flight.price}` },
                                    { icon: "🧾", label: "Status", value: bookingStatus || "Ready" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 flex flex-col items-center transition transform hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <span className="text-3xl mb-2">{item.icon}</span>
                                        <span className="font-semibold text-gray-700">{item.label}</span>
                                        <span className="text-[#ff5c2f] font-extrabold mt-1">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: booking + map */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="shadow-lg bg-white/90 backdrop-blur-md border-0 rounded-2xl">
                            <CardHeader>
                                <CardTitle>Book this Flight</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full bg-[#ff5c2f] hover:bg-orange-600 text-white"
                                    onClick={() => setBookingStatus("Booking in progress...")}
                                >
                                    Book Now
                                </Button>
                                {bookingStatus && (
                                    <div className="mt-1 text-green-600 font-semibold">{bookingStatus}</div>
                                )}
                                <div className="text-xs text-gray-500">
                                    Price trend: {priceTrend.join(" → ")}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-center">
                            <div className="w-full">
                                <Card className="bg-white/80 backdrop-blur-md border-0 shadow rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-gray-700">Route Map</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="w-full h-85 rounded-xl overflow-hidden">
                                            <FlightMap
                                                fromCoords={flight.from_coords}
                                                toCoords={flight.to_coords}
                                                fromName={flight.from_location}
                                                toName={flight.to_location}
                                                showRouteOnly={true}
                                            />
                                        </div>
                                        {Array.isArray(flight.from_coords) &&
                                            Array.isArray(flight.to_coords) &&
                                            flight.from_coords.length === 2 &&
                                            flight.to_coords.length === 2 && (
                                                <div className="text-center mt-2 font-medium text-orange-600">
                                                    Distance: {getDistanceKm(flight.from_coords, flight.to_coords).toFixed(2)} km
                                                </div>
                                            )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Live Weather */}
                        <Card className="shadow-lg bg-white/90 backdrop-blur-md border-0 rounded-2xl">
                            <CardHeader>
                                <CardTitle>Live Weather</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <LiveWeather location={getWeatherLocation(flight.to_location)} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>Traveler Reviews</span>
                        <span className="text-yellow-400">★</span>
                    </h2>
                    {reviewError && (
                        <div className="mb-4 text-red-600 font-semibold bg-red-50 border border-red-100 px-3 py-2 rounded">
                            {reviewError}
                        </div>
                    )}
                    {user ? (
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow border-0">
                            <ReviewForm onSubmit={reviewMutation.mutate} submitting={reviewMutation.isLoading} />
                        </div>
                    ) : (
                        <div className="mb-4">
                            <Link href="/login">
                                <Button className="bg-[#ff5c2f] hover:bg-orange-600 text-white">Login to write a review</Button>
                            </Link>
                        </div>
                    )}
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <Card key={review.id} className="bg-white/90 backdrop-blur-sm shadow-md p-5 border hover:shadow-lg transition rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {/* <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#ff5c2f] font-bold">
                                            {(review.user?.username || review.user?.email || "U").toUpperCase()}
                                        </div> */}
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {review.user?.username ? review.user.username : (review.user?.email ? review.user.email : "Traveler")}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-3">{review.text}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full"
                                        onClick={() => setReviewVotes(v => ({ ...v, [review.id]: (v[review.id] || 0) + 1 }))}
                                        title="Like"
                                    >
                                        👍 {reviewVotes[review.id] || 0}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full"
                                        onClick={() => setReviewVotes(v => ({ ...v, [review.id]: (v[review.id] || 0) - 1 }))}
                                        title="Dislike"
                                    >
                                        👎
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500"
                                        onClick={() => alert('Reported!')}
                                        title="Report"
                                    >
                                        Report
                                    </Button>
                                    {user && review.user?.id === user.id && (
                                        <Button
                                            variant="outline"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                            size="sm"
                                            onClick={() => deleteReviewMutation.mutate(review.id)}
                                            disabled={deleteReviewMutation.isLoading}
                                            title="Delete"
                                        >
                                            {deleteReviewMutation.isLoading ? "Deleting..." : "Delete"}
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
