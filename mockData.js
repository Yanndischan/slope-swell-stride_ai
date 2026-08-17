export const modeAccents = {
  surf: "#2563eb",
  ski: "#16a34a",
  run: "#E28743",
};

export const modeLabels = {
  surf: "Surf Mode",
  ski: "Ski Mode",
  run: "Run Mode",
};

export const heroText = {
  surf: { prefix: "Chase the", accent: "Perfect Swell" },
  ski: { prefix: "Find the", accent: "Perfect Slope" },
  run: { prefix: "Run the", accent: "Perfect Route" },
};

export const searchPlaceholders = {
  surf: "Search surf destinations...",
  ski: "Search ski resorts...",
  run: "Search running hubs...",
};

export const popularByMode = {
  surf: ["Oahu, Hawaii", "Bali, Indonesia"],
  ski: ["Whistler, BC", "Niseko, Japan"],
  run: ["Boulder, CO", "Flagstaff, AZ"],
};

export const locations = {
  "Oahu, Hawaii": {
    mode: "surf",
    tagline: "North Shore Pipeline",
    conditions: {
      waveHeight: { value: "6-8", unit: "ft", label: "Wave Height" },
      swellPeriod: { value: "14", unit: "sec", label: "Swell Period" },
      swellDirection: { value: "NNW", unit: "", label: "Swell Direction" },
      wind: { value: "8", unit: "mph", label: "Wind Speed" },
      windDirection: { value: "Offshore", unit: "", label: "Wind Direction" },
      waterTemp: { value: "78", unit: "°F", label: "Water Temp" },
      tide: { value: "Rising", unit: "", label: "Tide" },
      uvIndex: { value: "9", unit: "", label: "UV Index" },
    },
    status: { label: "Glassy Waves", emoji: "🌊" },
    shops: [
      { name: "North Shore Surf Shop", rating: 4.8, reviews: 312, address: "62-620 Kamehameha Hwy, Haleiwa", phone: "(808) 637-4966", type: "Surf Rentals & Lessons", priceRange: "$$" },
      { name: "Surf N Sea", rating: 4.6, reviews: 489, address: "62-595 Kamehameha Hwy, Haleiwa", phone: "(808) 637-9887", type: "Board Rentals & Gear", priceRange: "$$" },
      { name: "Pipeline Surf Co.", rating: 4.9, reviews: 178, address: "59-029 Pupukea Rd, Haleiwa", phone: "(808) 638-7100", type: "Premium Board Rentals", priceRange: "$$$" },
      { name: "Aloha Surf Academy", rating: 4.7, reviews: 256, address: "66-105 Haleiwa Rd, Haleiwa", phone: "(808) 637-1230", type: "Lessons & Gear", priceRange: "$" },
    ],
  },
  "Whistler, BC": {
    mode: "ski",
    tagline: "Whistler Blackcomb",
    conditions: {
      snowBase: { value: "142", unit: "cm", label: "Snow Base" },
      newSnow24h: { value: "28", unit: "cm", label: "New Snow (24h)" },
      newSnow7d: { value: "86", unit: "cm", label: "New Snow (7d)" },
      temperature: { value: "-8", unit: "°C", label: "Temperature" },
      windChill: { value: "-14", unit: "°C", label: "Wind Chill" },
      visibility: { value: "Good", unit: "", label: "Visibility" },
      liftsOpen: { value: "34/37", unit: "", label: "Lifts Open" },
      runsOpen: { value: "189/200+", unit: "", label: "Runs Open" },
    },
    status: { label: "Epic Powder", emoji: "🏔️" },
    shops: [
      { name: "Summit Sport", rating: 4.7, reviews: 421, address: "4293 Mountain Square, Whistler", phone: "(604) 932-6225", type: "Ski & Board Rentals", priceRange: "$$" },
      { name: "Can-Ski", rating: 4.5, reviews: 338, address: "4340 Lorimer Rd, Whistler", phone: "(604) 938-7755", type: "Full Equipment Rentals", priceRange: "$$" },
      { name: "Whistler Village Sports", rating: 4.8, reviews: 267, address: "4254 Village Stroll, Whistler", phone: "(604) 932-3327", type: "Premium Gear & Tuning", priceRange: "$$$" },
      { name: "Prior Snowboards", rating: 4.9, reviews: 156, address: "4-1548 Flume Rd, Whistler", phone: "(604) 935-1923", type: "Custom Boards & Rentals", priceRange: "$$$" },
    ],
  },
  "Bali, Indonesia": {
    mode: "surf",
    tagline: "Uluwatu & Beyond",
    conditions: {
      waveHeight: { value: "4-6", unit: "ft", label: "Wave Height" },
      swellPeriod: { value: "12", unit: "sec", label: "Swell Period" },
      swellDirection: { value: "SSW", unit: "", label: "Swell Direction" },
      wind: { value: "5", unit: "mph", label: "Wind Speed" },
      windDirection: { value: "Offshore", unit: "", label: "Wind Direction" },
      waterTemp: { value: "82", unit: "°F", label: "Water Temp" },
      tide: { value: "Low", unit: "", label: "Tide" },
      uvIndex: { value: "11", unit: "", label: "UV Index" },
    },
    status: { label: "Clean & Firing", emoji: "🔥" },
    shops: [
      { name: "Drifter Surf Shop", rating: 4.8, reviews: 534, address: "Jl. Labuan Sait, Pecatu", phone: "+62 812-3698-4521", type: "Board Rentals & Café", priceRange: "$" },
      { name: "The Perfect Wave", rating: 4.6, reviews: 287, address: "Jl. Pantai Padang Padang", phone: "+62 813-3812-9904", type: "Surf Packages", priceRange: "$$" },
      { name: "Uluwatu Surf Villas", rating: 4.9, reviews: 198, address: "Jl. Mamo, Pecatu", phone: "+62 811-3960-0088", type: "Luxury Surf Retreat", priceRange: "$$$" },
    ],
  },
  "Niseko, Japan": {
    mode: "ski",
    tagline: "Japan's Powder Capital",
    conditions: {
      snowBase: { value: "320", unit: "cm", label: "Snow Base" },
      newSnow24h: { value: "45", unit: "cm", label: "New Snow (24h)" },
      newSnow7d: { value: "112", unit: "cm", label: "New Snow (7d)" },
      temperature: { value: "-12", unit: "°C", label: "Temperature" },
      windChill: { value: "-19", unit: "°C", label: "Wind Chill" },
      visibility: { value: "Moderate", unit: "", label: "Visibility" },
      liftsOpen: { value: "28/30", unit: "", label: "Lifts Open" },
      runsOpen: { value: "52/55", unit: "", label: "Runs Open" },
    },
    status: { label: "Japow Alert", emoji: "❄️" },
    shops: [
      { name: "Rhythm Japan", rating: 4.9, reviews: 612, address: "170-212 Aza Yamada, Kutchan", phone: "+81 136-23-0164", type: "Premium Rentals & Retail", priceRange: "$$$" },
      { name: "Niseko Sports", rating: 4.6, reviews: 389, address: "Hirafu 188, Kutchan", phone: "+81 136-22-0704", type: "Full Equipment Rentals", priceRange: "$$" },
      { name: "Black Diamond Lodge", rating: 4.7, reviews: 234, address: "163 Yamada, Kutchan", phone: "+81 136-44-1144", type: "Gear & Guiding", priceRange: "$$" },
    ],
  },
  "Boulder, CO": {
    mode: "run",
    tagline: "Mile-High Running Mecca",
    conditionGroups: [
      {
        label: "Vibe & Comfort",
        subtitle: "Casual",
        conditions: [
          { value: "64", unit: "°F", label: "RealFeel Temp" },
          { value: "8", unit: "%", label: "Precipitation Chance" },
          { value: "7", unit: "", label: "UV Index" },
        ],
      },
      {
        label: "Aero & Cardio",
        subtitle: "Hardcore",
        conditions: [
          { value: "32", unit: "AQI", label: "Air Quality Index" },
          { value: "42% / 41°", unit: "", label: "Humidity / Dew Point" },
          { value: "6 mph NW", unit: "", label: "Wind Velocity" },
        ],
      },
    ],
    status: {
      label: "Excellent for Long Miles",
      emoji: "🏃",
      description: "Calm winds, safe AQI of 32, moderate humidity—prime window for tempo work.",
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
  },
  "Flagstaff, AZ": {
    mode: "run",
    tagline: "7,000ft Altitude Capital",
    conditionGroups: [
      {
        label: "Vibe & Comfort",
        subtitle: "Casual",
        conditions: [
          { value: "58", unit: "°F", label: "RealFeel Temp" },
          { value: "5", unit: "%", label: "Precipitation Chance" },
          { value: "9", unit: "", label: "UV Index" },
        ],
      },
      {
        label: "Aero & Cardio",
        subtitle: "Hardcore",
        conditions: [
          { value: "28", unit: "AQI", label: "Air Quality Index" },
          { value: "35% / 33°", unit: "", label: "Humidity / Dew Point" },
          { value: "4 mph SW", unit: "", label: "Wind Velocity" },
        ],
      },
    ],
    status: {
      label: "Altitude Training Gold",
      emoji: "🏔️",
      description: "Crisp alpine air, AQI of 28, low humidity—stack easy miles at 7,000ft.",
    },
    shopCategories: [
      {
        title: "Specialty Stores & Gear",
        shops: [
          { name: "Run Flagstaff", rating: 4.9, reviews: 378, address: "204 N Leroux St, Flagstaff", phone: "(928) 774-3220", type: "Gait Analysis & Altitude Gear", priceRange: "$$" },
          { name: "Northern Arizona Running Co", rating: 4.7, reviews: 234, address: "12 W Aspen Ave, Flagstaff", phone: "(928) 774-1444", type: "Shoe Fitting & Run Lab", priceRange: "$$" },
          { name: "Altitude Running", rating: 4.6, reviews: 189, address: "319 W Route 66, Flagstaff", phone: "(928) 774-1400", type: "Running Store & Coaching", priceRange: "$$" },
        ],
      },
      {
        title: "Community & Terrain",
        shops: [
          { name: "Flagstaff Running Club", rating: 4.8, reviews: 145, address: "Meets at Thorpe Park", phone: "flagstaffrunning.org", type: "Weekly Group Runs", priceRange: "Free" },
          { name: "Buffalo Park Trailhead", rating: 4.9, reviews: 567, address: "N Gemini Dr, Flagstaff", phone: "2mi Loop Trail", type: "Meadow Loop Trail", priceRange: "Free" },
          { name: "Observatory Mesa Trailhead", rating: 4.7, reviews: 234, address: "W Mesa Ave, Flagstaff", phone: "Forest Network", type: "Singletrack Trails", priceRange: "Free" },
        ],
      },
    ],
  },
};

export const destinationHubs = [
  { name: "Oahu, Hawaii", mode: "surf", tagline: "North Shore Pipeline" },
  { name: "Malibu, CA", mode: "surf", tagline: "Point Break Classic" },
  { name: "Gold Coast, Australia", mode: "surf", tagline: "Surfers Paradise" },
  { name: "Ericeira, Portugal", mode: "surf", tagline: "Europe's Surf Reserve" },
  { name: "Bali, Indonesia", mode: "surf", tagline: "Uluwatu & Beyond" },
  { name: "Whistler, BC", mode: "ski", tagline: "Whistler Blackcomb" },
  { name: "Chamonix, France", mode: "ski", tagline: "Mont Blanc Valley" },
  { name: "Niseko, Japan", mode: "ski", tagline: "Japan's Powder Capital" },
  { name: "Boulder, CO", mode: "run", tagline: "Mile-High Running Mecca" },
  { name: "Flagstaff, AZ", mode: "run", tagline: "7,000ft Altitude Capital" },
  { name: "London, UK", mode: "run", tagline: "Urban Running Capital" },
];

export const locationNames = Object.keys(locations);