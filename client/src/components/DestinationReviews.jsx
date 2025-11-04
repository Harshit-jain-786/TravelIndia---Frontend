import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, StarHalf } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have this hook

export default function DestinationReviews({ destinationId }) {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    // Fetch reviews
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["destinationReviews", destinationId],
        queryFn: async () => {
            const res = await fetch(`/api/destinations/${destinationId}/reviews/`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            return res.json();
        },
    });

    // Add review mutation
    const addReviewMutation = useMutation({
        mutationFn: async (newReview) => {
            const res = await fetch(`/api/destinations/${destinationId}/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newReview),
            });
            if (!res.ok) throw new Error("Failed to add review");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["destinationReviews", destinationId]);
            setReviewText("");
            setRating(5);
        },
    });

    // Delete review mutation
    const deleteReviewMutation = useMutation({
        mutationFn: async (reviewId) => {
            const res = await fetch(`/api/destinations/${destinationId}/reviews/${reviewId}/`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete review");
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["destinationReviews", destinationId]);
        },
    });

    const handleSubmitReview = (e) => {
        e.preventDefault();
        addReviewMutation.mutate({
            rating,
            text: reviewText,
        });
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
            } else if (i - 0.5 === rating) {
                stars.push(<StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
            } else {
                stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
            }
        }
        return stars;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reviews</h2>

            {/* Review Form */}
            {isAuthenticated && (
                <form onSubmit={handleSubmitReview} className="space-y-4 bg-white p-4 rounded-lg shadow">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-6 h-6 ${value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Your Review</label>
                        <Textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={addReviewMutation.isLoading}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {addReviewMutation.isLoading ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-gray-500">No reviews yet. Be the first to review!</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-4 rounded-lg shadow space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{review.user.username}</span>
                                    <span className="text-gray-500 text-sm">
                                        {format(new Date(review.created_at), "MMM d, yyyy")}
                                    </span>
                                </div>
                                {user?.id === review.user.id && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteReviewMutation.mutate(review.id)}
                                        disabled={deleteReviewMutation.isLoading}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                            <p className="text-gray-700">{review.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}