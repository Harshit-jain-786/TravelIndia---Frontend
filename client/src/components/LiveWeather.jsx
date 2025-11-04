import { useEffect, useState } from "react";

const OPENWEATHER_API_KEY = "513cb6d564ab596a67e31ca1c7393c6e";

export default function LiveWeather({ location, coords }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        let url = "";
        if (coords && coords.length === 2) {
            url = `http://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        } else if (location) {
            url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        } else {
            setError("No location provided");
            setLoading(false);
            return;
        }
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(res.status === 401 ? "Invalid API key or exceeded quota." : "Weather not found");
                return res.json();
            })
            .then((data) => {
                setWeather(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Unable to fetch weather");
                setLoading(false);
            });
    }, [location, coords]);

    if (loading) return <div className="text-gray-500">Loading weather...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!weather) return null;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-lg font-bold text-[#ff5c2f]">{weather.name || location}</div>
            <div className="flex items-center gap-2">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-12 h-12"
                />
                <div className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</div>
            </div>
            <div className="text-sm text-gray-700 capitalize">{weather.weather[0].description}</div>
            <div className="text-xs text-gray-500">Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s</div>
        </div>
    );
}
