import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        const errorMessage = "Gemini API key not found. Please set the API_KEY environment variable in your deployment settings.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
}

export const getAIResponseStream = async (lessonTitle: string, userQuery: string) => {
  try {
    const client = getAiClient(); // Initialize lazily

    const systemInstruction = `You are a friendly and expert chess tutor named ChessMentor AI. 
The student is currently in a lesson titled "${lessonTitle}". 
Answer their question clearly, concisely, and in a supportive tone.
Use markdown for formatting if it helps clarity (e.g., bolding key terms, using lists).
Do not greet the user, just provide the answer.`;

    const result = await client.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return result;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
};