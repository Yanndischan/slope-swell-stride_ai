// Client-side simulation wrapper for sandbox testing.
// Replaces live backend (fetch-destination-data) until Builder+ deployment.
// All calls resolve after exactly 1.5 seconds to test premium visual transitions.

import { locations } from "@/lib/mockData";
import { fetchWeatherForMode } from "@/lib/weatherApi";

const SIMULATED_DELAY = 1500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Simulated location data for mood-based routing ---

const BOULDER_RUN = {
  mode: "run",
  tagline: "Simulated Trail Route",
  conditionGroups: [
    {
      label: "Vibe & Comfort",
      subtitle: "Casual",
      conditions: [
        { value: "62", unit: "°F", label: "RealFeel Temp" },
        { value: "3", unit: "%", label: "Precipitation Chance" },
        { value: "5", unit: "", label: "UV Index" },
      ],
    },
    {
      label: "Aero & Cardio",
      subtitle: "Hardcore",
      conditions: [
        { value: "12", unit: "AQI", label: "Air Quality Index" },
        { value: "38% / 36°", unit: "", label: "Humidity / Dew Point" },
        { value: "2 mph W", unit: "", label: "Wind Velocity" },
      ],
    },
  ],
  status: {
    label: "Pristine Trail Conditions",
    emoji: "🌿",
    description:
      "Calm winds, AQI of 12, and low humidity—perfect for clearing your mind on a quiet nature run.",
  },
  shopCategories: [
    {
      title: "Specialty Stores & Gear",
      shops: [
        { name: "Boulder Running Company", rating: 4.8, reviews: 412, address: "1136 Pearl St, Boulder", phone: "(303) 444-2453", type: "Gait Analysis & Fitting", priceRange: "$$$" },
        { name: "RunTEC Performance Lab", rating: 4.7, reviews: 287, address: "2525 Arapahoe Ave, Boulder", phone: "(303) 555-0142", type: "Gait Analysis & Coaching", priceRange: "$$$" },
        { name: "Flatirons Running", rating: 4.6, reviews: 198, address: "5360 Arapahoe Rd, Boulder", phone: "(303) 555-0199", type: "Running Shoes & Gear", priceRange: "$$" },
      ],
    },
    {
      title: "Community & Terrain",
      shops: [
        { name: "Boulder Running Club", rating: 4.9, reviews: 156, address: "Meets at North Boulder Park", phone: "boulderrunningclub.org", type: "Group Runs & Track Workouts", priceRange: "Free" },
        { name: "Boulder Reservoir Trailhead", rating: 4.8, reviews: 342, address: "5545 Reservoir Rd, Boulder", phone: "5.4mi Loop Trail", type: "Scenic Loop Trail", priceRange: "Free" },
        { name: "Chautauqua Trailhead", rating: 4.9, reviews: 1204, address: "900 Baseline Rd, Boulder", phone: "Flatirons Network", type: "Iconic Trail System", priceRange: "Free" },
      ],
    },
  ],
};

const OAHU_SURF = {
  mode: "surf",
  tagline: "Simulated Epic Break",
  conditions: {
    waveHeight: { value: "8", unit: "ft", label: "Wave Height" },
    swellPeriod: { value: "16", unit: "sec", label: "Swell Period" },
    swellDirection: { value: "NNW", unit: "", label: "Swell Direction" },
    wind: { value: "5", unit: "mph", label: "Wind Speed" },
    windDirection: { value: "Offshore", unit: "", label: "Wind Direction" },
    waterTemp: { value: "79", unit: "°F", label: "Water Temp" },
    tide: { value: "Rising", unit: "", label: "Tide" },
    uvIndex: { value: "10", unit: "", label: "UV Index" },
  },
  status: { label: "Epic 8ft Clean Break", emoji: "🔥" },
  shops: [
    { name: "North Shore Surf Shop", rating: 4.8, reviews: 312, address: "62-620 Kamehameha Hwy, Haleiwa", phone: "(808) 637-4966", type: "Surf Rentals & Lessons", priceRange: "$$" },
    { name: "Pipeline Surf Co.", rating: 4.9, reviews: 178, address: "59-029 Pupukea Rd, Haleiwa", phone: "(808) 638-7100", type: "Premium Board Rentals", priceRange: "$$$" },
    { name: "Surf N Sea", rating: 4.6, reviews: 489, address: "62-595 Kamehameha Hwy, Haleiwa", phone: "(808) 637-9887", type: "Board Rentals & Gear", priceRange: "$$" },
  ],
};

