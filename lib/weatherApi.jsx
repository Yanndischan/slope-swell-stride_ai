// Multi-Sport Weather Integration (Open-Meteo API)
// Dynamic geocoding + coordinate fallback engine for offshore/marine surf coordinates.
// Safely handles missing/delayed data with clean fallbacks — never throws uncaught errors.

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const mToft = (m) => (m * 3.28084).toFixed(1);
const cToF = (c) => ((c * 9) / 5 + 32).toFixed(0);

const toCardinal = (deg) => {
  if (deg == null || isNaN(deg)) return "—";
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
};

const safe = (v, fallback = "—") => (v == null || (typeof v === "number" && isNaN(v)) ? fallback : v);

// --- Geocoding ---
export async function geocode(name) {
  try {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const r = data.results[0];
    return { latitude: r.latitude, longitude: r.longitude, name: r.name, country: r.country || "" };
  } catch {
    return null;
  }
}

// --- Coordinate Fallback Engine ---
// Offshore/marine surf coordinates can fail standard land-weather lookups.
// Nudge coordinates slightly inland and retry without breaking the UI.
function nudgeToLand(lat, lng) {
  return {
    latitude: +(lat + (lat >= 0 ? 0.08 : -0.08)).toFixed(3),
    longitude: lng,
  };
}

async function fetchWithFallback(buildUrl, lat, lng) {
  // First attempt with original coordinates
  try {
    const res = await fetch(buildUrl(lat, lng));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.error) throw new Error(data.reason || "API error");
    return data;
  } catch (firstErr) {
    // Fallback: nudge toward land and retry
    try {
      const nudged = nudgeToLand(lat, lng);
      const res = await fetch(buildUrl(nudged.latitude, nudged.longitude));
      if (!res.ok) throw firstErr;
      const data = await res.json();
      if (data && data.error) throw firstErr;
      return data;
    } catch {
      return null; // graceful — caller falls back to mock data
    }
  }
}

// --- Surf Conditions (Marine API + Forecast for wind/UV) ---
async function fetchSurfConditions(lat, lng) {
  const marine = await fetchWithFallback(
    (la, lo) =>
      `${MARINE_URL}?latitude=${la}&longitude=${lo}&current=wave_height,wave_period,wave_direction,water_temperature&hourly=uv_index&timezone=auto&forecast_days=1`,
    lat,
    lng
  );

  let wind = null;
  try {
    const res = await fetch(
      `${FORECAST_URL}?latitude=${lat}&longitude=${lng}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=mph&timezone=auto&forecast_days=1`
    );
    if (res.ok) wind = await res.json();
  } catch {
    /* swallow */
  }

  const c = marine?.current || {};
  const w = wind?.current || {};

  return {
    waveHeight: { value: safe(c.wave_height != null ? mToft(c.wave_height) : null), unit: "ft", label: "Wave Height" },
    swellPeriod: { value: safe(c.wave_period != null ? c.wave_period.toFixed(0) : null), unit: "sec", label: "Swell Period" },
    swellDirection: { value: toCardinal(c.wave_direction), unit: "", label: "Swell Direction" },
    wind: { value: safe(w.wind_speed_10m != null ? w.wind_speed_10m.toFixed(0) : null), unit: "mph", label: "Wind Speed" },
    windDirection: { value: toCardinal(w.wind_direction_10m), unit: "", label: "Wind Direction" },
    waterTemp: { value: safe(c.water_temperature != null ? cToF(c.water_temperature) : null), unit: "°F", label: "Water Temp" },
    tide: { value: "—", unit: "", label: "Tide" },
    uvIndex: { value: safe(marine?.hourly?.uv_index?.[0]?.toFixed(0)), unit: "", label: "UV Index" },
  };
}

