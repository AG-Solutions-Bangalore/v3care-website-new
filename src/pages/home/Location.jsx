import React, { useState, useEffect } from "react";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY 

  const getCityFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
      );
      const data = await response.json();
      console.log("📍 Google reverse geocode data:", data);

      if (data.status === "OK") {
        const cityComponent = data.results[0].address_components.find((comp) =>
          comp.types.includes("locality")
        );

        const cityName = cityComponent
          ? cityComponent.long_name
          : "Unknown City";
        setCity(cityName);
      } else {
        setCity("Unknown");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setCity("Unknown");
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("📍 Browser location object:", position);
        setLocation(position);
        setError(null);
        setIsLoading(false);

        const { latitude, longitude } = position.coords;
        getCityFromCoords(latitude, longitude); 
      },
      (err) => {
        console.error("❌ Location error:", err);
        setError("Failed to fetch location.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Location & City</h1>

      {isLoading && (
        <div className="p-3 mb-4 bg-blue-100 text-blue-700 rounded-md">
          Requesting location access...
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {location && (
        <div className="space-y-4">
          <pre className="p-4 bg-gray-100 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(location, null, 2)}
          </pre>

          {city && (
            <p className="text-lg font-semibold">
              🏙️ You are in: <span className="text-blue-600">{city}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Location;
