import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function PackageCard({ pkg }) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {pkg.photo && (
          <img
            src={pkg.photo}
            alt={pkg.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="default" className="bg-primary/90 text-white backdrop-blur-sm">
            {pkg.category}
          </Badge>
          <Badge variant="default" className="bg-black/70 text-white backdrop-blur-sm">
            {pkg.duration} Days
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-secondary mb-2 line-clamp-1">
          {pkg.name}
        </h3>
        
        <div className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {pkg.description}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-primary">
              ₹{parseInt(pkg.price).toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-muted-foreground">per person</div>
          </div>
          
          <div className="flex items-center text-orange-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="ml-1 font-semibold">
              {pkg.rating || "4.5"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/packages/${pkg.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              View Details
            </Button>
          </Link>
          <Link href="/checkout" className="flex-1" state={{ type: 'package', item: pkg }}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}