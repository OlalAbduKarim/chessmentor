import { GoogleGenAI } from "@google/genai";

// Ensure you have the API_KEY in your environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully, maybe disabling AI features.
  // For this example, we'll throw an error if the key is missing.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIResponseStream = async (lessonTitle: string, userQuery: string) => {
  try {
    const systemInstruction = `You are a friendly and expert chess tutor named ChessMentor AI. 
The student is currently in a lesson titled "${lessonTitle}". 
Answer their question clearly, concisely, and in a supportive tone.
Use markdown for formatting if it helps clarity (e.g., bolding key terms, using lists).
Do not greet the user, just provide the answer.`;

    const result = await ai.models.generateContentStream({
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
