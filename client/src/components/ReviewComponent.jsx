import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function ReviewComponent({ destinationId, reviews = [], onSuccess }) {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const { user, isAuthenticated, accessToken } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const addReviewMutation = useMutation({
        mutationFn: async (newReview) => {
            console.log('Submitting review with token:', accessToken);
            const res = await fetch(`/api/destinations/${destinationId}/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(newReview),
                credentials: 'include',
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                console.error('Review submission response:', data);
                throw new Error(data.detail || data.error || "Failed to submit review");
            }
            
            return data;
        },
        onSuccess: (data) => {
            console.log('Review submitted successfully:', data);
            queryClient.invalidateQueries(["destination", destinationId]);
            setReviewText("");
            setRating(5);
            if (onSuccess) onSuccess(data);
        },
        onError: (error) => {
            console.error('Review submission error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to submit review. Please try again.",
                variant: "destructive",
            });
        }
    });

    const deleteReviewMutation = useMutation({
        mutationFn: async (reviewId) => {
            const res = await fetch(`/api/destinations/${destinationId}/reviews/${reviewId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
                credentials: 'include',
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Failed to delete review");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["destination", destinationId]);
        },
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      console.error('No access token available');
      toast({
        title: "Authentication Error",
        description: "Please log in again to submit your review.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addReviewMutation.mutateAsync({
        rating,
        text: reviewText,
      });
      toast({
        title: "Success",
        description: "Your review has been submitted!",
      });
    } catch (error) {
      console.error('Review submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };    const renderStars = (value) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Review Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-4 bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow">
                    <div className="space-y-2">
                        <label className="block font-medium text-gray-700">Your Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    className={`p-1 rounded-full transition-transform hover:scale-110 ${rating >= value ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                >
                                    <Star className={`w-8 h-8 ${rating >= value ? "fill-yellow-400" : ""}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-medium text-gray-700">Your Review</label>
                        <Textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            placeholder="Share your experience..."
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                        disabled={addReviewMutation.isLoading}
                    >
                        {addReviewMutation.isLoading ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            ) : (
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow text-center">
                    <p className="text-gray-600 mb-4">Please log in to write a review</p>
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-900">{review.user.username}</span>
                                <span className="text-gray-500 text-sm">
                                    {format(new Date(review.created_at), "MMM d, yyyy")}
                                </span>
                            </div>
                            {user?.id === review.user.id && (
                                <Button
                                    onClick={() => deleteReviewMutation.mutate(review.id)}
                                    disabled={deleteReviewMutation.isLoading}
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    Delete
                                </Button>
                            )}
                        </div>

                        {renderStars(review.rating)}

                        <p className="text-gray-700 mt-2">{review.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}