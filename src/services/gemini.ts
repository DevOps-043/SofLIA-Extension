import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      tools: [
        { googleSearch: {} } as any // Enable Native Google Search Grounding (Cast to any to fix TS error)
      ]
    });
  }

  async chat(message: string, history: { role: string; parts: string }[] = []) {
    const chat = this.model.startChat({
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.parts }] 
      })),
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  }
}
