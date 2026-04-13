// Centralised API base — set VITE_API_URL in .env / Vercel env vars
// for production.  Falls back to localhost for local dev.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default API_BASE;
