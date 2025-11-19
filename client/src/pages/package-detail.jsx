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
import { get } from "@/lib/api";

export default function PackageDetail() {
  const [match, params] = useRoute("/packages/:id");
  const packageId = params?.id;

  const queryClient = useQueryClient();

  // =============================================================
  // FETCH PACKAGE DETAILS
  // =============================================================
  const {
    data: pkg,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["package", packageId],
    queryFn: () => get(`/api/packages/${packageId}/`),
    enabled: !!packageId,
  });

  // =============================================================
  // FETCH REVIEWS FOR THIS PACKAGE
  // =============================================================
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
  } = useQuery({
    queryKey: ["package-reviews", packageId],
    queryFn: () => get(`/api/packages/${packageId}/reviews/`),
    enabled: !!packageId,
  });

  // Get current logged-in user
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [reviewError, setReviewError] = useState("");

  // =============================================================
  // SUBMIT REVIEW
  // =============================================================
  const reviewMutation = useMutation({
    mutationFn: async (review) => {
      setReviewError("");
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setReviewError("You must be logged in to submit a review.");
        throw new Error("Unauthorized");
      }

      const res = await fetch(`/api/packages/${packageId}/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      queryClient.invalidateQueries(["package-reviews", packageId]);
    },
  });

  // =============================================================
  // DELETE REVIEW
  // =============================================================
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/packages/reviews/${reviewId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete review");

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["package-reviews", packageId]);
    },
  });

  // =============================================================
  // LOADING STATE
  // =============================================================
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="w-full h-96 bg-gray-300 rounded-xl"></div>
            <div className="h-10 bg-gray-300 w-1/2"></div>
            <div className="h-6 bg-gray-300 w-1/3"></div>
            <div className="h-32 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================
  // NOT FOUND OR ERROR STATE
  // =============================================================
  if (error || !pkg) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Package Not Found</h1>
          <p className="text-muted mb-8">
            The package you’re looking for doesn’t exist.
          </p>
          <Link href="/packages">
            <Button className="bg-primary">Browse All Packages</Button>
          </Link>
        </div>
      </div>
    );
  }

  // =============================================================
  // MAIN PAGE CONTENT
  // =============================================================
  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Hero Image */}
        <div className="relative mb-10">
          <img
            src={pkg.photo}
            alt={pkg.name}
            className="w-full h-96 object-cover rounded-2xl"
          />

          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-white px-4 py-2">
              {pkg.duration} Days / {pkg.duration - 1} Nights
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2">

            <h1 className="text-4xl font-bold text-secondary mb-2">
              {pkg.name}
            </h1>

            <p className="text-lg text-muted mb-6">{pkg.shortDescription}</p>

            <div className="flex items-center gap-6 text-muted mb-8">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {pkg.duration} Days
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {pkg.category}
              </div>
            </div>

            {/* TABS */}
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Package Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted">{pkg.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Itinerary */}
              <TabsContent value="itinerary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Day-wise Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pkg.itinerary?.map((day, index) => (
                      <div key={index} className="mb-6">
                        <div className="flex items-center">
                          <div className="bg-primary text-white px-3 py-2 rounded-full mr-3">
                            Day {day.day}
                          </div>
                          <h3 className="font-semibold">{day.title}</h3>
                        </div>

                        <ul className="ml-12 mt-3 space-y-2">
                          {day.activities?.map((activity, i) => (
                            <li key={i} className="flex items-center text-muted">
                              <Clock className="w-4 h-4 mr-2 text-primary" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inclusions */}
              <TabsContent value="inclusions" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">

                  {/* Included */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Inclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {(Array.isArray(pkg.inclusions)
                          ? pkg.inclusions
                          : pkg.inclusions.split(",")
                        ).map((item, idx) => (
                          <li key={idx} className="flex items-center text-muted">
                            <Check className="w-5 h-5 mr-3 text-green-600" />
                            {item.trim()}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Excluded */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Exclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {pkg.exclusions?.map((item, idx) => (
                          <li key={idx} className="flex items-center text-muted">
                            <X className="w-5 h-5 mr-3 text-red-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                </div>
              </TabsContent>

              {/* Gallery */}
              <TabsContent value="gallery" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {pkg.images?.length ? (
                    pkg.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-muted py-8">
                      No additional images available
                    </div>
                  )}
                </div>
              </TabsContent>

            </Tabs>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary">
                    ₹{parseInt(pkg.price).toLocaleString("en-IN")}
                  </div>
                  {pkg.originalPrice && (
                    <div className="line-through text-gray-500 mt-1">
                      ₹{parseInt(pkg.originalPrice).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-primary text-white py-3"
                  onClick={() => {
                    localStorage.setItem(
                      "checkoutItem",
                      JSON.stringify({
                        type: "package",
                        item: { id: pkg.id },
                      })
                    );
                    window.location.href = "/checkout";
                  }}
                >
                  Book Now
                </Button>

                <div className="border-t mt-6 pt-4">
                  <h3 className="font-semibold text-secondary mb-3">
                    Quick Details
                  </h3>

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
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {pkg.rating}
                      </span>
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>
          </div>

        </div>

        {/* REVIEW SECTION */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>

          {reviewError && (
            <div className="text-red-600 font-medium mb-4">{reviewError}</div>
          )}

          {user ? (
            <ReviewForm
              onSubmit={reviewMutation.mutate}
              submitting={reviewMutation.isLoading}
            />
          ) : (
            <div className="mb-4">
              <Link href="/login">
                <Button className="bg-primary text-white">
                  Login to write a review
                </Button>
              </Link>
            </div>
          )}

          {/* Review List */}
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
                      <span className="ml-2 font-semibold">
                        {review.user?.username || "User"}
                      </span>

                      <span className="ml-4 text-muted text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>

                      {user && review.user?.id === user.id && (
                        <Button
                          variant="outline"
                          className="ml-4 text-red-600 border-red-600 hover:bg-red-50"
                          size="sm"
                          onClick={() => deleteReviewMutation.mutate(review.id)}
                        >
                          Delete
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
