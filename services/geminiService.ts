import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, initialize directly with process.env.API_KEY and assume it's available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateAnswer = async (query: string, context: string): Promise<string> => {
    const model = 'gemini-2.5-flash';

    const prompt = `Based strictly on the following context, please provide a concise and accurate answer to the question. If the answer cannot be found in the context, state "I couldn't find an answer in the provided document." Do not use any outside knowledge.

Context:
---
${context}
---

Question: ${query}

Answer:`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating answer from Gemini API:", error);
        throw new Error("Failed to get a response from the AI model.");
    }
};
