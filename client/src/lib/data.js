// Static data for the travel website

export const destinations = [
  {
    id: "kerala",
    name: "Kerala",
    description: "God's Own Country",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    highlights: ["Backwaters", "Houseboat Cruises", "Spice Gardens", "Ayurvedic Treatments"],
    basePrice: 8999,
    isActive: true,
  },
  {
    id: "ladakh",
    name: "Ladakh",
    description: "Land of High Passes",
    state: "Jammu & Kashmir",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    highlights: ["Mountain Views", "Buddhist Monasteries", "Adventure Sports", "Pristine Lakes"],
    basePrice: 15999,
    isActive: true,
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    description: "Land of Kings",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    highlights: ["Desert Safari", "Royal Palaces", "Camel Rides", "Cultural Shows"],
    basePrice: 12999,
    isActive: true,
  },
  {
    id: "goa",
    name: "Goa",
    description: "Beach Paradise",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    highlights: ["Pristine Beaches", "Water Sports", "Portuguese Heritage", "Vibrant Nightlife"],
    basePrice: 6999,
    isActive: true,
  },
];

export const packageCategories = [
  { id: "adventure", name: "Adventure", icon: "mountain" },
  { id: "cultural", name: "Cultural", icon: "temple" },
  { id: "beach", name: "Beach", icon: "waves" },
  { id: "hill-stations", name: "Hill Stations", icon: "mountain" },
  { id: "wildlife", name: "Wildlife", icon: "bird" },
  { id: "spiritual", name: "Spiritual", icon: "om" },
];

export const popularCities = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
];

export const airlines = [
  { code: "6E", name: "IndiGo" },
  { code: "AI", name: "Air India" },
  { code: "SG", name: "SpiceJet" },
  { code: "UK", name: "Vistara" },
  { code: "G8", name: "GoAir" },
];

export const hotelAmenities = [
  { id: "wifi", name: "Free WiFi", icon: "wifi" },
  { id: "pool", name: "Swimming Pool", icon: "waves" },
  { id: "restaurant", name: "Restaurant", icon: "utensils" },
  { id: "gym", name: "Fitness Center", icon: "dumbbell" },
  { id: "spa", name: "Spa & Wellness", icon: "sparkles" },
  { id: "parking", name: "Free Parking", icon: "car" },
  { id: "ac", name: "Air Conditioning", icon: "snowflake" },
  { id: "room-service", name: "Room Service", icon: "bell" },
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Amazing trip to Kerala! The houseboat experience was unforgettable. TravelIndia made everything seamless.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    comment: "The Rajasthan package exceeded all expectations. Professional service and authentic experiences.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Ahmedabad",
    rating: 4,
    comment: "Great value for money! The Ladakh trip was well-organized and the guides were knowledgeable.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  },
];

export const travelTips = [
  {
    id: 1,
    title: "Best Time to Visit India",
    description: "October to March is generally the best time to visit most parts of India due to pleasant weather.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
  },
  {
    id: 2,
    title: "Essential Items to Pack",
    description: "Comfortable walking shoes, sunscreen, insect repellent, and appropriate clothing for different climates.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
  },
  {
    id: 3,
    title: "Cultural Etiquette",
    description: "Respect local customs, dress modestly when visiting religious sites, and always ask before photographing people.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400",
  },
];

export const blogPosts = [
  {
    id: 1,
    title: "Top 10 Hidden Gems in South India",
    excerpt: "Discover the lesser-known beautiful destinations in South India that offer unique experiences away from the crowds.",
    author: "Travel Team",
    publishedDate: "2024-01-15",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400",
    category: "Destinations",
  },
  {
    id: 2,
    title: "A Foodie's Guide to North Indian Cuisine",
    excerpt: "Explore the rich and diverse culinary landscape of North India with our comprehensive food guide.",
    author: "Culinary Expert",
    publishedDate: "2024-01-10",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    category: "Food & Culture",
  },
  {
    id: 3,
    title: "Adventure Activities in the Himalayas",
    excerpt: "From trekking to river rafting, discover the best adventure activities in the majestic Himalayas.",
    author: "Adventure Guide",
    publishedDate: "2024-01-05",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400",
    category: "Adventure",
  },
];

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-IN', { ...defaultOptions, ...options });
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};
