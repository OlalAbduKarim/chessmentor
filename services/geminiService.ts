
import { GoogleGenAI, Type } from "@google/genai";
import { CourseLevel } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const courseSuggestionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A creative and engaging title for a chess course.",
      },
      description: {
        type: Type.STRING,
        description: "A short, one-sentence compelling description of what the course covers.",
      },
    },
    required: ["title", "description"],
  },
};

export interface AISuggestion {
  title: string;
  description: string;
}

export const getCourseSuggestions = async (level: CourseLevel): Promise<AISuggestion[]> => {
  try {
    const prompt = `I am a ${level} chess player. Suggest 3 unique and interesting course ideas that would be perfect for me.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSuggestionSchema,
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText);
    return suggestions as AISuggestion[];

  } catch (error) {
    console.error("Error getting course suggestions from Gemini API:", error);
    // Return a fallback or throw the error
    return [
        { title: "Error Generating Suggestions", description: "Could not connect to the AI service. Please try again later." }
    ];
  }
};
