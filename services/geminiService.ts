
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getShoppingAdvice = async (userPrompt: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  const productContext = PRODUCTS.map(p => `${p.name} (KES ${p.price}): ${p.description}`).join('\n');
  
  const systemInstruction = `
    You are the "Crubs Concierge", the official AI for "CRUBS BY ARYAN".
    Core Phrases:
    - "Your one-stop shop for quality medical gear."
    - "Equipping you to deliver as a healthcare professional."
    
    Location: Based in Nyahururu, Kenya, but SHIPPING NATIONWIDE to all 47 counties.
    Tone: High-authority, clinical, efficient, and professional.
    
    Products:
    ${productContext}
    
    Guidelines:
    1. Help healthcare professionals choose gear that allows them to perform at their best.
    2. Emphasize that we ship all over the country from our Nyahururu hub.
    3. For bulk orders, mention the "Bulk Purchases" section.
    4. Keep responses crisp and professional (under 3 sentences).
    5. Always speak from the perspective of a brand that equips the best professionals in Kenya.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    return response.text || "I am currently monitoring our logistics feed. How can I help equip you today?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your one-stop shop for quality medical gear is currently updating its system. Please explore our collections above.";
  }
};