// --- Ski Conditions (Forecast API) ---
async function fetchSkiConditions(lat, lng) {
  const data = await fetchWithFallback(
    (la, lo) =>
      `${FORECAST_URL}?latitude=${la}&longitude=${lo}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=visibility&daily=snowfall_sum,snow_depth&timezone=auto&forecast_days=1`,
    lat,
    lng
  );

  const c = data?.current || {};
  const daily = data?.daily || {};
  const windChill = c.temperature_2m != null && c.wind_speed_10m != null
    ? (c.temperature_2m - c.wind_speed_10m * 0.1).toFixed(0)
    : null;

  return {
    snowBase: { value: safe(daily.snow_depth?.[0]?.toFixed(0)), unit: "cm", label: "Snow Base" },
    newSnow24h: { value: safe(daily.snowfall_sum?.[0]?.toFixed(0)), unit: "cm", label: "New Snow (24h)" },
    newSnow7d: { value: "—", unit: "cm", label: "New Snow (7d)" },
    temperature: { value: safe(c.temperature_2m?.toFixed(0)), unit: "°C", label: "Temperature" },
    windChill: { value: safe(windChill), unit: "°C", label: "Wind Chill" },
    visibility: { value: safe(data?.hourly?.visibility?.[0] != null ? (data.hourly.visibility[0] / 1000).toFixed(0) + "km" : null), unit: "", label: "Visibility" },
    liftsOpen: { value: "—", unit: "", label: "Lifts Open" },
    runsOpen: { value: "—", unit: "", label: "Runs Open" },
  };
}

// --- Run Conditions (Forecast + Air Quality API) ---
async function fetchRunConditions(lat, lng) {
  const data = await fetchWithFallback(
    (la, lo) =>
      `${FORECAST_URL}?latitude=${la}&longitude=${lo}&current=apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=uv_index,precipitation_probability&daily=precipitation_probability_max&timezone=auto&forecast_days=1&wind_speed_unit=mph`,
    lat,
    lng
  );

  let aqi = null;
  try {
    const res = await fetch(
      `${AIR_QUALITY_URL}?latitude=${lat}&longitude=${lng}&current=us_aqi&timezone=auto&forecast_days=1`
    );
    if (res.ok) aqi = await res.json();
  } catch {
    /* swallow */
  }

  const c = data?.current || {};

  return [
    {
      label: "Vibe & Comfort",
      subtitle: "Casual",
      conditions: [
        { value: safe(c.apparent_temperature != null ? cToF(c.apparent_temperature) : null), unit: "°F", label: "RealFeel Temp" },
        { value: safe(data?.daily?.precipitation_probability_max?.[0]?.toFixed(0)), unit: "%", label: "Precipitation Chance" },
        { value: safe(data?.hourly?.uv_index?.[0]?.toFixed(0)), unit: "", label: "UV Index" },
      ],
    },
    {
      label: "Aero & Cardio",
      subtitle: "Hardcore",
      conditions: [
        { value: safe(aqi?.current?.us_aqi?.toFixed(0)), unit: "AQI", label: "Air Quality Index" },
        { value: safe(c.relative_humidity_2m != null ? `${c.relative_humidity_2m.toFixed(0)}%` : null), unit: "", label: "Humidity / Dew Point" },
        { value: safe(c.wind_speed_10m != null ? `${c.wind_speed_10m.toFixed(0)} ${toCardinal(c.wind_direction_10m)}` : null), unit: "mph", label: "Wind Velocity" },
      ],
    },
  ];
}

// --- Derive a simple status label from conditions ---
function deriveStatus(mode, conditions) {
  if (mode === "surf") {
    const wh = conditions.waveHeight?.value;
    return { label: "Live Swell", emoji: "🌊", description: `Real-time marine data${wh !== "—" ? ` — ${wh}ft waves` : ""}.` };
  }
  if (mode === "ski") {
    const snow = conditions.newSnow24h?.value;
    return { label: "Live Mountain", emoji: "🏔️", description: `Real-time snow data${snow !== "—" ? ` — ${snow}cm fresh` : ""}.` };
  }
  const aqi = conditions[1]?.conditions?.[0]?.value;
  return {
    label: "Live Trail Conditions",
    emoji: "🏃",
    description: `Real-time air & weather${aqi !== "—" ? ` — AQI ${aqi}` : ""}.`,
  };
}

// --- Main entry: geocode + fetch sport-specific conditions ---
export async function fetchWeatherForMode(name, mode) {
  const geo = await geocode(name);
  if (!geo) return null;

  let conditions;
  try {
    if (mode === "surf") conditions = await fetchSurfConditions(geo.latitude, geo.longitude);
    else if (mode === "ski") conditions = await fetchSkiConditions(geo.latitude, geo.longitude);
    else conditions = await fetchRunConditions(geo.latitude, geo.longitude);
  } catch {
    return null;
  }

  if (!conditions) return null;

  const status = deriveStatus(mode, conditions);
  return { geo, conditions, status };
}