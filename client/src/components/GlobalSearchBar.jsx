
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

import { useNavigate } from "react-router-dom";

export default function GlobalSearchBar({ onResults }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const { data, isLoading } = useQuery({
        queryKey: ["/api/search", { q: searchTerm }],
        enabled: !!searchTerm,
        queryFn: async () => {
            const res = await fetch(`/api/search/?q=${encodeURIComponent(searchTerm)}`);
            if (!res.ok) throw new Error("Search failed");
            return res.json();
        },
    });

    useEffect(() => {
        if (data && searchTerm) setShowDropdown(true);
    }, [data, searchTerm]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(query);
        if (onResults && data) onResults(data);
        setShowDropdown(true);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto my-4">
            <form onSubmit={handleSubmit} className="flex items-center">
                <Input
                    type="text"
                    placeholder="Search hotels, packages, destinations, flights..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-1 mr-2"
                    onFocus={() => data && setShowDropdown(true)}
                />
                <Button type="submit" className="bg-primary text-white">Search</Button>
            </form>
            {showDropdown && data && (
                <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl z-[100] max-h-96 overflow-y-auto"
                    style={{ minWidth: '100%', top: '100%' }}
                >
                    {isLoading && <div className="p-4 text-center text-muted">Searching...</div>}
                    {!isLoading &&
                        (Object.values(data).every(arr => arr.length === 0) ? (
                            <div className="p-4 text-center text-muted">No results found.</div>
                        ) : (
                            <>
                                {data.hotels?.length > 0 && (
                                    <div className="p-2">
                                        <div className="font-semibold text-primary mb-1">Hotels</div>
                                        {data.hotels.map(hotel => (
                                            <div
                                                key={hotel.id}
                                                className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                                                onClick={() => navigate(`/hotels/${hotel.id}`)}
                                            >
                                                {hotel.photo && <img src={hotel.photo} alt={hotel.name} className="w-8 h-8 rounded mr-2 object-cover" />}
                                                <span>{hotel.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {data.packages?.length > 0 && (
                                    <div className="p-2">
                                        <div className="font-semibold text-primary mb-1">Packages</div>
                                        {data.packages.map(pkg => (
                                            <div
                                                key={pkg.id}
                                                className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                                                onClick={() => navigate(`/packages/${pkg.id}`)}
                                            >
                                                {pkg.photo && <img src={pkg.photo} alt={pkg.name} className="w-8 h-8 rounded mr-2 object-cover" />}
                                                <span>{pkg.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {data.destinations?.length > 0 && (
                                    <div className="p-2">
                                        <div className="font-semibold text-primary mb-1">Destinations</div>
                                        {data.destinations.map(dest => (
                                            <div
                                                key={dest.id}
                                                className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                                                onClick={() => navigate(`/destinations/${dest.id}`)}
                                            >
                                                {dest.image && <img src={dest.image} alt={dest.name} className="w-8 h-8 rounded mr-2 object-cover" />}
                                                <span>{dest.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {data.flights?.length > 0 && (
                                    <div className="p-2">
                                        <div className="font-semibold text-primary mb-1">Flights</div>
                                        {data.flights.map(flight => (
                                            <div
                                                key={flight.id}
                                                className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                                                onClick={() => navigate(`/flights/${flight.id}`)}
                                            >
                                                <span>{flight.from_location} → {flight.to_location} ({flight.airline})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ))}
                </div>
            )}
        </div>
    );
}
