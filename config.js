
const CONFIG = {
  // Groq Model to use (llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768)
  GROQ_MODEL: 'llama-3.3-70b-versatile',

  // Fallback model if primary hits rate limits
  GROQ_FALLBACK_MODEL: 'llama-3.1-8b-instant',


  MAX_RETRIES: 2
};

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
