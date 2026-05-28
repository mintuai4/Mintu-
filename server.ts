import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK or fallback gracefully if API key is not yet set
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized GoogleGenAI with Gemini API.");
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined. Using responsive local intelligence simulation.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

// Global mockup database for news, electrician topics, quizzes, and live cricket
const MOCK_NEWS = [
  {
    id: "1",
    title: "AI Revolutionizes Electrician Hands-On Field Training Programs",
    summary: "New immersive visual simulations using smart overlays let rookie electricians view active conduit paths, circuit loads, and hazard zones in real-time, decreasing standard field safety incidents by up to forty percent.",
    category: "ai",
    source: "Tech Sparks Education",
    time: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    title: "India Dominates with Back-to-Back Wins in International T20 Series",
    summary: "The Indian squad continues their high-scoring run with incredible partnerships. Sensational bowling during the death overs secured a massive win over the challengers in front of a packed glowing stadium.",
    category: "cricket",
    source: "CricMintor Live",
    time: "3 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1540747737956-378724044282?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    title: "Vite 6 & React 19 Set Precedent for High-Performance Spark Interfaces",
    summary: "Web applications constructed on top of Vite 6 and React 19 are reporting near-instant client load times due to superior bundle stripping and innovative compilation pipelines that improve modern client rendering speed.",
    category: "technology",
    source: "Modern Developer Web",
    time: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "4",
    title: "Electrician Theory: Standard Transformer Core Design Innovations",
    summary: "Industrial research unveils brand-new laminated silicon-steel magnetic core designs for standard step-down transformers that minimize eddy current heating while maximizing overall electrical efficiency.",
    category: "education",
    source: "National Power Academy",
    time: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=60"
  }
];

const INTRO_SUGGESTIONS = [
  "How does a step-down transformer function?",
  "Live scores for the current Indian cricket match",
  "Generate a 5-question mock test on Electrician Workshop Calculations",
  "Latest updates on Apple VisionOS and spatial computing",
  "What is the difference between AC and DC transmission?"
];

// Helper to compile search results using actual Gemini with Google Search tool
app.post("/api/search", async (req, res) => {
  const { query, category } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  console.log(`Searching for keyword: "${query}" in category: "${category || 'All'}"`);

  // Prepare fallback in case Gemini is offline or not configured
  const fallbackAnswer = `### Mintor Intelligence - Local Simulation Result
You searched for **"${query}"** inside the **"${category || 'Universal'}"** workspace.

Connecting a **Gemini API Key** under *Settings > Secrets* will instantly unlock real-time holographic search results powered by Google Search Grounding.

**Suggested Quick Topics related to your search:**
1. Magnetism and Magnetic Core Flux Calculations
2. Ohms Law Practical Lab Experiment Checklist
3. Active T20 League Standings and Player Run Rate stats`;

  const fallbackSources = [
    { title: "Mintor Local Knowledge Base", uri: "https://mintor.in/study-hub" },
    { title: "Standard Electrician Curriculum Guides", uri: "https://mintor.in/electrician-curriculum" }
  ];

  if (!ai) {
    // Return high-quality offline results
    return res.json({
      query,
      answer: fallbackAnswer,
      sources: fallbackSources,
      category: category || "general",
      youtubeVideos: [
        { title: `Mastering Electrician Practical: ${query}`, videoId: "dQw4w9WgXcQ", channel: "Mintor Education Hub" },
        { title: `Holographic AI Computing Demystified`, videoId: "dQw4w9WgXcQ", channel: "Future Search Tech" }
      ],
      quizQuestions: [
        {
          question: "Which material exhibits the highest electrical conductivity?",
          options: ["Copper", "Silver", "Aluminum", "Iron"],
          answerIndex: 1,
          explanation: "Silver has the highest electrical conductivity of all metals, followed by copper and gold."
        }
      ]
    });
  }

  try {
    const promptText = `User is searching Mintor.in (Futuristic AI Study & Search Engine platform) for: "${query}".
Category context selected by user: "${category || 'General'}".
Please provide a comprehensive, highly insightful and professionally formatted technical search response in Markdown.
If the query is related to electrician subjects (theory, practicals, workshop math, engineering drawing, employability skills), formulate a precise lesson summary or study guide.
If the query is related to cricket or news, summarize the latest key facts.
If relevant, offer 3 actionable quiz practice MCQs at the end or embedded in your response.`;

    const searchResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = searchResponse.text || "No summary generated. Please try again.";
    
    // Extract real-time search grounding sources
    const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks.map((c: any) => ({
      title: c.web?.title || "Web Reference Source",
      uri: c.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#");

    // Add mock high-quality contextual Youtube and educational contents
    const youtubeVideos = [
      { 
        title: `Comprehensive Guide: ${query.substring(0, 40)}`, 
        videoId: "dQw4w9WgXcQ", 
        channel: "Mintor AI Learning" 
      },
      { 
        title: `Industrial Workshop Practical: ${query.substring(0, 30)} Outline`, 
        videoId: "dQw4w9WgXcQ", 
        channel: "National Skill Grid" 
      }
    ];

    res.json({
      query,
      answer,
      sources: sources.length > 0 ? sources : fallbackSources,
      category: category || "general",
      youtubeVideos,
      quizQuestions: [
        {
          question: `Which fundamental principle is directly associated with: "${query.substring(0, 30)}"?`,
          options: ["Faraday's Law of Induction", "Kirchhoff's Current Law", "Ohm's Constant Ratio", "Lenz's Counter Magnetomotive Force"],
          answerIndex: 0,
          explanation: "Faraday's Law describes how magnetic fluxes interact with electrical conductors to produce electromotive force."
        }
      ]
    });

  } catch (error: any) {
    console.error("Gemini Search Grounding call failed:", error);
    res.json({
      query,
      answer: `### Mintor Security Warning & Recovery Mode
An interruption occurred while querying our holographic AI engines. 

*Technical Details: ${error.message || "Pipeline congested"}*

We have switched back to offline database search:
${fallbackAnswer}`,
      sources: fallbackSources,
      category: category || "general"
    });
  }
});

// Interactive AI chat endpoint for instant student doubts
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!ai) {
    return res.json({
      reply: `Greetings from Mintor's Offline Assistant! 
I see you are interested in solving doubts. Connect your **Gemini API Key** via AI Studio's top secrets panel to enable infinite voice, study calculations, and active interactive troubleshooting chatbot.

Standard formula of electrical impedance:
$$Z = \\sqrt{R^2 + (X_L - X_C)^2}$$`
    });
  }

  try {
    // Format conversation history for Gemini Chat standard API
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are the Mintor AI On-Demand Tutor, a friendly assistant who explains electric engineering concepts, solves cricket scoring stats, and helps creators with study guides using concise, formatted markdown. Keep explanations luxurious, visual, and simple.",
      }
    });

    res.json({ reply: response.text || "No reply generated." });
  } catch (err: any) {
    res.json({ reply: `Tutor Engine experienced a brief state interruption: ${err.message}` });
  }
});

