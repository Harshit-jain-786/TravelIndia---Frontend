import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Star, MapPin, Hotel, Check, X, Calendar, Users, ChevronLeft, 
    ChevronRight, Globe, Expand, ChevronsUpDown, Phone, Mail 
} from "lucide-react";
import { Link } from "wouter";
import ReviewForm from "../components/ReviewForm";
import { useState } from "react";
import AmenitiesList from "@/components/hotels/AmenitiesList";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function HotelDetail() {
    const [match, params] = useRoute("/hotels/:id");
    const hotelId = params?.id;
    const queryClient = useQueryClient();
    const [submitting, setSubmitting] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedDates, setSelectedDates] = useState({ from: null, to: null });
    const [guests, setGuests] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [sortReviewsBy, setSortReviewsBy] = useState("recent");
    const [filterRating, setFilterRating] = useState("all");

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    })();
    const accessToken = localStorage.getItem("accessToken");

    // Calculate total price
    const calculateTotal = () => {
        const room = hotel.rooms?.find(r => r.type === selectedRoom);
        if (!room || !selectedDates.from || !selectedDates.to) return 0;
        
        const nights = Math.ceil((selectedDates.to - selectedDates.from) / (1000 * 60 * 60 * 24));
        const basePrice = room.price * nights;
        const taxes = Math.round(basePrice * 0.18); // 18% tax
        
        return basePrice + taxes;
    };

    // Delete review mutation
    const deleteMutation = useMutation({
        mutationFn: async (reviewId) => {
            if (!accessToken) {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                throw new Error('Not authenticated. Redirecting to login.');
            }
            const res = await fetch(`/api/hotels/reviews/${reviewId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!res.ok) {
                const text = await res.text();
                console.error('Delete failed:', res.status, text);
                throw new Error("Failed to delete review");
            }
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["/api/hotels", hotelId]);
        },
    });

    const { data: hotel, isLoading, error } = useQuery({
        queryKey: ["/api/hotels", hotelId],
        enabled: !!hotelId,
    });

    // Query for similar hotels
    const { data: similarHotels } = useQuery({
        queryKey: ["/api/hotels/similar", hotelId],
        queryFn: async () => {
            const res = await fetch(`/api/hotels/similar/${hotelId}/`);
            if (!res.ok) throw new Error("Failed to fetch similar hotels");
            return res.json();
        },
        enabled: !!hotelId,
    });

    // Reviews mutation
    const mutation = useMutation({
        mutationFn: async (review) => {
            setSubmitting(true);
            const res = await fetch(`/api/hotels/${hotelId}/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: JSON.stringify(review),
            });
            setSubmitting(false);
            if (!res.ok) throw new Error("Failed to submit review");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["/api/hotels", hotelId]);
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="w-full h-96 bg-gray-300 rounded-lg mb-8"></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-8 bg-gray-300 w-3/4"></div>
                                <div className="h-32 bg-gray-200"></div>
                                <div className="h-64 bg-gray-200"></div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="h-96 bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-secondary mb-4">Hotel Not Found</h1>
                    <p className="text-muted mb-8">The hotel you're looking for doesn't exist.</p>
                    <Link href="/hotels">
                        <Button className="bg-primary hover:bg-orange-600">
                            Browse All Hotels
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Image Gallery */}
                <div className="relative mb-8">
                    <div className="relative w-full h-96">
                        {hotel.gallery && hotel.gallery.length > 0 ? (
                            <>
                                <img
                                    src={hotel.gallery[currentImageIndex]}
                                    alt={`${hotel.name} - ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg flex items-center gap-2 transition-colors">
                                            <Expand className="w-5 h-5" />
                                            <span>View Gallery</span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl w-full h-[80vh]">
                                        <div className="relative h-full">
                                            <img
                                                src={hotel.gallery[currentImageIndex]}
                                                alt={`${hotel.name} - ${currentImageIndex + 1}`}
                                                className="w-full h-[calc(100%-100px)] object-contain"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/10 backdrop-blur-sm">
                                                <div className="flex gap-2 overflow-x-auto">
                                                    {hotel.gallery.map((img, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setCurrentImageIndex(idx)}
                                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                                                                ${currentImageIndex === idx ? 'border-primary' : 'border-transparent'}`}
                                                        >
                                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                                        onClick={() => setCurrentImageIndex(prev => (prev === 0 ? hotel.gallery.length - 1 : prev - 1))}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                                        onClick={() => setCurrentImageIndex(prev => (prev === hotel.gallery.length - 1 ? 0 : prev + 1))}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </div>
                            </>
                        ) : hotel.photo && (
                            <img
                                src={hotel.photo}
                                alt={hotel.name}
                                className="w-full h-full object-cover rounded-lg shadow-lg"
                            />
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center">
                            <Hotel className="w-8 h-8 mr-2 text-primary" />
                            {hotel.name}
                        </h1>
                        <div className="flex items-center space-x-4 mb-4">
                            <Badge className="bg-primary text-white text-base px-3 py-1">
                                {hotel.location}
                            </Badge>
                            {hotel.average_rating && (
                                <span className="flex items-center text-yellow-500 font-semibold">
                                    <Star className="w-5 h-5 mr-1" />
                                    {hotel.average_rating} / 5
                                </span>
                            )}
                        </div>

                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="rooms">Rooms & Rates</TabsTrigger>
                                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                                <TabsTrigger value="location">Location</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview">
                                <div className="space-y-6">
                                    <div className="text-lg text-muted">{hotel.description}</div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-primary" />
                                            <span>{hotel.phone || "Contact number not available"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-primary" />
                                            <span>{hotel.email || "Email not available"}</span>
                                        </div>
                                        {hotel.website && (
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-primary" />
                                                <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Visit Website
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    {hotel.policies && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold mb-3">Hotel Policies</h3>
                                            <Accordion type="single" collapsible>
                                                {Object.entries(hotel.policies).map(([key, value], idx) => (
                                                    <AccordionItem key={idx} value={`policy-${idx}`}>
                                                        <AccordionTrigger className="text-left">{key}</AccordionTrigger>
                                                        <AccordionContent>{value}</AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="rooms">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {hotel.rooms?.map((room, idx) => (
                                        <Card key={idx} className="overflow-hidden">
                                            <img src={room.image} alt={room.type} className="w-full h-48 object-cover" />
                                            <CardContent className="p-4">
                                                <h3 className="text-xl font-semibold mb-2">{room.type}</h3>
                                                <p className="text-muted mb-4">{room.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-lg font-bold text-primary">
                                                        ₹{room.price}<span className="text-sm font-normal text-muted">/night</span>
                                                    </div>
                                                    <Button 
                                                        className="bg-primary hover:bg-orange-600"
                                                        onClick={() => {
                                                            setSelectedRoom(room.type);
                                                            document.getElementById('booking-card').scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                    >
                                                        Select
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="amenities">
                                <div className="space-y-4">
                                    {hotel.amenities && hotel.amenities.length > 0 ? (
                                        <AmenitiesList 
                                            amenities={hotel.amenities} 
                                            displayCount={20} 
                                            variant="grid" 
                                            className="bg-gray-50 p-4 rounded-lg"
                                            showFull={true}
                                        />
                                    ) : (
                                        <span className="text-muted block p-4 bg-gray-50 rounded-lg">No amenities listed.</span>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="location">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-lg">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span>{hotel.location}</span>
                                    </div>
                                    <div className="h-[400px] rounded-lg overflow-hidden border">
                                        <iframe
                                            title={`Map of ${hotel.name}`}
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_KEY&q=${encodeURIComponent(hotel.name + ' ' + hotel.location)}`}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    {hotel.landmarks && (
                                        <div className="mt-4">
                                            <h3 className="font-semibold mb-2">Nearby Landmarks</h3>
                                            <ul className="grid md:grid-cols-2 gap-2">
                                                {hotel.landmarks.map((landmark, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        <span>{landmark.name} - {landmark.distance}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Reviews Section */}
                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold">Guest Reviews</h2>
                                <div className="flex gap-4">
                                    <Select value={filterRating} onValueChange={setFilterRating}>
                                        <SelectTrigger className="w-36">
                                            <SelectValue placeholder="Filter by Rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Ratings</SelectItem>
                                            <SelectItem value="5">5 Stars</SelectItem>
                                            <SelectItem value="4">4 Stars</SelectItem>
                                            <SelectItem value="3">3 Stars</SelectItem>
                                            <SelectItem value="2">2 Stars</SelectItem>
                                            <SelectItem value="1">1 Star</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={sortReviewsBy} onValueChange={setSortReviewsBy}>
                                        <SelectTrigger className="w-36">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recent">Most Recent</SelectItem>
                                            <SelectItem value="rating-high">Highest Rating</SelectItem>
                                            <SelectItem value="rating-low">Lowest Rating</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {hotel.reviews && hotel.reviews.length > 0 ? (
                                <>
                                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-primary mb-2">
                                                        {hotel.average_rating?.toFixed(1) || "N/A"}
                                                    </div>
                                                    <div className="flex justify-center mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-5 h-5 ${i < Math.round(hotel.average_rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                    <div className="text-sm text-muted">
                                                        Based on {hotel.reviews.length} reviews
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <div className="md:col-span-3">
                                            <div className="space-y-2">
                                                {[5,4,3,2,1].map(rating => {
                                                    const count = hotel.reviews.filter(r => r.rating === rating).length;
                                                    const percentage = (count / hotel.reviews.length) * 100;
                                                    return (
                                                        <div key={rating} className="flex items-center gap-2">
                                                            <div className="flex items-center w-20">
                                                                <span className="mr-2">{rating}</span>
                                                                <Star className="w-4 h-4 text-yellow-400" />
                                                            </div>
                                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-primary rounded-full transition-all duration-500" 
                                                                    style={{width: `${percentage}%`}}
                                                                />
                                                            </div>
                                                            <div className="w-16 text-sm text-muted">{count} reviews</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {hotel.reviews
                                            .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
                                            .sort((a, b) => {
                                                if (sortReviewsBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
                                                if (sortReviewsBy === 'rating-high') return b.rating - a.rating;
                                                if (sortReviewsBy === 'rating-low') return a.rating - b.rating;
                                                return 0;
                                            })
                                            .map((review) => (
                                                <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                                                    <div className="flex items-center mb-2">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                        ))}
                                                        <span className="ml-2 font-semibold text-secondary">{review.user}</span>
                                                        <span className="ml-4 text-xs text-muted">{new Date(review.created_at).toLocaleDateString()}</span>
                                                        {user && (review.user === user.username || review.user === user.email) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="ml-auto"
                                                                onClick={() => deleteMutation.mutate(review.id)}
                                                                disabled={deleteMutation.isLoading}
                                                                title="Delete review"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="text-base text-secondary">{review.comment}</div>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-muted">No reviews yet.</div>
                            )}
                        </div>

                        {/* Review Form */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
                            {user ? (
                                <ReviewForm
                                    onSubmit={(data) => mutation.mutate(data)}
                                    submitting={submitting || mutation.isLoading}
                                />
                            ) : (
                                <div className="text-muted">Please log in to write a review.</div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <Card id="booking-card" className="shadow-lg sticky top-24">
                            <CardHeader>
                                <CardTitle>Book this Hotel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Select Dates</label>
                                    <DatePickerWithRange 
                                        date={selectedDates} 
                                        onDateChange={setSelectedDates}
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Number of Guests</label>
                                    <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select guests" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1,2,3,4,5,6].map(num => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Room Type</label>
                                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select room type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hotel.rooms?.map((room) => (
                                                <SelectItem key={room.type} value={room.type}>
                                                    {room.type} - ₹{room.price}/night
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedRoom && selectedDates.from && selectedDates.to && (
                                    <div className="border-t pt-4 mt-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Room Rate</span>
                                                <span>₹{hotel.rooms.find(r => r.type === selectedRoom)?.price || 0}/night</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Number of Nights</span>
                                                <span>{Math.ceil((selectedDates.to - selectedDates.from) / (1000 * 60 * 60 * 24))}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Taxes & Fees</span>
                                                <span>₹{Math.round((hotel.rooms.find(r => r.type === selectedRoom)?.price || 0) * 0.18)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                                <span>Total</span>
                                                <span>₹{calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button 
                                    className="w-full bg-primary hover:bg-orange-600"
                                    disabled={!selectedRoom || !selectedDates.from || !selectedDates.to}
                                >
                                    Book Now
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Similar Hotels */}
                        {similarHotels && similarHotels.length > 0 && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Similar Hotels</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px]">
                                        <div className="space-y-4">
                                            {similarHotels.map((similar) => (
                                                <Link key={similar.id} href={`/hotels/${similar.id}`}>
                                                    <div className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                        <img 
                                                            src={similar.photo} 
                                                            alt={similar.name}
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                        />
                                                        <div>
                                                            <h4 className="font-medium text-secondary">{similar.name}</h4>
                                                            <p className="text-sm text-muted">{similar.location}</p>
                                                            {similar.average_rating && (
                                                                <div className="flex items-center mt-1">
                                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                                    <span className="ml-1 text-sm">{similar.average_rating}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}