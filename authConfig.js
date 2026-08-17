const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

// Google OAuth & Native Handoff Strategy
// Structures environment-based OAuth Client IDs for Web, iOS, and Android,
// plus deep-link callback handling via the configured redirect scheme.
//
// The actual Google sign-in flow is performed by the platform SDK
// (db.auth.loginWithProvider("google", fromUrl)). This module provides
// platform detection, the correct Client ID, and deep-link redirect building.
//
// See `.env.example` for required environment variables.

// Deep-link redirect scheme (defaults to "slopeswellstride")
export const DEEP_LINK_SCHEMA =
  (import.meta.env?.VITE_AUTH_REDIRECT_SCHEME || "slopeswellstride").replace(/\/+$/, "");

// Environment-based OAuth Client IDs (per platform)
export const OAUTH_CLIENT_IDS = {
  web: import.meta.env?.VITE_GOOGLE_WEB_CLIENT_ID || "",
  ios: import.meta.env?.VITE_GOOGLE_IOS_CLIENT_ID || "",
  android: import.meta.env?.VITE_GOOGLE_ANDROID_CLIENT_ID || "",
};

// Detect current platform from the user agent
export function getPlatform() {
  if (typeof window === "undefined" || !navigator) return "web";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "ios";
  return "web";
}

// Get the OAuth Client ID configured for the current platform
export function getPlatformClientId() {
  const platform = getPlatform();
  return OAUTH_CLIENT_IDS[platform] || OAUTH_CLIENT_IDS.web;
}

// Build a deep-link callback URL for native OAuth redirects.
// On web: a standard origin URL. On native: the configured redirect scheme.
export function buildDeepLinkCallback(path = "/dashboard") {
  const platform = getPlatform();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (platform === "web" && typeof window !== "undefined") {
    return `${window.location.origin}${cleanPath}`;
  }
  return `${DEEP_LINK_SCHEMA}:/${cleanPath}`;
}

// Parse an incoming deep-link callback URL to extract the return path.
export function parseDeepLinkCallback(url) {
  if (!url) return null;
  const prefix = `${DEEP_LINK_SCHEMA}:/`;
  if (url.startsWith(prefix)) {
    return url.slice(prefix.length) || "/";
  }
  try {
    const u = new URL(url);
    return u.pathname + u.search || "/";
  } catch {
    return null;
  }
}

// Check if the app was launched/opened via a deep-link callback
export function isDeepLinkCallback() {
  if (typeof window === "undefined") return false;
  return window.location.href.startsWith(`${DEEP_LINK_SCHEMA}:/`);
}

// Resolve the post-login return URL: prefer a deep-link, fall back to a path.
// Pass this to loginWithProvider("google", fromUrl) for seamless native handoff.
export function resolveAuthReturnUrl(fallbackPath = "/dashboard") {
  if (isDeepLinkCallback()) {
    const parsed = parseDeepLinkCallback(window.location.href);
    return parsed || buildDeepLinkCallback(fallbackPath);
  }
  return buildDeepLinkCallback(fallbackPath);
}