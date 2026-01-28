
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
  navigationTool,
];


// Model Instances
const primaryModel = genAI.getGenerativeModel({
  model: MODELS.PRIMARY,
  tools: primaryTools,
});

// Computer Use Model - para acciones en página (sin Google Search para evitar conflictos)
const computerUseModel = genAI.getGenerativeModel({
  model: MODELS.COMPUTER_USE,
});

// Helper para detectar si necesita Computer Use (acciones en página)
const needsComputerUse = (prompt: string): boolean => {
  const keywords = [
    // Acciones de click
    'click', 'clic', 'pulsa', 'presiona', 'haz click', 'haz clic', 'dale click',
    // Acciones de escritura
    'escribe', 'type', 'escribir', 'teclea', 'pon', 'ingresa',
    // Acciones de scroll
    'scroll', 'desplaza', 'baja', 'sube',
    // Acciones de selección
    'selecciona', 'marca', 'desmarca', 'elige',
    // Acciones de formulario
    'rellena', 'completa el formulario',
    // Navegación en página
    'llévame', 'llevame', 'ir a', 've a', 'abre', 'abrir', 'visita', 'entra',
    'navega', 'muévete', 'muevete', 'dirígete', 'dirigete',
    // Interacción general
    'interactúa', 'interactua', 'hazlo', 'ejecuta'
  ];
  const lowerPrompt = prompt.toLowerCase();
  return keywords.some(k => lowerPrompt.includes(k));
};

// Image Generation Model - just get the model without special config
const imageGenerationModel = genAI.getGenerativeModel({ 
  model: MODELS.IMAGE_GENERATION,
});

// Deep Research Model
const deepResearchModel = genAI.getGenerativeModel({ 
  model: MODELS.DEEP_RESEARCH,
  tools: primaryTools,
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

export const sendMessageStream = async (message: string, context?: string) => {
  if (!chatSession) {
    startChatSession();
  }

  // Detectar si necesita interacción con la página (Computer Use)
  const useComputerUse = needsComputerUse(message);

  console.log('=== GEMINI SERVICE ===');
  console.log('Mensaje recibido:', message);
  console.log('¿Necesita Computer Use?:', useComputerUse);
  console.log('Modelo a usar:', useComputerUse ? MODELS.COMPUTER_USE : MODELS.PRIMARY);

  let prompt = message;
  if (context) {
    let systemPrompt: string;

    if (useComputerUse) {
      // Prompt para COMPUTER USE - con acciones [ACTION:...], sin Google Search
      systemPrompt = `Eres Lia, un asistente que CONTROLA el navegador del usuario. DEBES EJECUTAR acciones, NO solo describirlas.

## COMANDOS DE ACCIÓN (se ejecutan automáticamente):
- [ACTION:click:INDEX] - Click en elemento
- [ACTION:type:INDEX:texto] - Escribir texto
- [ACTION:scroll:INDEX] - Scroll hacia elemento

## REGLAS CRÍTICAS:
1. EJECUTA la acción INMEDIATAMENTE. NO analices, NO planifiques, NO describas - HAZLO.
2. Busca el elemento en el contexto DOM por su índice [0], [1], [2]...
3. Responde CORTO: "Hecho. [ACTION:click:X]" o similar.
4. Si te piden ir a algún lugar de la página, haz CLICK en el enlace/botón correspondiente.

## Ejemplos de respuestas CORRECTAS:
- Usuario: "Llévame al correo" → "Abriendo tu correo [ACTION:click:37]"
- Usuario: "Haz click en buscar" → "Listo [ACTION:click:5]"
- Usuario: "Escribe hola" → "Escribiendo [ACTION:type:3:hola]"

## Ejemplos de respuestas INCORRECTAS (NO hagas esto):
- "Voy a analizar la página..."
- "El plan sería hacer click en..."
- "Podría usar open_url para..."

## Contexto DOM (elementos con índices):
${context}

## Usuario:`;
    } else {
      // Prompt para MODELO PRIMARIO - con Google Search, sin acciones [ACTION:...]
      systemPrompt = `Eres Lia, un asistente de productividad amigable integrado en un navegador web.

## Tu Personalidad:
- Eres amable, profesional y concisa
- Respondes en español a menos que te pidan otro idioma
- Das respuestas directas y útiles sin información innecesaria
- SIEMPRE usa Google Search para fundamentar tus respuestas con fuentes actualizadas

## Reglas IMPORTANTES:
1. Tienes la capacidad de NAVEGAR a sitios web usando la herramienta 'open_url'. Si el usuario te pide "llévame a", "abre", "ir a" o "visita" un sitio, USA la herramienta 'open_url' inmediatamente.
2. NO uses formato [ACTION:...] en tus respuestas.
3. Solo responde a lo que el usuario pregunta.
4. Busca información relevante en Google para dar respuestas completas y actualizadas.

## Contexto de la Página (solo para referencia):
${context}

## Mensaje del Usuario:`;
    }

    prompt = `${systemPrompt}\n${message}`;
  }

  if (useComputerUse) {
    console.log("Detectada acción en página, usando modelo Computer Use (gemini-2.0-flash-exp)...");
    const currentHistory = await chatSession.getHistory();
    chatSession = computerUseModel.startChat({
      history: currentHistory,
    });
  } else {
    // Asegurar que usamos el modelo primario si no necesitamos computer use
    const currentHistory = await chatSession.getHistory();
    chatSession = primaryModel.startChat({
      history: currentHistory,
      generationConfig: {
        maxOutputTokens: 2000,
      },
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
      console.warn(`Model failed, trying fallback...`, primaryError);

      // Si estamos en modo Computer Use, no usar fallback con herramientas
      const history = await chatSession.getHistory();

      // Usar modelo sin herramientas para fallback
      const simpleFallback = genAI.getGenerativeModel({
        model: MODELS.FALLBACK,
      });

      const fallbackChat = simpleFallback.startChat({
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
