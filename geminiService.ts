import { GoogleGenAI, Type } from "@google/genai";
import { RedesignResult } from "./types";

// Manage multiple API keys for redundancy and failover
class AIClientManager {
  private keys: string[];
  private currentIndex: number = 0;

  constructor() {
    const rawKeys = process.env.API_KEY || "";
    this.keys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 0);

    if (this.keys.length === 0) {
      console.warn("No API_KEY found in environment variables.");
    }
  }

  private getClient(index: number) {
    return new GoogleGenAI({ apiKey: this.keys[index] });
  }

  async executeWithFailover<T>(operation: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    if (this.keys.length === 0) {
      throw new Error("No API keys configured. Please check your .env.local or Vercel settings.");
    }

    let lastError: any;
    const initialIndex = this.currentIndex;

    // Try each key once starting from the current one
    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const index = (initialIndex + attempt) % this.keys.length;
      const client = this.getClient(index);

      try {
        const result = await operation(client);
        // On success, persist this index for the next call
        this.currentIndex = index;
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`API Key failover: Key ${index + 1}/${this.keys.length} failed.`, error.message);

        // If it's a 429 (Rate Limit) or 5xx, we definitely want to try the next key
        // Otherwise it might be a user error (invalid HTML etc), but falling over is safer
        continue;
      }
    }

    throw new Error(`All API keys failed. Last error: ${lastError?.message || "Unknown error"}`);
  }
}

const clientManager = new AIClientManager();

export const redesignProductPage = async (inputHtml: string, systemInstruction: string): Promise<RedesignResult> => {
  return clientManager.executeWithFailover(async (ai) => {
    const model = "gemini-3-flash-preview";

    const response = await ai.models.generateContent({
      model,
      contents: `Redesign this HTML snippet: \n\n${inputHtml}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: {
              type: Type.STRING,
              description: "The redesigned HTML wrapped in #ecom-redesign-wrapper"
            },
            css: {
              type: Type.STRING,
              description: "The scoped vanilla CSS rules"
            },
            explanation: {
              type: Type.STRING,
              description: "Briefly explain the design choices made"
            }
          },
          required: ["html", "css"]
        }
      }
    });

    try {
      const data = JSON.parse(response.text || "{}");
      return data as RedesignResult;
    } catch (e) {
      throw new Error("Failed to parse AI response as JSON");
    }
  });
};

export const refineSystemPrompt = async (currentPrompt: string): Promise<string> => {
  return clientManager.executeWithFailover(async (ai) => {
    const model = "gemini-3-flash-preview";

    const response = await ai.models.generateContent({
      model,
      contents: `Refine and improve this design strategy prompt. 
Transformation logic must follow this exact High-End DNA:
1. AUTHORITY PERSONA: Define a high-end designer persona.
2. NAMED EXPERIENCE: Name the specific design ecosystem (e.g. 'Competition-Grade Kinetic').
3. THREE-PILLAR PHILOSOPHY: Define Concept, Goal, and Tone.
4. VISUAL SPECS: Define Grid System, Typography Scale, and Semantic Palette (with HEX).
5. ASSET REUSE: Mandate the reuse of image URLs from the source HTML.
6. NEGATIVE CONSTRAINTS: Explicitly forbid 'Product Hero' sections (no add-to-cart, no galleries, no prices). Focus ONLY on the storytelling/description landing page.

Current Prompt to Refine:
"${currentPrompt}"`,
      config: {
        systemInstruction: "You are a world-class UI/UX design consultant. Your goal is to transform basic user ideas into rigorous, high-fidelity design briefs for an AI engine. You must strictly enforce the 'No Product Hero' and 'Image Reuse' rules.",
      }
    });

    return response.text || currentPrompt;
  });
};
