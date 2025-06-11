// client/src/ui/BottomPanel/AudioVisualizer.tsx
import React, { useRef, useEffect, useState } from 'react';

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  barCount?: number;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioRef,
  isPlaying,
  barCount = 20,
  height = 32
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  const [audioContext, setAudioContext] = useState<AudioContext>();

  useEffect(() => {
    if (!audioRef.current || !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const initializeAudioContext = async () => {
      try {
        if (!audioContext) {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = context.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.8;

          const source = context.createMediaElementSource(audioRef.current!);
          source.connect(analyser);
          analyser.connect(context.destination);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          setAudioContext(context);
          analyserRef.current = analyser;
          dataArrayRef.current = dataArray;
        }

        if (audioContext && audioContext.state === 'suspended') {
          await audioContext.resume();
        }
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    initializeAudioContext();
  }, [audioRef, isPlaying, audioContext]);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !dataArrayRef.current) {
      // Draw static bars when not playing
      drawStaticBars();
      return;
    }

    const draw = () => {
      if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const dataStep = Math.floor(dataArrayRef.current.length / barCount);

      for (let i = 0; i < barCount; i++) {
        const dataIndex = i * dataStep;
        const barHeight = (dataArrayRef.current[dataIndex] / 255) * canvas.height;
        
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#ec4899'); // Pink
        gradient.addColorStop(0.5, '#8b5cf6'); // Purple
        gradient.addColorStop(1, '#06b6d4'); // Cyan

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount]);

  const drawStaticBars = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      // Create subtle static pattern
      const staticHeight = Math.random() * 8 + 2;
      const x = i * barWidth;
      const y = canvas.height - staticHeight;

      ctx.fillStyle = 'rgba(148, 163, 184, 0.3)'; // Gray with opacity
      ctx.fillRect(x, y, barWidth - 1, staticHeight);
    }
  };

  // Draw static bars on mount
  useEffect(() => {
    drawStaticBars();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={height}
      className="w-full h-full rounded"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
};