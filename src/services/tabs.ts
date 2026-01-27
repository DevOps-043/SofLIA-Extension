export class TabService {
    static async getCurrentTabAsString() {
        // Query for the active tab in the current window
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.id) {
            throw new Error("No active tab found");
        }

        // Send message to content script
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_DOM_CONTEXT' });
            return response;
        } catch (error) {
            console.warn("Could not read DOM from tab:", error);
            // Fallback for pages where content script cannot run (e.g., refreshing, chrome:// URL)
            return {
                url: tab.url,
                title: tab.title,
                content: "[No se pudo leer el contenido de la página. Asegúrate de recargar la página si acabas de instalar la extensión]"
            };
        }
    }
}