// Dedicated Study Hub CoPilot Tutor endpoint
app.post("/api/study-tutor", async (req, res) => {
  const { message, history, activeChapter, subjectName, profile } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message query is required" });
  }

  if (!ai) {
    return res.json({
      reply: "Offline simulated mode fallback logic. Add your Gemini API Key in secrets panel to experience real-time lesson calculations."
    });
  }

  try {
    const systemPrompt = `You are the Mintor AI Study Copilot, an expert ITI (Industrial Training Institute) & NCVT syllabus tutor for young Indian electrician apprentices. 
Your goal is to explain concept theory chapters, solve practical step guides, and offer customized study plans and recommendations based on the user's profile.

User Context:
- Name: ${profile?.name || "Student"}
- Selected Interests: ${profile?.interests ? profile.interests.join(", ") : "General Electrician Theory"}
- Performance Grade: ${profile?.xp || 0} XP level in active ${profile?.streak || 1}-day learning streak.

Syllabus Scope:
- Current Subject: ${subjectName || "Electrician Trade Theory"}
${activeChapter ? `- Currently focused Chapter Unit: "${activeChapter.title}" (${activeChapter.description}). Notes text: "${activeChapter.notes}"` : "- No active unit selected in directories right now."}

Guidelines for Response:
1. If the message relates to "personalized study plan", "recommendations", or "suggest", formulate a custom study roadmap. Relate their interests (e.g., cricket, gaming, tech) with electrician math or theory (e.g., scoring run rates relates to load balances, sports relays relate to armature relays). Incorporate action goals to gain more XP.
2. If looking at an active chapter and requested to "unpack", give an in-depth breakdown of the theories, practical steps, core safety measures, and standard exam-aligned formulas.
3. Use formatted Markdown. Keep answers professional, encouraging, detailed yet easy to read.`;

    const chatHistory = history || [];
    // Convert history format to text prompts or contents structure
    const promptContents = `User Doubts / Request: ${message}`;

    const tutorResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContents,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const isRec = message.toLowerCase().includes("recommend") || message.toLowerCase().includes("plan") || message.toLowerCase().includes("interests");

    res.json({
      reply: tutorResponse.text || "I processed your syllabus unit query but could not formulate a text answer. Let's study are relative concepts!",
      isRecommendation: isRec
    });

  } catch (err: any) {
    console.error("Gemini Study Tutor API failed:", err);
    res.json({
      reply: `Syllabus Tutor encountered a temporary operational buffer: ${err.message || "Pipeline congested"}`
    });
  }
});

// News Feed API
app.get("/api/news", (req, res) => {
  res.json({ news: MOCK_NEWS });
});

// Standard static setup for SPA or Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mintor.in Server is operating on http://0.0.0.0:${PORT}`);
  });
}

startServer();
