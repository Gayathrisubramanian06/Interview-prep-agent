/* =============================================
   PrepAI – Environment Loader
   Reads .env file and exposes variables to the app.
   ============================================= */

(async function loadEnv() {
  try {
    const response = await fetch('.env');
    if (!response.ok) {
      console.warn('No .env file found — enter your Groq API key in the Settings modal.');
      return;
    }
    const text = await response.text();
    const lines = text.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));

    const env = {};
    lines.forEach(line => {
      const eqIndex = line.indexOf('=');
      if (eqIndex === -1) return;
      const key = line.substring(0, eqIndex).trim();
      const value = line.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    });

    // Apply API key
    if (env.GROQ_API_KEY && env.GROQ_API_KEY !== 'your_groq_api_key_here' && env.GROQ_API_KEY.startsWith('gsk_')) {
      window.GROQ_API_KEY = env.GROQ_API_KEY;
      if (typeof GroqService !== 'undefined') {
        GroqService.setApiKey(env.GROQ_API_KEY);
      }
      if (typeof updateApiStatusUI === 'function') {
        updateApiStatusUI();
      }
    }

    // Apply model override
    if (env.GROQ_MODEL && typeof CONFIG !== 'undefined') {
      CONFIG.GROQ_MODEL = env.GROQ_MODEL;
    }

    console.log('✅ .env loaded successfully');
  } catch (e) {
    console.warn('.env load skipped:', e.message);
  }
})();
