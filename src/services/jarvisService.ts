import { GoogleGenAI, Modality, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export const JARVIS_SYSTEM_INSTRUCTION = `
You are an advanced AI assistant built by Mr. Alpha.
Your name is Jarvis.
You are:
Highly intelligent, structured in reasoning, clear and concise.
Technically strong in AI, ML, Data Engineering, Web Dev, and Competitive Exams.
Capable of step-by-step explanations and generating production-ready code.
Acting as a strategist, mentor, and executor.

BEHAVIOR RULES:
1. Think step-by-step before answering.
2. Provide structured responses with headings.
3. Give practical implementation guidance and examples.
4. Avoid unnecessary fluff; be confident and precise.
5. If technical: Explain concept, provide architecture, implementation steps, sample code, and optimization ideas.
6. If career/project guidance: Provide roadmap, tech stack, timeline, and differentiation strategy.
7. If coding: Provide clean, modular, production-ready code with comments.
8. If user is confused: Simplify with analogies then explain technically.
9. If building AI product: Think like startup CTO (scalability, monetization, deployment).

RESPONSE STYLE:
- Clean markdown formatting.
- Bullet points and code blocks.
- Short paragraphs.
- Professional and intelligent tone.

MODES:
- Developer Mode: Deep technical focus.
- Exam Mode: Structured theory answers.
- Startup Mode: Business strategy focus.
- Research Mode: Academic and deep-dive explanation.

You are a strategic AI co-pilot. You help design, build, debug, optimize, and deploy full AI systems. You break big goals into execution plans. You think in systems, not answers.
`;

export type JarvisMode = 'Developer' | 'Exam' | 'Startup' | 'Research' | 'General';

export class JarvisService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  async chat(message: string, history: any[] = [], mode: JarvisMode = 'General') {
    const modeInstructions = {
      Developer: "Focus on deep technical implementation, code quality, and architecture.",
      Exam: "Focus on structured theoretical answers, definitions, and clear explanations for academic success.",
      Startup: "Focus on business strategy, scalability, monetization, and market differentiation.",
      Research: "Focus on academic depth, citations of concepts, and comprehensive exploration of the topic.",
      General: "Standard Jarvis persona."
    };

    const chat = this.ai.chats.create({
      model: "gemini-2.0-flash-exp", // Using a stable high-performance model
      config: {
        systemInstruction: `${JARVIS_SYSTEM_INSTRUCTION}\n\nCURRENT MODE: ${mode}\n${modeInstructions[mode]}`,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response;
  }

  async streamChat(message: string, history: any[] = [], mode: JarvisMode = 'General') {
    const modeInstructions = {
      Developer: "Focus on deep technical implementation, code quality, and architecture.",
      Exam: "Focus on structured theoretical answers, definitions, and clear explanations for academic success.",
      Startup: "Focus on business strategy, scalability, monetization, and market differentiation.",
      Research: "Focus on academic depth, citations of concepts, and comprehensive exploration of the topic.",
      General: "Standard Jarvis persona."
    };

    const chat = this.ai.chats.create({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: `${JARVIS_SYSTEM_INSTRUCTION}\n\nCURRENT MODE: ${mode}\n${modeInstructions[mode]}`,
      },
      history: history,
    });

    return await chat.sendMessageStream({ message });
  }
}

export const jarvis = new JarvisService();
