import { 
  Wifi, Waves, Utensils, Dumbbell, Flower2, Bus, 
  Coffee, Tv, Snowflake, Car, Baby, Phone,
  Shield, ParkingCircle, Sunrise, Wine,
  UtensilsCrossed, Heart, Bell, User
} from 'lucide-react';const amenityIcons = {
    "Free WiFi": { icon: Wifi, color: "text-blue-500" },
  "Swimming Pool": { icon: Waves, color: "text-cyan-500" },
  "Restaurant": { icon: Utensils, color: "text-orange-500" },
  "Gym": { icon: Dumbbell, color: "text-purple-500" },
  "Spa": { icon: Flower2, color: "text-pink-500" },
    "Airport Shuttle": { icon: Bus, color: "text-green-500" },
    "Coffee Shop": { icon: Coffee, color: "text-brown-500" },
    "TV": { icon: Tv, color: "text-gray-500" },
    "Air Conditioning": { icon: Snowflake, color: "text-blue-400" },
    "Parking": { icon: ParkingCircle, color: "text-blue-600" },
    "Room Service": { icon: Bell, color: "text-yellow-600" },
    "Bar": { icon: Wine, color: "text-purple-600" },
    "Breakfast": { icon: Coffee, color: "text-orange-400" },
    "24/7 Front Desk": { icon: User, color: "text-indigo-500" },
    "Security": { icon: Shield, color: "text-green-600" },
    "Valet Parking": { icon: Car, color: "text-gray-600" },
    "Kids Club": { icon: Baby, color: "text-pink-400" },
    "Business Center": { icon: Phone, color: "text-blue-700" },
    "Sea View": { icon: Sunrise, color: "text-cyan-600" },
    "Fine Dining": { icon: UtensilsCrossed, color: "text-yellow-700" },
    "Wellness Center": { icon: Heart, color: "text-red-500" },
};

export default function AmenityIcon({ amenity, className = "", showLabel = true, size = "default", orientation = "horizontal" }) {
    const amenityInfo = amenityIcons[amenity.trim()] || { icon: Utensils, color: "text-gray-500" };
    const IconComponent = amenityInfo.icon;

    const sizeClasses = {
        small: "w-5 h-5",
        default: "w-6 h-6",
        large: "w-8 h-8"
    };

    const containerClass = orientation === 'vertical' ? `flex flex-col items-center text-center gap-3 ${className}` : `flex items-center gap-2 ${className}`;
    const labelClass = orientation === 'vertical' ? 'text-base font-semibold text-gray-800' : 'text-sm text-gray-700';

    return (
        <div className={containerClass} role="listitem" title={amenity}>
            <IconComponent className={`${sizeClasses[size]} ${amenityInfo.color}`} />
            {showLabel && <span className={labelClass}>{amenity}</span>}
        </div>
    );
}