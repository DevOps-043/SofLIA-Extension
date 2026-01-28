
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY, MODELS } from "../config";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const navigationTool = {
  functionDeclarations: [
    {
      name: "open_url",
      description: "Opens a URL in a new browser tab. CRITICAL: Use this tool whenever the user asks to 'go to', 'navigate to', 'take me to', 'open', or 'visit' a specific website or page. You must find the correct URL first if not provided.",
      parameters: {
        type: "OBJECT",
        properties: {
          url: {
            type: "STRING",
            description: "The full URL to open (must start with http:// or https://).",
          },
        },
        required: ["url"],
      },
    },
  ],
};

const primaryTools: any[] = [
  { googleSearch: {} },
];

const computerTools: any[] = [
  // User noted googleSearch is incompatible with Computer Use model
  navigationTool,
];

// Model Instances
const primaryModel = genAI.getGenerativeModel({ 
  model: MODELS.PRIMARY,
  tools: primaryTools,
});

const fallbackModel = genAI.getGenerativeModel({ 
  model: MODELS.FALLBACK,
  tools: primaryTools,
});

const computerUseModel = genAI.getGenerativeModel({ 
  model: MODELS.COMPUTER_USE,
  tools: computerTools, 
});



// Image Generation Model - just get the model without special config
const imageGenerationModel = genAI.getGenerativeModel({ 
  model: MODELS.IMAGE_GENERATION,
});

// Deep Research Model
const deepResearchModel = genAI.getGenerativeModel({ 
  model: MODELS.DEEP_RESEARCH,
  tools: computerTools, // Deep Research might benefit from navigation if supported, otherwise revert to primaryTools
});

let chatSession: any = null;

// Deep Research Function
export const runDeepResearch = async (prompt: string) => {
  try {
    console.log("Starting Deep Research with prompt:", prompt);
    
    // Create a new chat session specifically for research to avoid polluting main chat history initially
    // or we can treat it as a one-off generation. Deep Research is often a complex process.
    // For simplicity and seamless integration, we'll run it as a chat but with a specific system prompt.
    
    const researchChat = deepResearchModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Eres un experto investigador. Tu tarea es realizar una investigación profunda, exhaustiva y detallada sobre el tema que te solicite el usuario.
          
          Instrucciones:
          1. Investiga a fondo utilizando múltiples fuentes (usa Google Search libremente).
          2. Estructura tu respuesta como un reporte profesional.
          3. Incluye secciones claras: Introducción, Hallazgos Principales, Detalles Técnicos/Específicos, Conclusiones.
          4. Cita TODAS tus fuentes al final o en el texto.
          5. Sé objetivo y analítico.
          
          Procederé con mi solicitud ahora.` }]
        },
        {
          role: "model",
          parts: [{ text: "Entendido. Estoy listo para realizar una investigación profunda y exhaustiva sobre el tema que necesites, utilizando herramientas de búsqueda para proporcionar un reporte detallado y bien fundamentado con fuentes verificables. Por favor, indícame el tema a investigar." }]
        }
      ]
    });

    const result = await researchChat.sendMessageStream(prompt);
    
    return {
        stream: result.stream,
        getGroundingMetadata: async () => {
          try {
            const response = await result.response;
            const candidate = response.candidates?.[0];
            if (candidate?.groundingMetadata) {
              return candidate.groundingMetadata;
            }
            return null;
          } catch {
            return null;
          }
        }
      };

  } catch (error) {
    console.error("Deep Research error:", error);
    throw error;
  }
};



// Image Generation Function
export const generateImage = async (prompt: string): Promise<{ text: string; imageData?: string }> => {
  try {
    console.log("Generating image with prompt:", prompt);
    
    const enhancedPrompt = `Genera una imagen profesional y de alta calidad basada en: ${prompt}. 
    La imagen debe ser visualmente atractiva y relevante al tema solicitado.`;
    
    // Use generateContent with responseModalities in the request
    const result = await (imageGenerationModel as any).generateContent({
      contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });
    
    const response = result.response;
    const candidate = response.candidates?.[0];
    
    let textResponse = '';
    let imageData: string | undefined;
    
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.text) {
          textResponse += part.text;
        }
        if (part.inlineData) {
          // Image data is base64 encoded
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageData = `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return { 
      text: textResponse || '¡Aquí está tu imagen generada!', 
      imageData 
    };
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

export const startChatSession = (history: any[] = []) => {
  chatSession = primaryModel.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 2000,
    },
  });
  return chatSession;
};

