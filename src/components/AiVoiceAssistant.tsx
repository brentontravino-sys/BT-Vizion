import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Activity, AlertCircle, PhoneCall, PhoneOff, Radio } from 'lucide-react';

export default function AiVoiceAssistant() {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Standby. Click Start Voice Session to connect to Gemini 3.8 Live.');
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: 'BT Vizion Live Voice Agent ready. Connect your microphone to discuss enterprise architecture, web design, or automation strategy in real-time.',
    },
  ]);

  // Audio Context and WebSocket refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  // Float32Array PCM to 16-bit PCM Base64
  const floatTo16BitPCMBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); // little-endian
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Base64 16-bit PCM 24kHz to AudioBuffer playback
  const playAudioChunk = (audioCtx: AudioContext, base64Pcm: string) => {
    try {
      const binaryString = atob(base64Pcm);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const dataView = new DataView(bytes.buffer);
      const sampleCount = Math.floor(len / 2);
      const float32Data = new Float32Array(sampleCount);

      for (let i = 0; i < sampleCount; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32Data[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
      }

      const audioBuffer = audioCtx.createBuffer(1, sampleCount, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      setIsTalking(true);
      source.onended = () => {
        if (audioCtx.currentTime >= nextStartTimeRef.current) {
          setIsTalking(false);
        }
      };
    } catch (err) {
      console.error('Audio chunk decoding error:', err);
    }
  };

  const startVoiceSession = async () => {
    try {
      setStatusMessage('Requesting microphone access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      setStatusMessage('Connecting to Live WebSocket server...');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Create audio contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputCtx;

      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      ws.onopen = () => {
        setIsConnected(true);
        setStatusMessage('Connected to Gemini 3.8 Live. Speak into your microphone.');

        // Setup microphone capture pipeline
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;

          const channelData = e.inputBuffer.getChannelData(0);

          // Calculate approximate volume level for waveform
          let sum = 0;
          for (let i = 0; i < channelData.length; i++) {
            sum += channelData[i] * channelData[i];
          }
          const rms = Math.sqrt(sum / channelData.length);
          setAudioLevel(Math.min(1, rms * 5));

          const base64Audio = floatTo16BitPCMBase64(channelData);
          ws.send(JSON.stringify({ audio: base64Audio }));
        };
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio && outputCtx) {
            playAudioChunk(outputCtx, data.audio);
          }
          if (data.interrupted && outputCtx) {
            // Cancel upcoming scheduled playback on interrupt
            nextStartTimeRef.current = outputCtx.currentTime;
            setIsTalking(false);
          }
          if (data.error) {
            setStatusMessage(`Live error: ${data.error}`);
          }
        } catch (err) {
          console.error('WebSocket message parsing error:', err);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setStatusMessage('Live WebSocket connection encountered an error.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsTalking(false);
        setStatusMessage('Session closed. Click start to reconnect.');
      };
    } catch (err: any) {
      console.error('Voice session startup error:', err);
      setStatusMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access in your browser.'
          : `Error connecting: ${err.message || 'Check microphone & network.'}`
      );
    }
  };

  const stopVoiceSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsTalking(false);
    setAudioLevel(0);
    setStatusMessage('Session disconnected.');
  };

  return (
    <div className="w-full bg-[#0d0d0f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isConnected
            ? isTalking
              ? 'bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,transparent_70%)]'
              : 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]'
        }`}
      />

      {/* Model & Live Status Badges */}
      <div className="flex items-center space-x-2.5 mb-6 z-10">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-white/15 text-xs font-mono text-neutral-300">
          <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>MODEL: gemini-3.8-live</span>
        </div>
        <div
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
              : 'bg-neutral-900 border-white/10 text-neutral-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-400 animate-ping' : 'bg-neutral-500'
            }`}
          />
          <span>{isConnected ? (isTalking ? 'Agent Speaking' : 'Listening...') : 'Disconnected'}</span>
        </div>
      </div>

      {/* Main Interactive Wave Orb */}
      <div className="relative my-6 flex items-center justify-center z-10">
        {/* Pulsing outer ripples */}
        {isConnected && (
          <>
            <motion.div
              animate={{
                scale: isTalking ? [1, 1.35, 1] : [1, 1.15, 1],
                opacity: [0.15, 0.4, 0.15],
              }}
              transition={{ repeat: Infinity, duration: isTalking ? 1.2 : 2.2, ease: 'easeInOut' }}
              className={`absolute w-44 h-44 rounded-full ${
                isTalking ? 'bg-blue-500/30' : 'bg-emerald-500/20'
              }`}
            />
            <motion.div
              animate={{
                scale: isTalking ? [1, 1.6, 1] : [1, 1.3, 1],
                opacity: [0.08, 0.25, 0.08],
              }}
              transition={{ repeat: Infinity, duration: isTalking ? 1.8 : 3.0, ease: 'easeInOut' }}
              className={`absolute w-56 h-56 rounded-full ${
                isTalking ? 'bg-indigo-500/20' : 'bg-teal-500/15'
              }`}
            />
          </>
        )}

        {/* Central Orb Button */}
        <button
          type="button"
          onClick={isConnected ? stopVoiceSession : startVoiceSession}
          className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl border ${
            isConnected
              ? isTalking
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.5)]'
                : 'bg-neutral-900 text-white border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              : 'bg-neutral-900 hover:bg-neutral-800 text-white border-white/20 hover:border-white/40'
          }`}
        >
          {isConnected ? (
            isTalking ? (
              <Volume2 className="w-10 h-10 animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 text-emerald-400" />
            )
          ) : (
            <Mic className="w-10 h-10 text-neutral-400 group-hover:text-white" />
          )}
          <span className="text-[10px] uppercase font-mono tracking-widest mt-1">
            {isConnected ? 'End Call' : 'Start Call'}
          </span>
        </button>
      </div>

      {/* Voice Dynamic Visualizer Bars */}
      <div className="flex items-center justify-center space-x-1.5 h-8 my-2 z-10">
        {[0.4, 0.8, 1.2, 0.6, 1.5, 0.9, 1.3, 0.7, 1.1, 0.5].map((scale, i) => {
          const height = isConnected
            ? isTalking
              ? Math.sin(Date.now() / 200 + i) * 14 + 16
              : Math.max(4, audioLevel * 32 * scale)
            : 4;
          return (
            <motion.span
              key={i}
              className={`w-1 rounded-full transition-all duration-75 ${
                isConnected
                  ? isTalking
                    ? 'bg-blue-400'
                    : 'bg-emerald-400'
                  : 'bg-white/10'
              }`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Status description */}
      <p className="text-xs text-neutral-400 font-mono mt-3 max-w-md z-10">
        {statusMessage}
      </p>

      {/* Session Controls bar */}
      {isConnected && (
        <div className="flex items-center space-x-3 mt-6 z-10">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              isMuted
                ? 'bg-red-950/60 border-red-500/50 text-red-300'
                : 'bg-neutral-900 border-white/15 text-neutral-200 hover:text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
          </button>

          <button
            type="button"
            onClick={stopVoiceSession}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        </div>
      )}

      {/* Technical Spec callout */}
      <div className="mt-8 pt-6 border-t border-white/10 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs z-10">
        <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-xl">
          <div className="text-neutral-400 text-[10px] font-mono uppercase">Audio Capture</div>
          <div className="text-white font-semibold mt-0.5">16kHz 16-bit PCM</div>
          <div className="text-[11px] text-neutral-400 mt-1">Direct microphone stream</div>
        </div>
        <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-xl">
          <div className="text-neutral-400 text-[10px] font-mono uppercase">Model Architecture</div>
          <div className="text-white font-semibold mt-0.5">gemini-3.8-live</div>
          <div className="text-white text-[11px] mt-1">Full-duplex real-time audio</div>
        </div>
        <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-xl">
          <div className="text-neutral-400 text-[10px] font-mono uppercase">Playback Stream</div>
          <div className="text-white font-semibold mt-0.5">24kHz Scheduled PCM</div>
          <div className="text-[11px] text-neutral-400 mt-1">Gapless audio buffering</div>
        </div>
      </div>
    </div>
  );
}
