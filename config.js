// PrepAI General App Configuration (Safe to push to GitHub)
// For your secret Groq API key, put it in 'api-key.js' (which is gitignored)
// or enter it directly in the browser UI settings.

const CONFIG = {
  // Groq Model to use (llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768)
  GROQ_MODEL: 'llama-3.3-70b-versatile',

  // Fallback model if primary hits rate limits
  GROQ_FALLBACK_MODEL: 'llama-3.1-8b-instant',

  // Max retry attempts for API calls
  MAX_RETRIES: 2
};

// Export to window
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
