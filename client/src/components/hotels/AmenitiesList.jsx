import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AmenityIcon from './AmenityIcon';

export default function AmenitiesList({ amenities, className = "", displayCount = 4, variant = "grid", showFull = false }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse amenities string if needed
  const amenitiesList = Array.isArray(amenities) 
    ? amenities 
    : typeof amenities === 'string'
    ? amenities.split(',').map(a => a.trim())
    : [];

  if (variant === "grid") {
    // If showFull is true, render the entire amenities grid (used inside Quick View modal)
    if (showFull) {
      return (
        <div className={className}>
            <ScrollArea className="h-[460px] pr-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {amenitiesList.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow gap-3 min-h-[96px]">
                    <AmenityIcon amenity={amenity} className="gap-3" size="large" orientation="vertical" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
      );
    }

    return (
      <div className={className}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenitiesList.slice(0, displayCount).map((amenity, index) => (
            <div key={index} className="flex flex-col items-center text-center p-3 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow gap-3 min-h-[84px]">
              <AmenityIcon amenity={amenity} className="gap-3" size="large" orientation="vertical" />
            </div>
          ))}
        </div>
        {amenitiesList.length > displayCount && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="mt-2 text-primary hover:text-primary/80">
                +{amenitiesList.length - displayCount} more amenities
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>All Amenities</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {amenitiesList.map((amenity, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow gap-3 min-h-[96px]">
                      <AmenityIcon amenity={amenity} className="gap-3" size="large" orientation="vertical" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {amenitiesList.slice(0, displayCount).map((amenity, index) => (
        <div key={index} className="inline-flex items-center px-2 py-1 rounded-full bg-gray-50 text-gray-800">
          <AmenityIcon amenity={amenity} size="small" className="gap-1" />
        </div>
      ))}
      {amenitiesList.length > displayCount && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-7 px-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              +{amenitiesList.length - displayCount}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>All Amenities</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-4">
                {amenitiesList.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50 gap-2">
                    <AmenityIcon amenity={amenity} className="gap-2" size="large" orientation="vertical" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}