// Helper to determine if "Computer Use" is needed based on prompt keywords
const needsComputerUse = (prompt: string): boolean => {
  const keywords = [
    'click', 'type', 'scroll', 'navigate', 'screenshot', 'computadora', 'navegador', // English / Tech
    'ir a', 'abre', 'abrir', 'llevame', 'llévame', 'visita', 'visitar', 'entra en' // Spanish
  ];
  return keywords.some(k => prompt.toLowerCase().includes(k));
};

export const sendMessageStream = async (message: string, context?: string) => {
  if (!chatSession) {
    startChatSession();
  }

  let prompt = message;
  if (context) {
    const systemPrompt = `Eres Lia, un asistente de productividad amigable integrado en un navegador web.

## Tu Personalidad:
- Eres amable, profesional y concisa
- Respondes en español a menos que te pidan otro idioma
- Das respuestas directas y útiles sin información innecesaria
- SIEMPRE usa Google Search para fundamentar tus respuestas con fuentes actualizadas

## Reglas IMPORTANTES:
1. Tienes la capacidad de NAVEGAR a sitios web usando la herramienta 'open_url'. Si el usuario te pide "llévame a", "abre", "ir a" o "visita" un sitio, USA la herramienta 'open_url' inmediatamente con la URL correcta.
2. NO muestres formato [ACTION:click:X] en tus respuestas textuales.
3. Solo responde a lo que el usuario pregunta.
4. Enfócate en ser útil.
5. Busca información relevante en Google para dar respuestas más completas y actualizadas.

## Contexto de la Página (solo para referencia):
${context}

## Mensaje del Usuario:`;
    prompt = `${systemPrompt}\n${message}`;
  }

  // Check for Computer Use requirement
  if (needsComputerUse(message)) {
    console.log("Switching to Computer Use model...");
    const currentHistory = await chatSession.getHistory();
    chatSession = computerUseModel.startChat({
        history: currentHistory,
    });
  }

  try {
    try {
      const result = await chatSession.sendMessageStream(prompt);
      return {
        stream: result.stream,
        getGroundingMetadata: async () => {
          try {
            const response = await result.response;
            const candidate = response.candidates?.[0];
            if (candidate?.groundingMetadata) {
              return candidate.groundingMetadata;
            }
            return null;
          } catch {
            return null;
          }
        }
      };
    } catch (primaryError) {
      // If we were using Computer Use model and it failed, DO NOT fallback to standard model
      // because standard model doesn't support the tools needed.
      if (needsComputerUse(message)) {
        console.error("Computer Use model failed. Not attempting fallback as it likely lacks required tools.", primaryError);
        throw primaryError;
      }

      console.warn(`Primary/Active model failed, trying fallback ${MODELS.FALLBACK}`, primaryError);
      
      // Fallback Logic
      const history = await chatSession.getHistory();
      const fallbackChat = fallbackModel.startChat({
        history: history,
      });
      
      chatSession = fallbackChat; 
      
      const result = await fallbackChat.sendMessageStream(prompt);
      return {
        stream: result.stream,
        getGroundingMetadata: async () => {
          try {
            const response = await result.response;
            const candidate = response.candidates?.[0];
            if (candidate?.groundingMetadata) {
              return candidate.groundingMetadata;
            }
            return null;
          } catch {
            return null;
          }
        }
      };
    }
  } catch (finalError) {
    console.error("All models failed:", finalError);
    throw finalError;
  }
};

// Type for grounding metadata
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface GroundingMetadata {
  searchEntryPoint?: {
    renderedContent: string;
  };
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  webSearchQueries?: string[];
}
