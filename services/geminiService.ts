import { GoogleGenAI, Type } from "@google/genai";
import { Vehicle } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction to set the persona
const SYSTEM_INSTRUCTION = `
You are an expert automotive master technician with 20+ years of experience specializing in Volkswagen Transporter Vans (T4, T5, T6, T6.1), Honda vehicles (VTEC engines, hybrids), and Mercedes-Benz (Star Diagnostic insights). 
Your goal is to help vehicle owners diagnose issues, understand maintenance schedules, and perform DIY repairs.
Be concise, safety-conscious, and accurate. 
When diagnosing, ask clarifying questions if symptoms are vague. 
Always warn about safety hazards (hot engines, high voltage, jack stands).
Format your output with clear headings and bullet points where appropriate using Markdown.
`;

export const geminiService = {
  /**
   * Diagnoses a vehicle issue based on user description and vehicle context.
   */
  diagnoseIssue: async (vehicle: Vehicle, symptoms: string, imageBase64?: string): Promise<string> => {
    try {
      const model = 'gemini-2.5-flash';
      
      const prompt = `
        Vehicle: ${vehicle.year} ${vehicle.brand} ${vehicle.model}
        Engine: ${vehicle.fuelType}
        Mileage: ${vehicle.mileage}
        
        Symptoms reported by user: "${symptoms}"
        
        Please provide:
        1. Most likely causes (ranked by probability).
        2. Troubleshooting steps.
        3. Severity assessment (Can I drive it?).
        4. Estimated repair complexity (DIY vs Professional).
      `;

      const parts: any[] = [{ text: prompt }];
      
      if (imageBase64) {
        parts.unshift({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        });
      }

      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.4, 
        }
      });

      return response.text || "I couldn't generate a diagnosis at this time.";
    } catch (error) {
      console.error("Gemini Diagnosis Error:", error);
      return "An error occurred while connecting to the diagnosis engine. Please try again.";
    }
  },

  /**
   * Generates a maintenance checklist for a specific vehicle.
   */
  getMaintenanceSchedule: async (vehicle: Vehicle): Promise<any> => {
    try {
        const prompt = `
        Generate a JSON list of recommended maintenance tasks for a ${vehicle.year} ${vehicle.brand} ${vehicle.model} with ${vehicle.mileage} miles/km.
        Include 'title', 'intervalMileage' (next due mileage from now), 'description', and 'priority' (High/Medium/Low).
        Only return the JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            intervalMileage: { type: Type.NUMBER, description: "Mileage increment for this task" },
                            description: { type: Type.STRING },
                            priority: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        
        return JSON.parse(response.text || '[]');
    } catch (error) {
        console.error("Gemini Schedule Error", error);
        return [];
    }
  },
  
  /**
   * Generates a step-by-step DIY guide.
   */
  getDIYGuide: async (vehicle: Vehicle, taskName: string): Promise<string> => {
      try {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Create a step-by-step DIY guide for "${taskName}" on a ${vehicle.year} ${vehicle.brand} ${vehicle.model}. Include required tools list, parts list, and safety warnings.`,
              config: {
                  systemInstruction: SYSTEM_INSTRUCTION
              }
          });
          return response.text || "Guide generation failed.";
      } catch (e) {
          return "Could not generate guide.";
      }
  },

  /**
   * Interprets an OBD-II Code
   */
  interpretDTC: async (vehicle: Vehicle, code: string): Promise<any> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze diagnostic trouble code ${code} for a ${vehicle.year} ${vehicle.brand} ${vehicle.model}. 
        Return a JSON object with:
        - description: Technical description
        - analysis: Detailed explanation in layman's terms specific to this car model's common issues
        - possibleCauses: Array of strings
        - severity: 'low', 'medium', 'high', or 'critical'
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              analysis: { type: Type.STRING },
              possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
              severity: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("DTC Interpretation failed", e);
      return {
        description: "Analysis Failed",
        analysis: "Could not connect to knowledge base.",
        possibleCauses: [],
        severity: "low"
      };
    }
  },

  /**
   * Generates insights based on VIN and decoded info
   */
  getVINInsights: async (vin: string, decodedInfo: any): Promise<string> => {
    try {
      const prompt = `
        I have a VIN: ${vin}.
        Basic Decoded Info: ${JSON.stringify(decodedInfo)}.
        
        Please provide a 'Vehicle History & Specs Report' based on the manufacturer specifications for this VIN pattern.
        Include:
        1. Likely Engine / Transmission options for this configuration.
        2. Assembly plant location facts.
        3. Common recalls or known issues for this specific generation/year.
        4. Fun fact about this specific model.
        
        Disclaimer: State that this is AI-generated based on the VIN pattern and not an official DMV/Carfax record.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      return response.text || "Could not generate VIN insights.";
    } catch (e) {
      return "Unable to retrieve VIN insights at this time.";
    }
  }
};