const WHISTLER_SKI = {
  mode: "ski",
  tagline: "Simulated Epic Powder Day",
  conditions: {
    snowBase: { value: "185", unit: "cm", label: "Snow Base" },
    newSnow24h: { value: "38", unit: "cm", label: "New Snow (24h)" },
    newSnow7d: { value: "112", unit: "cm", label: "New Snow (7d)" },
    temperature: { value: "-6", unit: "°C", label: "Temperature" },
    windChill: { value: "-12", unit: "°C", label: "Wind Chill" },
    visibility: { value: "Excellent", unit: "", label: "Visibility" },
    liftsOpen: { value: "36/37", unit: "", label: "Lifts Open" },
    runsOpen: { value: "195/200+", unit: "", label: "Runs Open" },
  },
  status: { label: "Epic Powder Day", emoji: "🏔️" },
  shops: [
    { name: "Summit Sport", rating: 4.7, reviews: 421, address: "4293 Mountain Square, Whistler", phone: "(604) 932-6225", type: "Ski & Board Rentals", priceRange: "$$" },
    { name: "Whistler Village Sports", rating: 4.8, reviews: 267, address: "4254 Village Stroll, Whistler", phone: "(604) 932-3327", type: "Premium Gear & Tuning", priceRange: "$$$" },
    { name: "Prior Snowboards", rating: 4.9, reviews: 156, address: "4-1548 Flume Rd, Whistler", phone: "(604) 935-1923", type: "Custom Boards & Rentals", priceRange: "$$$" },
  ],
};

// --- Keyword-based mood routing ---

const RELAX_KEYWORDS = /relax|chill|quiet|scenic|peace|calm|stress|tired|exhaust|burn|nature|escape|unwind|breathe|serene|gentle|soft|clear|mind|grounding/;
const INTENSE_KEYWORDS = /heavy|intense|shred|wave|aggress|charge|fire|pump|adrenal|energ|excit|restless|hardcore|pow|extreme|rip|charge|rage|fury/;
const SOCIAL_KEYWORDS = /social|community|friend|group|fun|casual|meet|together|connect|lonely|club|gather|party|vibe|hang/;

/**
 * Simulate mood-based routing.
 * @param {string} moodText - The user's mood description.
 * @returns {Promise<{mode: string, location: string, message: string, locationData: object}>}
 */
export async function simulateFromMood(moodText) {
  await delay(SIMULATED_DELAY);

  const text = moodText.toLowerCase();

  if (RELAX_KEYWORDS.test(text)) {
    return {
      mode: "run",
      location: "Boulder, CO",
      message:
        "We recommend a grounding trail run in Boulder. The air quality is pristine (AQI 12) and winds are completely calm, perfect for clearing your mind.",
      locationData: BOULDER_RUN,
    };
  }

  if (INTENSE_KEYWORDS.test(text)) {
    const goSurf = Math.random() > 0.5;
    if (goSurf) {
      return {
        mode: "surf",
        location: "Oahu, Hawaii",
        message:
          "Channel that energy into the elements. Oahu is currently seeing an epic 8ft clean break with glassy faces — the perfect arena to match your intensity.",
        locationData: OAHU_SURF,
      };
    }
    return {
      mode: "ski",
      location: "Whistler, BC",
      message:
        "Channel that energy into the mountain. Whistler just received 38cm of fresh powder overnight — the perfect arena to match your intensity.",
      locationData: WHISTLER_SKI,
    };
  }

  if (SOCIAL_KEYWORDS.test(text)) {
    return {
      mode: "run",
      location: "Boulder, CO",
      message:
        "Boulder's vibrant running community is calling. Join a group run along the scenic reservoir loop — fresh air, friendly faces, and miles that feel effortless together.",
      locationData: BOULDER_RUN,
    };
  }

  // Default: grounding trail run
  return {
    mode: "run",
    location: "Boulder, CO",
    message:
      "We recommend a grounding trail run in Boulder. The air quality is pristine (AQI 12) and winds are completely calm, perfect for clearing your mind.",
    locationData: BOULDER_RUN,
  };
}

/**
 * Simulate a destination search.
 * @param {string} destination - The destination name.
 * @param {string} mode - The active mode (surf/ski/run).
 * @returns {Promise<{destination: string, mode: string, locationData: object}>}
 */
export async function simulateSearch(destination, mode) {
  // 1. Try the real Open-Meteo API with geocoding + fallback engine
  try {
    const result = await fetchWeatherForMode(destination, mode);
    if (result) {
      const existing = locations[destination];
      const locationData = {
        mode,
        tagline: result.geo.name + (result.geo.country ? ", " + result.geo.country : ""),
        status: result.status,
        ...(mode === "run"
          ? { conditionGroups: result.conditions, shopCategories: existing?.shopCategories || BOULDER_RUN.shopCategories }
          : { conditions: result.conditions, shops: existing?.shops || (mode === "surf" ? OAHU_SURF.shops : WHISTLER_SKI.shops) }),
      };
      return { destination, mode, locationData };
    }
  } catch (err) {
    console.warn("Open-Meteo API failed, falling back to mock data:", err);
  }

  // 2. Fallback to simulated mock data
  await delay(SIMULATED_DELAY);
  const existing = locations[destination];
  if (existing) {
    return { destination, mode: existing.mode, locationData: existing };
  }
  if (mode === "surf") return { destination, mode, locationData: OAHU_SURF };
  if (mode === "ski") return { destination, mode, locationData: WHISTLER_SKI };
  return { destination, mode, locationData: BOULDER_RUN };
}