import React, { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewForm({ onSubmit, submitting }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && text.trim()) {
      onSubmit({ rating, text });
      setRating(0);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 mr-1 ${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          </button>
        ))}
        <span className="ml-2 text-muted">{rating > 0 ? `${rating} Star${rating > 1 ? "s" : ""}` : "Select rating"}</span>
      </div>
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary"
        rows={3}
        placeholder="Write your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
