import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Star, Heart, Share2, Compass } from "lucide-react";
import ReviewComponent from "@/components/ReviewComponent";
import { useAuth } from "@/context/AuthContext";

// Add your featureIcons mapping here
const featureIcons = {
    // Example: "Beach": BeachIcon,
};


function DestinationDetail(props) {
    // Get id from route params (plural, to match router)
    const [match, params] = useRoute("/destinations/:id");
    const destId = params ? params.id : undefined;
    
    // Fetch destination data from backend
    console.log('destId:', destId);
    const { data: dest, isLoading: destLoading, error: destError } = useQuery({
        queryKey: ['destination', destId],
        queryFn: async () => {
            const res = await fetch(`/api/destinations/${destId}/`);
            if (!res.ok) throw new Error('Failed to fetch destination');
            return res.json();
        },
        enabled: !!destId
    });
    console.log('Destination Data:', dest);
    console.log('Destination Error:', destError);
    
    // Initialize query client
    const queryClient = useQueryClient();
    
    // Get auth context
    const { user, accessToken } = useAuth();

    // Get coordinates automatically if missing
    const [coords, setCoords] = React.useState(null);
    React.useEffect(() => {
        if (dest && !dest.coords && dest.name) {
            // Use a free geocoding API (e.g., OpenStreetMap Nominatim)
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dest.name)}`)
                .then(r => r.json())
                .then(data => {
                    if (data && data[0]) {
                        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
                    }
                });
        } else if (dest && dest.coords) {
            setCoords(dest.coords);
        }
    }, [dest]);

    const features = dest?.features || [];
    const avgRating = dest?.rating;
    const ratingCount = 10; // TODO: fetch from backend if available
    const isWishlisted = false;
    const shareLink = () => {};
    const toggleWishlist = () => {};

    // Early returns after all hooks are declared
    if (!destId) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-red-600">No destination ID provided in URL.</div>;
    }

    if (destLoading) {
        return <div className="min-h-screen flex items-center justify-center text-lg">Loading destination...</div>;
    }

    if (destError) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-red-600">Failed to load destination.</div>;
    }

    if (!dest) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-muted">No destination found.</div>;
    }


    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Gallery */}
                <div className="relative mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dest.gallery && dest.gallery.length > 0 ? (
                        dest.gallery.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`${dest.name} photo ${i + 1}`}
                                className="w-full h-64 object-cover rounded-xl shadow-xl border-2 border-blue-100"
                                loading="lazy"
                            />
                        ))
                    ) : dest.image ? (
                        <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-96 object-cover rounded-xl shadow-xl border-2 border-blue-100"
                            loading="lazy"
                        />
                    ) : null}
                </div>

                <div className="flex items-start justify-between gap-4 mb-8">
                    <h1 className="text-4xl font-extrabold text-primary flex items-center gap-3">
                        {dest.name}
                        <Button variant="ghost" className="h-10 px-3" onClick={shareLink} aria-label="Share destination">
                            <Share2 className="w-6 h-6" />
                        </Button>
                        <Button
                            variant={isWishlisted ? "default" : "outline"}
                            className={isWishlisted ? "bg-pink-500 hover:bg-pink-600 text-white h-10 px-4" : "h-10 px-4"}
                            onClick={toggleWishlist}
                            aria-pressed={isWishlisted}
                            aria-label="Toggle wishlist"
                        >
                            <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
                        </Button>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center flex-wrap gap-4 mb-4">
                            {dest.location && (
                                <Badge className="bg-primary text-white text-base px-4 py-2 flex items-center gap-2 shadow">
                                    <MapPin className="w-5 h-5" />
                                    {dest.location}
                                </Badge>
                            )}
                            {(dest.rating || avgRating) && (
                                <span className="flex items-center text-yellow-500 font-bold text-lg">
                                    <Star className="w-6 h-6 mr-2" />
                                    {(dest.rating ?? avgRating)?.toFixed ? (dest.rating ?? avgRating).toFixed(1) : dest.rating ?? avgRating}
                                    {ratingCount ? <span className="ml-2 text-base text-muted">({ratingCount})</span> : null}
                                </span>
                            )}
                        </div>

                        {dest.description ? (
                            <div className="text-lg text-muted mb-6 bg-white/60 rounded-xl p-4 shadow">{dest.description}</div>
                        ) : (
                            <div className="text-lg text-muted mb-6 bg-white/60 rounded-xl p-4 shadow">Explore this destination’s highlights and traveler tips.</div>
                        )}

                        <div className="space-y-2 mt-6">
                            <h2 className="text-xl font-bold mb-2 text-primary">Features</h2>
                            <div className="flex flex-wrap gap-3">
                                {features.map((feature, idx) => {
                                    const Icon = featureIcons[feature] || Compass;
                                    return (
                                        <Badge key={idx} className="bg-blue-100 text-blue-800 flex items-center gap-2 px-3 py-2 rounded shadow">
                                            <Icon className="w-5 h-5" />
                                            {feature}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Map */}
                        {dest.coords && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-2 text-primary">Location Map</h2>
                                <iframe
                                    title="Destination Map"
                                    src={`https://maps.google.com/maps?q=${dest.coords.lat},${dest.coords.lng}&z=12&output=embed`}
                                    width="100%"
                                    height="320"
                                    className="rounded-xl border-2 border-blue-100 shadow"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {/* Nearby (stub) */}
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-2 text-primary">Things Nearby</h2>
                            <p className="text-muted bg-white/60 rounded-xl p-4 shadow">
                                Hotels, restaurants, and attractions near this destination can be listed here by querying a POI endpoint using coords. Add a query to /api/destinations/{destId}/nearby to populate cards.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="shadow-xl border-2 border-blue-100 rounded-xl">
                            <CardHeader>
                                <CardTitle className="text-primary text-xl font-bold">Plan Your Trip</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full bg-primary hover:bg-orange-600 text-lg font-semibold py-3 rounded-xl shadow">Book Now</Button>
                                {dest.coords && (
                                    <a
                                        className="text-base text-blue-600 hover:underline inline-flex items-center gap-2"
                                        href={`https://www.google.com/maps/search/?api=1&query=${dest.coords.lat},${dest.coords.lng}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MapPin className="w-5 h-5" />
                                        Open in Google Maps
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-16">
                    <h2 className="text-3xl font-extrabold mb-6 text-primary">Reviews</h2>
                    <ReviewComponent 
                        destinationId={destId} 
                        reviews={dest.reviews || []}
                        onSuccess={() => {
                            // Invalidate destination query to refresh the data
                            queryClient.invalidateQueries(['destination', destId]);
                        }}
                    />
                    {/* Debug information - remove in production */}
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
                        <p>Debug Info:</p>
                        <p>User logged in: {user ? 'Yes' : 'No'}</p>
                        <p>Auth token present: {accessToken ? 'Yes' : 'No'}</p>
                        <p>Reviews available: {dest.reviews?.length || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DestinationDetail;


