import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Helper to call Gemini with official @google/genai SDK, User-Agent header, and model fallback
async function callGeminiWithFallback(contents: any, systemInstruction?: string) {
  const currentKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!currentKey) {
    throw new Error('GEMINI_API_KEY_NOT_FOUND');
  }

  const client = new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      },
      timeout: 12000
    }
  });

  // gemini-3.8-flash is the primary model; gemini-3.1-flash-lite provides seamless failover
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastErr: any = null;

  for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: systemInstruction ? { systemInstruction } : undefined
      });
      if (response && response.text) {
        return { text: response.text, model, source: 'gemini' as const };
      }
    } catch (err: any) {
      console.warn(`[VELORA AI] Model ${model} error:`, err?.status || err?.message || err);
      lastErr = err;
    }
  }

  throw lastErr;
}

// AI Coach Chat Handler
async function handleCoachChat(req: express.Request, res: express.Response) {
  const { message, history, userContext } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const currentKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  const systemInstruction = `You are the VELORA AI Lifestyle Coach. Tagline: "Your Habits. Your Mind. Your Impact."
You are an encouraging, calm, mindful, and evidence-based lifestyle assistant.
You help users build sustainable habits, navigate motivation slumps, prioritize physical wellness, recover from stress, and celebrate eco-friendly actions.
Do NOT present yourself as a medical doctor or diagnostic system.
Tone: Warm, empathetic, realistic, practical, and conversational (use 2-4 focused, digestible paragraphs or bullet points with relevant emojis 🌱 🏃 🔥 ⭐ 🌿).

User Profile:
- Name: ${userContext?.name || 'Alex'}
- Current Streak: ${userContext?.streak || 7} days
- Eco Score: ${userContext?.ecoScore || 72}/100
- Recent Mood: ${userContext?.mood || 'Good'}
- Active Goals: ${JSON.stringify(userContext?.goals || ['Fitness', 'Mental Wellness', 'Sustainability'])}
- Today's Habit Progress: ${userContext?.habitsSummary || '3 of 5 completed'}`;

  // Format conversation history for Gemini multi-turn context
  const geminiContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-8); // Include up to last 8 turns for rich conversational context
    for (const item of recentHistory) {
      if (item && item.text && typeof item.text === 'string') {
        geminiContents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      }
    }
  }

  // Append current user message
  geminiContents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  if (!currentKey) {
    console.warn('[VELORA AI] GEMINI_API_KEY missing from environment.');
    return res.json({
      reply: generateLocalCoachResponse(message, userContext),
      source: 'fallback',
      fallback: true,
      keyMissing: true,
      error: 'GEMINI_API_KEY is not configured in Settings > Secrets.'
    });
  }

  try {
    const result = await callGeminiWithFallback(geminiContents, systemInstruction);
    return res.json({
      reply: result.text,
      model: result.model,
      source: 'gemini',
      fallback: false
    });
  } catch (error: any) {
    console.error('[VELORA AI] Error generating Gemini reply:', error?.message || error);
    return res.json({
      reply: generateLocalCoachResponse(message, userContext),
      source: 'fallback',
      fallback: true,
      error: error?.message || 'Temporary AI service disruption. Showing local guidance.'
    });
  }
}

// Support both /api/chat and /api/ai/coach routes
app.post('/api/chat', handleCoachChat);
app.post('/api/ai/coach', handleCoachChat);

