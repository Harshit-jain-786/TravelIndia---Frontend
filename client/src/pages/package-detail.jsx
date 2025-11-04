import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Calendar, Users, Plane, Hotel, Utensils, Car, Check, X, Clock } from "lucide-react";
import { Link } from "wouter";
import ReviewForm from "@/components/ReviewForm";

export default function PackageDetail() {
  const [match, params] = useRoute("/packages/:id");
  const packageId = params?.id;

  const queryClient = useQueryClient();
  const { data: pkg, isLoading, error } = useQuery({
    queryKey: ["/api/packages", packageId],
    enabled: !!packageId,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/packages/" + packageId + "/reviews"],
    enabled: !!packageId,
  });

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [reviewError, setReviewError] = useState("");

  const reviewMutation = useMutation({
    mutationFn: async (review) => {
      setReviewError("");
      const res = await fetch(`/api/packages/${packageId}/reviews/`, {
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
      queryClient.invalidateQueries(["/api/packages/" + packageId + "/reviews"]);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const res = await fetch(`/api/packages/reviews/${reviewId}/`, {
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
      queryClient.invalidateQueries(["/api/packages/" + packageId + "/reviews"]);
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

  if (error || !pkg) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Package Not Found</h1>
          <p className="text-muted mb-8">The package you're looking for doesn't exist.</p>
          <Link href="/packages">
            <Button className="bg-primary hover:bg-orange-600">
              Browse All Packages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        <div className="relative mb-8">
          <img
            src={pkg.photo}
            alt={pkg.name}
            className="w-full h-96 object-cover rounded-2xl"
            data-testid="img-package-hero"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-accent text-white px-4 py-2 text-sm font-medium">
              {pkg.duration} Days / {pkg.duration - 1} Nights
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center bg-white bg-opacity-90 px-3 py-2 rounded-full">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-secondary">{pkg.rating}</span>
              <span className="text-muted text-sm ml-1">({pkg.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-secondary mb-4" data-testid="text-package-title">
                {pkg.name}
              </h1>
              <p className="text-xl text-muted mb-4">{pkg.shortDescription}</p>
              <div className="flex items-center gap-4 text-muted">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{pkg.duration} Days</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{pkg.category}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4" data-testid="tabs-package-details">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Package Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted leading-relaxed" data-testid="text-package-description">
                      {pkg.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Day-wise Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pkg.itinerary?.map((day, index) => (
                      <div key={index} className="mb-6 last:mb-0" data-testid={`itinerary-day-${day.day}`}>
                        <div className="flex items-center mb-3">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                            {day.day}
                          </div>
                          <h3 className="text-lg font-semibold text-secondary">{day.title}</h3>
                        </div>
                        <div className="ml-11">
                          <ul className="space-y-1">
                            {day.activities?.map((activity, actIndex) => (
                              <li key={actIndex} className="text-muted flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inclusions" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Inclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {(Array.isArray(pkg.inclusions)
                          ? pkg.inclusions
                          : (pkg.inclusions ? pkg.inclusions.split(",") : [])
                        ).map((inclusion, index) => (
                          <li key={index} className="flex items-center text-muted" data-testid={`inclusion-${index}`}>
                            <Check className="w-5 h-5 mr-3 text-green-600" />
                            {inclusion.trim()}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Exclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {pkg.exclusions?.map((exclusion, index) => (
                          <li key={index} className="flex items-center text-muted" data-testid={`exclusion-${index}`}>
                            <X className="w-5 h-5 mr-3 text-red-600" />
                            {exclusion}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {pkg.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${pkg.name} - Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                      data-testid={`gallery-image-${index}`}
                    />
                  )) || (
                    <div className="col-span-2 text-center py-8 text-muted">
                      No additional images available
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary" data-testid="text-package-price">
                      ₹{parseInt(pkg.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-muted">/person</span>
                  </div>
                  {pkg.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{parseInt(pkg.originalPrice).toLocaleString('en-IN')}
                    </div>
                  )}
                  <p className="text-green-600 text-sm font-medium mt-1">
                    Save ₹{(parseInt(pkg.originalPrice || 0) - parseInt(pkg.price)).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Travel Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        data-testid="input-travel-date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Travelers
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" data-testid="select-travelers">
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5+ People</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 mb-4"
                  data-testid="button-book-now"
                  onClick={() => {
                    localStorage.setItem(
                      "checkoutItem",
                      JSON.stringify({ type: "package", item: { id: pkg.id } })
                    );
                    window.location.href = "/checkout";
                  }}
                >
                  Book Now
                </Button>

                <div className="text-center text-sm text-muted mb-4">
                  <p>Free cancellation up to 48 hours</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-secondary mb-3">Quick Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Duration:</span>
                      <span>{pkg.duration} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Category:</span>
                      <span>{pkg.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Rating:</span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {pkg.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviewError && (
            <div className="mb-4 text-red-600 font-semibold">{reviewError}</div>
          )}
          {user ? (
            <ReviewForm onSubmit={reviewMutation.mutate} submitting={reviewMutation.isLoading} />
          ) : (
            <div className="mb-4">
              <Link href="/login">
                <Button className="bg-primary text-white">Login to write a review</Button>
              </Link>
            </div>
          )}
          <div className="mt-8">
            {reviewsLoading ? (
              <div>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div>No reviews yet.</div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                      <span className="ml-2 font-semibold">{review.user?.username || "User"}</span>
                      <span className="ml-4 text-muted text-sm">{new Date(review.created_at).toLocaleDateString()}</span>
                      {user && review.user?.id === user.id && (
                        <Button
                          variant="outline"
                          className="ml-4 text-red-600 border-red-600 hover:bg-red-50"
                          size="sm"
                          onClick={() => deleteReviewMutation.mutate(review.id)}
                          disabled={deleteReviewMutation.isLoading}
                        >
                          {deleteReviewMutation.isLoading ? "Deleting..." : "Delete"}
                        </Button>
                      )}
                    </div>
                    <div className="text-muted">{review.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
