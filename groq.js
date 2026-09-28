/* =============================================
   PrepAI – Groq LLM Service
   Powers Dynamic Domain, Company & Resume Interviews
   ============================================= */

const GroqService = {
  // Get active API Key from localStorage, api-key.js, or config.js
  getApiKey() {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('prepai_groq_api_key');
      if (storedKey && storedKey.trim().length > 0) {
        return storedKey.trim();
      }
      if (window.GROQ_API_KEY && window.GROQ_API_KEY.trim().length > 0) {
        return window.GROQ_API_KEY.trim();
      }
    }
    if (typeof CONFIG !== 'undefined' && CONFIG.GROQ_API_KEY) {
      return CONFIG.GROQ_API_KEY.trim();
    }
    return '';
  },

  setApiKey(key) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('prepai_groq_api_key', key.trim());
    }
  },

  hasApiKey() {
    const key = this.getApiKey();
    return Boolean(key && key.startsWith('gsk_') && key.length > 20);
  },

  getModel() {
    return (typeof CONFIG !== 'undefined' && CONFIG.GROQ_MODEL) 
      ? CONFIG.GROQ_MODEL 
      : 'llama-3.3-70b-versatile';
  },

  /**
   * Make a chat completion request to Groq API
   */
  async chatCompletion(messages, { temperature = 0.7, jsonMode = false, model = null } = {}) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Groq API Key is not configured.');
    }

    const selectedModel = model || this.getModel();
    const payload = {
      model: selectedModel,
      messages: messages,
      temperature: temperature,
      max_tokens: 1024,
    };

    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Groq API Error: HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  },

  /**
   * Verify an API key with a fast small call
   */
  async testKey(key) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key.trim()}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Say "OK"' }],
        max_tokens: 10
      })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || 'Invalid API key or network error');
    }
    return true;
  },

  /**
   * Generate an adaptive, domain-specific, company-tailored, resume-based interview question
   */
  async generateQuestion({ domain, company, resumeText, resumeSkills, resumeProjects, resumeExperience, difficulty, mode, askedQuestions = [], previousSession = [] }) {
    const domainName = domain?.name || 'Software Engineering';
    const companyName = company?.name || 'Top Tier Tech';
    const isCompanySpecific = Boolean(company);
    const hasResume = Boolean(resumeText && (resumeSkills?.length || resumeText.length > 50));

    // Build context summary
    let candidateContext = 'Candidate has not provided a resume.';
    if (hasResume) {
      candidateContext = `
Candidate Resume Highlights:
- Top Detected Skills: ${(resumeSkills || []).slice(0, 10).join(', ') || 'N/A'}
- Projects: ${(resumeProjects || []).slice(0, 3).join(' | ') || 'N/A'}
- Experience/Roles: ${(resumeExperience || []).slice(0, 2).join(' | ') || 'N/A'}
Full Resume Excerpt:
${(resumeText || '').slice(0, 1200)}
      `.trim();
    }

    const pastQuestionsList = askedQuestions.slice(-10).map((q, i) => `${i + 1}. ${q}`).join('\n');

    const prompt = `You are a Principal Tech Lead and Senior Hiring Manager at ${companyName} conducting an interview in the ${domainName} domain.

Current Interview Settings:
- Domain: ${domainName}
- Target Company: ${isCompanySpecific ? companyName : 'Industry Standard'}
- Interview Mode: ${mode.toUpperCase()} (technical = coding/system design/concepts; hr = behavioral/STAR method/cultural; mixed = blend)
- Target Difficulty Level: ${difficulty.toUpperCase()} (easy, medium, hard)

${candidateContext}

Previously Asked Questions in this Session (DO NOT REPEAT OR CLOSELY DUPLICATE):
${pastQuestionsList || 'None yet'}

Your Task:
Generate the NEXT interview question.
- If resume details are present, make the question deeply personal to their actual projects, technology stack, or work experience, connecting it to ${domainName}${isCompanySpecific ? ` and how ${companyName} builds software` : ''}.
- If ${mode} is technical, ask about real architecture, debugging, deep concepts, tradeoffs, or scale.
- If ${mode} is hr, ask a behavioral STAR question relevant to their past roles and ${companyName}'s engineering culture.
- Calibrate difficulty strictly to "${difficulty}".

Respond ONLY with valid JSON in this exact structure:
{
  "text": "The exact interview question string",
  "hint": "A helpful, concise hint guiding what a strong answer should touch upon",
  "type": "${mode === 'hr' ? 'hr' : mode === 'technical' ? 'technical' : 'technical'}",
  "topic": "Specific Topic or Skill Name (e.g., 'React State Management' or 'Kafka Data Pipeline')",
  "source": "${hasResume ? 'resume' : isCompanySpecific ? 'company' : 'domain'}",
  "difficulty": "${difficulty}",
  "keyConcepts": ["concept1", "concept2", "concept3"]
}`;

    const rawResponse = await this.chatCompletion([
      { role: 'system', content: 'You are an expert AI technical interviewer. Always return valid JSON matching the requested schema.' },
      { role: 'user', content: prompt }
    ], { temperature: 0.75, jsonMode: true });

    try {
      const parsed = JSON.parse(rawResponse);
      if (parsed.text) return parsed;
    } catch (e) {
      console.warn('Failed to parse Groq JSON response, cleaning up...', rawResponse);
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    throw new Error('Could not parse valid question from Groq');
  },

  /**
   * Evaluate a candidate's answer with LLM intelligence
   */
  async evaluateAnswer({ question, answer, domain, company, difficulty }) {
    const prompt = `You are an expert interviewer evaluating a candidate's response in an interview.

Context:
- Domain: ${domain?.name || 'Software Engineering'}
- Target Company: ${company?.name || 'Tech Company'}
- Difficulty: ${difficulty || 'medium'}
- Question Asked: "${question.text}"
- Question Topic: ${question.topic || 'General'}
- Expected Key Concepts: ${(question.keyConcepts || []).join(', ') || 'Standard best practices'}

Candidate's Answer:
"${answer}"

Evaluate the candidate's answer fairly and constructively.
1. Assign a Score (0-100) reflecting technical accuracy, depth, clarity, and relevance.
   - 75-100: Strong, accurate, clear, mentions trade-offs/concrete details.
   - 45-74: Partially correct, high-level, missed key depth or mechanics.
   - 0-44: Vague, incorrect, or too brief.
2. Determine Quality: "good" (75+), "partial" (45-74), or "improve" (<45).
3. Provide a constructive, personalized 2-3 sentence feedback summary. Praise specific good points and explicitly mention what was missing or how to elevate the answer.

Respond ONLY with valid JSON in this exact structure:
{
  "score": 82,
  "quality": "good",
  "feedback": "Concise feedback string highlighting strengths and key improvement areas.",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["What to add or clarify"]
}`;

    const raw = await this.chatCompletion([
      { role: 'system', content: 'You are an objective, encouraging, senior technical interviewer. Always output valid JSON.' },
      { role: 'user', content: prompt }
    ], { temperature: 0.3, jsonMode: true });

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.score === 'number') {
        return {
          score: Math.min(100, Math.max(0, Math.round(parsed.score))),
          quality: parsed.quality || (parsed.score >= 75 ? 'good' : parsed.score >= 45 ? 'partial' : 'improve'),
          feedback: parsed.feedback || 'Answer recorded and evaluated.',
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || []
        };
      }
    } catch (e) {
      console.warn('Fallback JSON parsing for evaluation:', raw);
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    }

    throw new Error('Could not evaluate answer via Groq');
  },

  /**
   * Rephrase a question dynamically
   */
  async rephraseQuestion(questionText) {
    const prompt = `Rephrase the following interview question into simpler, clearer, or alternative wording while keeping the exact technical meaning and scope intact:
Question: "${questionText}"

Return ONLY the rephrased question in one concise sentence.`;

    const result = await this.chatCompletion([
      { role: 'system', content: 'You are a helpful interviewer clarifying a question.' },
      { role: 'user', content: prompt }
    ], { temperature: 0.6 });

    return result.trim().replace(/^["']|["']$/g, '');
  },

  /**
   * Generate an AI Hint on the fly
   */
  async generateHint(questionText) {
    const prompt = `Provide a short, 1-2 sentence guiding hint for the following interview question without giving away the full answer:
Question: "${questionText}"

Return ONLY the hint sentence.`;

    const result = await this.chatCompletion([
      { role: 'system', content: 'You are a helpful interviewer giving a hint.' },
      { role: 'user', content: prompt }
    ], { temperature: 0.5 });

    return result.trim().replace(/^["']|["']$/g, '');
  }
};

// Expose globally
if (typeof window !== 'undefined') {
  window.GroqService = GroqService;
}
