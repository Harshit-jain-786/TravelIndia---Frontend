import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, Users, Search, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";

function Flights() {
  const [displayLimit, setDisplayLimit] = useState(20);
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
    passengers: "1",
    class: "economy",
    tripType: "round-trip"
  });
    function formatCreativeDate(dateString) {
      if (!dateString) return "";
      const d = new Date(dateString);
      const day = d.getDate();
      const month = d.toLocaleString('default', { month: 'short' });
      const weekday = d.toLocaleString('default', { weekday: 'short' });
      return `${weekday}, ${day} ${month}`;
    }
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { data: flightData, isLoading } = useQuery({
    queryKey: ["/api/flights", searchData],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (searchData.from) searchParams.append('from_city', searchData.from);
      if (searchData.to) searchParams.append('to_city', searchData.to);
      if (searchData.departure) searchParams.append('departure_date', searchData.departure);
      if (searchData.class) searchParams.append('flight_class', searchData.class);
      
      const queryString = searchParams.toString();
      const url = `/api/flights/${queryString ? `?${queryString}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch flights');
      return res.json();
    },
  });

  // Flatten flights for search if needed
  const allFlights = flightData ? flightData.flatMap(dateGroup => dateGroup.flights) : [];
  // get today's date in local YYYY-MM-DD format
  function getTodayDateString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  const todayString = getTodayDateString();
  const todaysFlights = allFlights.filter(f => f && f.departure && f.departure.slice(0, 10) === todayString);
  // Show today's flights by default; when searched, show filtered results
  const flightsToShow = hasSearched ? filteredFlights : todaysFlights;
  function handleInputChange(field, value) {
    setSearchData(prev => ({ ...prev, [field]: value }));
  }

  function handleSearch(e) {
    e.preventDefault();
    const flightsList = allFlights || [];
    // If all fields are empty, show all flights
    const allEmpty = Object.values(searchData).every(
      v => !v || v === "1" || v === "economy" || v === "round-trip"
    );
    if (allEmpty) {
      setFilteredFlights(flightsList);
      setHasSearched(true);
      return;
    }
    // Otherwise, filter by AND logic for filled fields
    const results = flightsList.filter(flight => {
      let match = true;
      if (searchData.from && (!flight.from_location || !flight.from_location.toLowerCase().includes(searchData.from.toLowerCase()))) match = false;
      if (searchData.to && (!flight.to_location || !flight.to_location.toLowerCase().includes(searchData.to.toLowerCase()))) match = false;
      if (searchData.departure && (!flight.departure || flight.departure.slice(0, 10) !== searchData.departure)) match = false;
      if (searchData.class && (!flight.flight_class || flight.flight_class.toLowerCase() !== searchData.class)) match = false;
      if (searchData.tripType && (!flight.trip_type || flight.trip_type !== searchData.tripType)) match = false;
      if (searchData.passengers && (!flight.passengers || flight.passengers < parseInt(searchData.passengers))) match = false;
      return match;
    });
    setFilteredFlights(results);
    setHasSearched(true);
  }

  return (
    <div className="min-h-screen mt-5 bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">
            Flight Booking
          </h1>
          <p className="text-xl text-gray-600">
            Find and book the best flight deals for your journey
          </p>
        </div>

  {/* Flight Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch}>
                {/* Trip Type Selection */}
                <div className="flex gap-4 mb-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tripType"
                      value="round-trip"
                      checked={searchData.tripType === "round-trip"}
                      onChange={(e) => handleInputChange("tripType", e.target.value)}
                      className="mr-2"
                      data-testid="radio-round-trip"
                    />
                    Round Trip
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tripType"
                      value="one-way"
                      checked={searchData.tripType === "one-way"}
                      onChange={(e) => handleInputChange("tripType", e.target.value)}
                      className="mr-2"
                      data-testid="radio-one-way"
                    />
                    One Way
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="from"
                        type="text"
                        placeholder="Departure city"
                        className="pl-10"
                        value={searchData.from}
                        onChange={(e) => handleInputChange("from", e.target.value)}
                        data-testid="input-from"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="to"
                        type="text"
                        placeholder="Destination city"
                        className="pl-10"
                        value={searchData.to}
                        onChange={(e) => handleInputChange("to", e.target.value)}
                        data-testid="input-to"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departure">Departure</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="departure"
                        type="date"
                        className="pl-10"
                        value={searchData.departure}
                        onChange={(e) => handleInputChange("departure", e.target.value)}
                        data-testid="input-departure"
                      />
                    </div>
                  </div>
                  {searchData.tripType === "round-trip" && (
                    <div className="space-y-2">
                      <Label htmlFor="return">Return</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="return"
                          type="date"
                          className="pl-10"
                          value={searchData.return}
                          onChange={(e) => handleInputChange("return", e.target.value)}
                          data-testid="input-return"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Passengers</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
                      <Select value={searchData.passengers} onValueChange={(value) => handleInputChange("passengers", value)}>
                        <SelectTrigger className="pl-10" data-testid="select-passengers">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Passenger</SelectItem>
                          <SelectItem value="2">2 Passengers</SelectItem>
                          <SelectItem value="3">3 Passengers</SelectItem>
                          <SelectItem value="4">4 Passengers</SelectItem>
                          <SelectItem value="5">5+ Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select value={searchData.class} onValueChange={(value) => handleInputChange("class", value)}>
                      <SelectTrigger data-testid="select-class">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-orange-600 py-3 text-lg font-semibold"
                  data-testid="button-search-flights"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Flights
                </Button>
              </form>
            </CardContent>
          </Card>
  {/* ...existing code... */}

        {/* Flight Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="available-flights-title">
            Available Flights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 w-32"></div>
                        <div className="h-3 bg-gray-200 w-20"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : flightsToShow.length === 0 ? (
              <div className="text-center text-muted py-8">No flights found for your search.</div>
            ) : (
              flightsToShow.slice(0, displayLimit).map((flight) => (
                <Link href={`/flights/${flight.id}`} key={flight.id}>
                  <div className="shrink-0 overflow-hidden rounded-xl flex flex-col border border-neutral-100 !rounded-2xl w-[280px] bg-white shadow-lg transition-all duration-200 cursor-pointer" style={{ scrollSnapAlign: 'center' }}>
                    <div className="px-4 py-3">
                      <div className="flex items-center">
                        <p className="truncate font-bold text-lg">{flight.from_location}</p>
                        <span className="mx-2 text-gray-400">→</span>
                        <p className="truncate font-bold text-lg">{flight.to_location}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p className="text-sm text-secondary mt-1 font-normal bg-primary/10 px-3 py-1 rounded-full inline-block font-semibold tracking-wide">
                            {formatCreativeDate(flight.departure)}
                          </p>
                          <div className="flex items-center gap-2 text-primary font-bold text-base mt-1">
                            <span>₹{parseInt(flight.price).toLocaleString('en-IN')}</span>
                            <span className="text-xs font-normal">onwards</span>
                          </div>
                        </div>
                        <Button className="inline-flex justify-center items-center text-brand-outline hover:bg-brand-outline-over border-brand-outline border gap-1 rounded-lg min-h-10 px-4 py-2 text-sm font-semibold" variant="outline">
                          Book Flight
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          {flightsToShow.length > displayLimit && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setDisplayLimit(prev => prev + 20)}
                className="bg-primary hover:bg-orange-600 text-white px-6 py-2"
              >
                View More Flights ({flightsToShow.length - displayLimit} remaining)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Flights;
