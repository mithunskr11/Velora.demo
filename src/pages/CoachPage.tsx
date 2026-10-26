import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Flame, 
  Leaf, 
  ShieldAlert, 
  RotateCcw,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService, UserAIContext, AICoachReply } from '../services/ai';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'fallback';
  model?: string;
  error?: string;
  retryText?: string;
}

export const CoachPage: React.FC = () => {
  const { user, streak, xp, ecoScore, habits, todayMood } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'coach',
      text: `Hello ${user.name.split(' ')[0]}! 🌱 I am your VELORA Lifestyle Coach powered by Gemini. I can help you calibrate daily routines, overcome mental fatigue, protect your ${streak}-day streak, and discover sustainable habits. How can I support you right now?`,
      timestamp: 'Just now',
      source: 'gemini'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiErrorNotice, setApiErrorNotice] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Motivate Me 🔥',
    'What Should I Do Today?',
    'I keep losing motivation after three days. Can you suggest a realistic plan?',
    'I’m Stressed 🌿',
    'Suggest a Small Habit',
    'Show My Progress ⭐'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setLastUserPrompt(text);
    setApiErrorNotice(null);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInputText('');
    setLoading(true);

    const context: UserAIContext = {
      name: user.name,
      streak,
      xp,
      ecoScore,
      mood: todayMood || undefined,
      goals: user.goals,
      interests: user.interests,
      activityLevel: user.activityLevel,
      availableTime: user.availableTime,
      difficulty: user.difficulty,
      habitsSummary: `${habits.filter(h => h.completed).length} of ${habits.length} completed`
    };

    try {
      // Pass conversation history so Gemini understands multi-turn context
      const historyForGemini = nextMessages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const result: AICoachReply = await aiService.getCoachResponse(text, context, historyForGemini);
      
      if (result.keyMissing) {
        setApiErrorNotice('GEMINI_API_KEY is not configured. Add it in Settings → Secrets to connect live Gemini models.');
      } else if (result.error && result.source === 'fallback') {
        setApiErrorNotice(`Note: ${result.error}`);
      }

      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: result.source,
        model: result.model,
        error: result.error,
        retryText: result.source === 'fallback' ? text : undefined
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (e: any) {
      console.warn('Error during chat send:', e);
      setApiErrorNotice('Could not reach AI Coach. Please check your connection and retry.');
      const errorMsg: ChatMessage = {
        id: `coach-err-${Date.now()}`,
        sender: 'coach',
        text: 'I encountered an issue generating a response. Click retry below to try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback',
        error: e?.message || 'Network error',
        retryText: text
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (textToRetry?: string) => {
    const prompt = textToRetry || lastUserPrompt;
    if (prompt) {
      handleSendMessage(prompt);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-[#102A24] rounded-3xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between shrink-0 bg-emerald-50/50 dark:bg-emerald-950/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#087F5B] to-[#39A96B] flex items-center justify-center text-white shadow-md shadow-[#087F5B]/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              VELORA AI Coach
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[#087F5B] dark:text-[#7BC96F]">
                <Sparkles className="w-2.5 h-2.5" />
                Live Gemini API
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              “Your personal lifestyle companion.”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#F4A261]" /> {streak}d
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-[#39A96B]" /> {ecoScore}
          </span>
        </div>
      </div>

      {/* Global Notice Banner if key missing or temporary disruption */}
      {apiErrorNotice && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{apiErrorNotice}</span>
          </div>
          {lastUserPrompt && (
            <button
              onClick={() => handleRetry()}
              className="flex items-center gap-1 font-semibold text-amber-900 dark:text-amber-100 underline hover:no-underline ml-2 shrink-0"
            >
              <RotateCcw className="w-3 h-3" /> Retry
            </button>
          )}
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isCoach ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                isCoach ? 'bg-[#087F5B]' : 'bg-[#4DA3D9]'
              }`}>
                {isCoach ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                isCoach
                  ? 'bg-[#F4FAF5] dark:bg-[#173B32] text-[#173B32] dark:text-emerald-100 border border-emerald-100 dark:border-emerald-800/50 shadow-xs'
                  : 'bg-[#087F5B] text-white shadow-md'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                
                {/* Meta details footer */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-emerald-100/40 dark:border-emerald-800/40">
                  <span className={`text-[10px] ${
                    isCoach ? 'text-slate-400 dark:text-emerald-400/60' : 'text-emerald-200'
                  }`}>
                    {msg.timestamp}
                  </span>

                  {isCoach && (
                    <div className="flex items-center gap-2">
                      {msg.source === 'gemini' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                          Gemini {msg.model ? `(${msg.model})` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/50 px-1.5 py-0.5 rounded-full">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          Offline Fallback
                        </span>
                      )}

                      {msg.retryText && (
                        <button
                          onClick={() => handleRetry(msg.retryText)}
                          disabled={loading}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 underline transition-colors"
                          title="Retry with Gemini"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full bg-[#087F5B] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800 text-xs text-slate-600 dark:text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#087F5B] dark:text-[#7BC96F] animate-pulse" />
              <span>Thinking & consulting Gemini...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills */}
      <div className="px-4 py-2 border-t border-emerald-100/60 dark:border-emerald-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 bg-white dark:bg-[#102A24]">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F4FAF5] dark:bg-[#173B32] text-slate-700 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800/60 hover:border-[#087F5B] hover:text-[#087F5B] whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-emerald-100 dark:border-emerald-900/40 shrink-0 bg-white dark:bg-[#102A24]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything — e.g. 'I keep losing motivation after three days. Can you suggest a realistic plan?'"
            className="flex-1 px-4 py-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs sm:text-sm text-[#173B32] dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-3 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] disabled:opacity-50 text-white shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 dark:text-emerald-400/50 text-center mt-2">
          Wellness disclaimer: VELORA is for positive lifestyle motivation and does not provide medical diagnosis.
        </p>
      </div>
    </div>
  );
};
