import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet"
import L from "leaflet"
import { MapPin, Navigation, Clock, Mountain } from "lucide-react"
import "leaflet/dist/leaflet.css"

// --- Custom Guild Hall Marker Icon ---
const guildIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `<div class="relative w-12 h-12 flex items-center justify-center">
           <div class="absolute inset-0 bg-amber-500/30 rounded-full animate-ping"></div>
           <div class="relative z-10 w-10 h-10 bg-amber-900 border-2 border-amber-400 rounded-full flex items-center justify-center shadow-[0_0_20px_#fbbf24]">
             <div class="text-amber-200 text-lg">🏰</div>
           </div>
         </div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

const adventurerIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `<div class="w-6 h-6 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_15px_#60a5fa] animate-pulse relative">
           <div class="absolute inset-0 flex items-center justify-center text-xs">⚔️</div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

// IIIT Sri City Coordinates  
const GUILD_HALL_POS = [13.5559, 80.0268]

// --- Helper Component to Handle Map Logic ---
function MapController({ userPos, onLocate }) {
  const map = useMap()

  useEffect(() => {
    if (userPos) {
      const bounds = L.latLngBounds([userPos, GUILD_HALL_POS])
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [userPos, map])

  // Click map to set manual location
  useEffect(() => {
    map.on("click", (e) => {
        onLocate([e.latlng.lat, e.latlng.lng])
    })
    return () => map.off("click")
  }, [map, onLocate])

  return null
}

// Calculate distance and travel time
function calculateJourney(pos1, pos2) {
  if (!pos1 || !pos2) return null
  
  const R = 6371 // Earth's radius in km
  const dLat = (pos2[0] - pos1[0]) * Math.PI / 180
  const dLon = (pos2[1] - pos1[1]) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  
  return {
    distance: Math.round(distance),
    dragonTime: Math.round(distance / 80), // Dragons fly at 80 km/h
    horseTime: Math.round(distance / 8), // Horses travel at 8 km/h
    walkTime: Math.round(distance / 4) // Walking at 4 km/h
  }
}

export default function GuildMap() {
  const [userPos, setUserPos] = useState(null)
  const [locating, setLocating] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [locationAccuracy, setLocationAccuracy] = useState(null)
  
  const journey = calculateJourney(userPos, GUILD_HALL_POS)

  // Major cities with coordinates
  const majorCities = [
    { name: "Select your realm...", coords: null },
    { name: "Delhi", coords: [28.6139, 77.2090] },
    { name: "Mumbai", coords: [19.0760, 72.8777] },
    { name: "Bangalore", coords: [12.9716, 77.5946] },
    { name: "Chennai", coords: [13.0827, 80.2707] },
    { name: "Hyderabad", coords: [17.3850, 78.4867] },
    { name: "Kolkata", coords: [22.5726, 88.3639] },
    { name: "Pune", coords: [18.5204, 73.8567] },
    { name: "Ahmedabad", coords: [23.0225, 72.5714] }
  ]

  // Custom journey line style
  const journeyOptions = { 
    color: '#1e40af', 
    weight: 4, 
    dashArray: '15, 10', 
    opacity: 0.9 
  }

  const handleLocateMe = () => {
    setLocating(true)
    
    console.log("🔍 Starting location detection...")
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please select a city or click on the map.")
      setLocating(false)
      return
    }

    // Try high accuracy first
    const highAccuracyOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
    
    console.log("📍 Requesting high accuracy location...")
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        console.log(`✅ Location detected: ${latitude}, ${longitude} (±${accuracy}m)`)
        setUserPos([latitude, longitude])
        setLocationAccuracy(Math.round(accuracy))
        setLocating(false)
        setSelectedCity("")
      },
      (error) => {
        console.error("❌ High accuracy failed:", error.message, "Code:", error.code)
        
        // If high accuracy fails, try with low accuracy as fallback
        if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
          console.log("⚡ Trying low accuracy fallback...")
          
          const lowAccuracyOptions = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000 // Accept 1 minute old position
          }
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude, accuracy } = position.coords
              console.log(`✅ Location detected (low accuracy): ${latitude}, ${longitude} (±${accuracy}m)`)
              setUserPos([latitude, longitude])
              setLocationAccuracy(Math.round(accuracy))
              setLocating(false)
              setSelectedCity("")
            },
            (fallbackError) => {
              console.error("❌ Low accuracy also failed:", fallbackError.message)
              showError(fallbackError)
            },
            lowAccuracyOptions
          )
        } else {
          showError(error)
        }
      },
      highAccuracyOptions
    )
  }
  
  const showError = (error) => {
    let errorMessage = "Could not detect your location. "
    switch(error.code) {
      case 1: // PERMISSION_DENIED
        errorMessage += "Location permission denied. Please:\n1. Click the lock icon in your browser's address bar\n2. Allow location access\n3. Refresh the page and try again."
        break
      case 2: // POSITION_UNAVAILABLE
        errorMessage += "Location information unavailable. Please:\n1. Enable location services on your device\n2. Try selecting a city from the dropdown\n3. Or click anywhere on the map to set your location."
        break
      case 3: // TIMEOUT
        errorMessage += "Location request timed out. Please:\n1. Check your internet connection\n2. Try again or select a city from the dropdown."
        break
      default:
        errorMessage += "Please select a city or click on the map."
    }
    alert(errorMessage)
    setLocating(false)
    console.error("Geolocation error details:", {
      code: error.code,
      message: error.message
    })
  }

  const handleCitySelect = (cityName) => {
    const city = majorCities.find(c => c.name === cityName)
    if (city && city.coords) {
      setUserPos(city.coords)
      setSelectedCity(cityName)
      setLocationAccuracy(null) // Clear accuracy for city selection
    }
  }

  return (
    <div className="space-y-6">
      {/* Help Text */}
      <div className="bg-amber-950/20 border border-amber-600/20 rounded-lg p-3 text-xs text-amber-200/80">
        <strong>💡 Location Detection:</strong> Click "Detect My Realm" to get your exact location. 
        {locating && (
          <span className="block mt-1 text-yellow-300 animate-pulse">
            🔍 Detecting... This may take a few seconds.
          </span>
        )}
        <span className="block mt-1 opacity-75">
          Make sure location services are enabled in your browser settings.
        </span>
      </div>
      
      {/* Journey Planning Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Location Input */}
        <div className="space-y-3">
          <label className="block text-amber-200 font-semibold text-sm">FROM WHICH REALM DO YOU TRAVEL?</label>
          <select
            value={selectedCity}
            onChange={(e) => handleCitySelect(e.target.value)}
            className="w-full px-4 py-3 bg-stone-800 border border-amber-600/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
          >
            {majorCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Auto-locate button */}
        <div className="space-y-3">
          <label className="block text-amber-200 font-semibold text-sm">OR DETECT CURRENT POSITION</label>
          <button 
            onClick={handleLocateMe}
            disabled={locating}
            className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {locating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Detect My Realm
              </>
            )}
          </button>
          
          {/* Location Accuracy Indicator */}
          {locationAccuracy && (
            <div className="mt-2 text-xs text-center">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                locationAccuracy < 100 ? 'bg-green-900/30 text-green-300' :
                locationAccuracy < 500 ? 'bg-yellow-900/30 text-yellow-300' :
                'bg-orange-900/30 text-orange-300'
              }`}>
                <MapPin className="w-3 h-3" />
                Accuracy: ±{locationAccuracy}m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Journey Information */}
      {journey && (
        <div className="bg-stone-900/50 border border-amber-600/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mountain className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-200">Journey Details</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{journey.distance}</div>
              <div className="text-xs text-amber-300">Leagues</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{journey.dragonTime}h</div>
              <div className="text-xs text-amber-300">By Dragon</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{journey.horseTime}h</div>
              <div className="text-xs text-amber-300">By Horse</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{journey.walkTime}h</div>
              <div className="text-xs text-amber-300">On Foot</div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full h-125 rounded-xl overflow-hidden border border-amber-600/20 shadow-2xl">
        <MapContainer 
          center={GUILD_HALL_POS} 
          zoom={14} 
          scrollWheelZoom={true} 
          className="w-full h-full"
          style={{ backgroundColor: '#e5e7eb' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Guild Hall Marker */}
          <Marker position={GUILD_HALL_POS} icon={guildIcon}>
            <Popup className="guild-popup">
              <div className="text-center p-2">
                <div className="font-bold text-lg text-amber-800">⚔️ The Guild Hall ⚔️</div>
                <div className="text-amber-700 font-semibold">ABHISARGA'26</div>
                <div className="text-sm text-stone-600">IIIT Sri City</div>
                <div className="text-xs text-stone-500 mt-1">
                  13.5559°N, 80.0268°E
                </div>
              </div>
            </Popup>
          </Marker>

          {/* User Position Marker */}
          {userPos && (
            <>
              <Marker position={userPos} icon={adventurerIcon}>
                <Popup>
                  <div className="text-center p-2">
                    <div className="font-bold text-blue-800">🗡️ Your Position 🛡️</div>
                    <div className="text-sm text-stone-600">
                      {selectedCity || "Current Location"}
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Journey Path */}
              <Polyline 
                positions={[userPos, GUILD_HALL_POS]} 
                pathOptions={journeyOptions} 
              />
            </>
          )}

          <MapController userPos={userPos} onLocate={setUserPos} />
        </MapContainer>

        {/* Map Instructions */}
        <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur border border-amber-600/30 rounded-lg px-3 py-2 text-xs text-amber-200">
          💡 Click anywhere on the map to set your location manually
        </div>
      </div>
    </div>
  )
}