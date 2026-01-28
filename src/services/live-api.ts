
import { GOOGLE_API_KEY, LIVE_API_URL } from "../config";

export class LiveClient {
  private ws: WebSocket | null = null;
  private onMessage: (data: any) => void;
  private onError: (error: any) => void;
  private onClose: () => void;
  private isConnected: boolean = false;

  constructor(
    onMessage: (data: any) => void,
    onError: (error: any) => void,
    onClose: () => void
  ) {
    this.onMessage = onMessage;
    this.onError = onError;
    this.onClose = onClose;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = `${LIVE_API_URL}?key=${GOOGLE_API_KEY}`;
        this.ws = new WebSocket(url);

        const timeout = setTimeout(() => {
          if (!this.isConnected) {
            this.ws?.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000);

        this.ws.onopen = () => {
          console.log("Live API Connected");
          clearTimeout(timeout);
          this.isConnected = true;
          
          // Initial Setup - using gemini-2.0-flash-exp as specified
          this.send({
            setup: {
              model: "models/gemini-2.0-flash-exp",
              generationConfig: {
                responseModalities: ["TEXT"]
              }
            }
          });
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            if (event.data instanceof Blob) {
              this.onMessage(event.data);
              return;
            }

            const data = JSON.parse(event.data);
            this.onMessage(data);
          } catch (e) {
            console.error("Error parsing Live API message", e);
          }
        };

        this.ws.onerror = (error) => {
          console.error("Live API Error", error);
          clearTimeout(timeout);
          this.isConnected = false;
          this.onError(error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("Live API Closed");
          this.isConnected = false;
          this.onClose();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not ready, message not sent");
    }
  }
  
  sendAudioChunk(base64Audio: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        realtimeInput: {
          mediaChunks: [{
            mimeType: "audio/pcm",
            data: base64Audio
          }]
        }
      });
    }
  }

  isReady(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect() {
    this.isConnected = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
