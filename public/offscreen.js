// Offscreen document for audio capture in Chrome Extension Manifest V3
// This runs in a separate context that has access to getUserMedia
// Uses AudioWorkletNode (modern API) with ScriptProcessorNode fallback

console.log('Soflia Offscreen Audio Worker loaded');

let mediaStream = null;
let audioContext = null;
let workletNode = null;
let processorNode = null; // fallback
let isCapturing = false;

// Handle messages from the service worker/popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  switch (message.action) {
    case 'start-audio-capture':
      startCapture()
        .then(() => sendResponse({ success: true }))
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true; // Keep channel open for async response

    case 'stop-audio-capture':
      stopCapture();
      sendResponse({ success: true });
      break;

    case 'ping':
      sendResponse({ alive: true, capturing: isCapturing });
      break;
  }
});

/**
 * Convert Float32 audio buffer to base64 PCM Int16 at 16kHz
 */
function float32ToBase64PCM(inputData, nativeSampleRate) {
  const resamplerRatio = nativeSampleRate / 16000;

  // Resample to 16kHz if needed
  let resampledData;
  if (resamplerRatio !== 1) {
    const outputLength = Math.floor(inputData.length / resamplerRatio);
    resampledData = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const srcIndex = Math.floor(i * resamplerRatio);
      resampledData[i] = inputData[srcIndex];
    }
  } else {
    resampledData = inputData;
  }

  // Convert Float32 to Int16 PCM
  const pcmData = new Int16Array(resampledData.length);
  for (let i = 0; i < resampledData.length; i++) {
    const s = Math.max(-1, Math.min(1, resampledData[i]));
    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  // Convert to base64
  const bytes = new Uint8Array(pcmData.buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

let audioChunkCount = 0;

function sendAudioChunk(base64) {
  audioChunkCount++;
  // Log every 20th chunk to avoid console spam
  if (audioChunkCount % 20 === 1) {
    console.log('Offscreen: Sending audio chunk #' + audioChunkCount + ', size:', base64.length);
  }

  chrome.runtime.sendMessage({
    type: 'OFFSCREEN_AUDIO_DATA',
    data: base64
  }).catch((err) => {
    if (err?.message && !err.message.includes('Receiving end does not exist')) {
      console.warn('Offscreen: Failed to send audio:', err.message);
    }
  });
}

async function startCapture() {
  if (isCapturing) {
    console.log('Already capturing');
    return;
  }

  try {
    // Request microphone access
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // Create audio context
    audioContext = new AudioContext();
    const nativeSampleRate = audioContext.sampleRate;
    console.log('Offscreen: Native sample rate:', nativeSampleRate);

    const source = audioContext.createMediaStreamSource(mediaStream);
    audioChunkCount = 0;

    // Try AudioWorkletNode first (modern, non-deprecated)
    let useWorklet = false;
    try {
      await audioContext.audioWorklet.addModule('audio-processor.js');
      workletNode = new AudioWorkletNode(audioContext, 'audio-capture-processor');

      workletNode.port.onmessage = (event) => {
        if (!isCapturing) return;
        if (event.data.type === 'audio-data') {
          const base64 = float32ToBase64PCM(event.data.audioData, nativeSampleRate);
          sendAudioChunk(base64);
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioContext.destination);
      useWorklet = true;
      console.log('Offscreen: Using AudioWorkletNode (modern API)');
    } catch (workletErr) {
      console.warn('Offscreen: AudioWorklet not available, falling back to ScriptProcessorNode:', workletErr.message);
    }

    // Fallback to ScriptProcessorNode if AudioWorklet fails
    if (!useWorklet) {
      const bufferSize = 4096;
      processorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

      processorNode.onaudioprocess = (e) => {
        if (!isCapturing) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const base64 = float32ToBase64PCM(inputData, nativeSampleRate);
        sendAudioChunk(base64);
      };

      source.connect(processorNode);
      processorNode.connect(audioContext.destination);
      console.log('Offscreen: Using ScriptProcessorNode (fallback)');
    }

    isCapturing = true;
    console.log('Offscreen: Audio capture started successfully');

  } catch (err) {
    console.error('Offscreen: Failed to start audio capture:', err);
    throw err;
  }
}

function stopCapture() {
  isCapturing = false;

  if (workletNode) {
    workletNode.disconnect();
    workletNode = null;
  }

  if (processorNode) {
    processorNode.disconnect();
    processorNode = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  console.log('Offscreen: Audio capture stopped');
}