// AI Recommendations route
app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { userContext } = req.body;
    const currentKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (!currentKey) {
      return res.json({ fallback: true, recommendations: null });
    }

    const prompt = `You are VELORA's Habit & Wellness AI Recommendation Engine.
Based on the following user profile, generate 3 highly targeted, actionable habit recommendations.
User Context:
Goals: ${JSON.stringify(userContext?.goals || [])}
Interests: ${JSON.stringify(userContext?.interests || [])}
Activity Level: ${userContext?.activityLevel || 'Moderate'}
Available Time: ${userContext?.availableTime || '30 minutes'}
Difficulty: ${userContext?.difficulty || 'Intermediate'}

Respond ONLY with valid JSON array of objects:
[
  {
    "name": "string",
    "category": "Health" | "Fitness" | "Mental Wellness" | "Sustainability" | "Productivity",
    "matchPercentage": number (75-98),
    "reason": "string (Why VELORA recommends this)",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "benefit": "string",
    "duration": "string",
    "ecoPoints": number,
    "xp": number
  }
]`;

    const result = await callGeminiWithFallback(prompt);
    const cleanText = result.text?.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanText || '[]');
    res.json({ recommendations: data, fallback: false, model: result.model });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.json({ fallback: true, recommendations: null });
  }
});

// AI Monthly Plan Update route
app.post('/api/ai/monthly-plan', async (req, res) => {
  try {
    const { prevPlan, monthlyUpdate } = req.body;
    const currentKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (!currentKey) {
      return res.json({ fallback: true, plan: null });
    }

    const prompt = `You are VELORA's Monthly Adaptive Lifestyle AI.
Analyze the user's monthly progress update:
Previous Weight: ${monthlyUpdate?.prevWeight}kg, Current Weight: ${monthlyUpdate?.currentWeight}kg
Activity Level: ${monthlyUpdate?.activityLevel}
Goals: ${JSON.stringify(monthlyUpdate?.goals)}
Available Time: ${monthlyUpdate?.availableTime}
Mood: ${monthlyUpdate?.mood}

Generate an upgraded monthly habit plan.
Respond ONLY with valid JSON:
{
  "summary": "1-2 sentences explaining why the plan was adapted",
  "highlight": "string",
  "recommendedAdjustments": [
    { "from": "string", "to": "string", "reason": "string" }
  ],
  "newHabitSuggestions": [
    { "name": "string", "category": "string", "frequency": "string", "difficulty": "string" }
  ]
}`;

    const result = await callGeminiWithFallback(prompt);
    const cleanText = result.text?.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(cleanText || '{}');
    res.json({ plan, fallback: false, model: result.model });
  } catch (error) {
    console.error('AI Monthly Plan error:', error);
    res.json({ fallback: true, plan: null });
  }
});

function generateLocalCoachResponse(message: string, context: any) {
  const msg = (message || '').toLowerCase();
  const name = context?.name || 'Alex';
  
  if (msg.includes('tired') || msg.includes("don't want") || msg.includes('exhausted') || msg.includes('lazy')) {
    return `That’s completely okay, ${name}. You don’t have to do everything today. How about a gentle 5-minute mindful walk or simply drinking a glass of water? Small steps still count and protect your streak. 🌱`;
  }
  if (msg.includes('motivate') || msg.includes('motivation') || msg.includes('inspire')) {
    return `Remember your 7-day streak, ${name}! 🔥 Consistency beats perfection every single time. Every small eco-friendly choice and 10-minute stretch shapes who you become. You've already earned 450 XP this week!`;
  }
  if (msg.includes('stress') || msg.includes('anxious') || msg.includes('overwhelm')) {
    return `Take a deep breath in for 4 seconds, hold for 4, and release for 6. 🌿 Let's pause high-intensity goals right now. A quick 3-minute breathwork session will help center your mind.`;
  }
  if (msg.includes('habit') || msg.includes('suggest') || msg.includes('small')) {
    return `Here is a high-impact micro-habit for today: Take a 15-minute nature walk without checking notifications. It boosts mental clarity, burns ~65 kcal, and earns you +10 XP! 🍃`;
  }
  if (msg.includes('progress') || msg.includes('score') || msg.includes('eco')) {
    return `Your Eco Score is 72/100 (+8 this week!), and your habit completion rate is 85%. You are in the top 15% of consistent members this month. Keep up this wonderful momentum! ⭐`;
  }
  return `I'm right here with you, ${name}. Every small habit you complete creates a healthier you and a healthier planet. What would you like to focus on today? 🌱`;
}

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VELORA server running at http://0.0.0.0:${port}`);
  });
}

startServer();
