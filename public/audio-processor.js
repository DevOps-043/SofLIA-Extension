// AudioWorklet Processor for microphone capture
// Runs on the audio rendering thread for low-latency processing

class AudioCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._bufferSize = 4096;
    this._buffer = new Float32Array(this._bufferSize);
    this._bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const channelData = input[0]; // mono channel
    if (!channelData) return true;

    // Accumulate samples into buffer
    for (let i = 0; i < channelData.length; i++) {
      this._buffer[this._bufferIndex++] = channelData[i];

      if (this._bufferIndex >= this._bufferSize) {
        // Buffer full, send to main thread
        this.port.postMessage({
          type: 'audio-data',
          audioData: this._buffer.slice()
        });
        this._bufferIndex = 0;
      }
    }

    return true; // Keep processor alive
  }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);
