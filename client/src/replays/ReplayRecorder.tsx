// ReplayRecorder.tsx
import { useRef, useCallback } from 'react';

export interface GameEvent {
  timestamp: number;
  frame: number;
  type: 'keydown' | 'keyup' | 'note_hit' | 'note_miss' | 'note_spawn' | 'score_change' | 'combo_change' | 'health_change';
  data: any;
}

export interface GameState {
  timestamp: number;
  frame: number;
  score: number;
  combo: number;
  health: number;
  fallingLetters: any[];
  heldKeys: string[];
  moveSpeed: number;
  complexity: number;
}

export interface ReplayData {
  version: string;
  gameConfig: any;
  startTime: number;
  endTime: number;
  duration: number;
  events: GameEvent[];
  keyframes: GameState[];
  metadata: {
    finalScore: number;
    maxCombo: number;
    totalNotes: number;
    accuracy: number;
  };
}

class ReplayRecorder {
  private events: GameEvent[] = [];
  private keyframes: GameState[] = [];
  private isRecording = false;
  private startTime = 0;
  private frameCount = 0;
  private keyframeInterval = 300; // Save keyframe every 300 frames (5 seconds at 60fps)
  
  startRecording(gameConfig: any): void {
    this.events = [];
    this.keyframes = [];
    this.isRecording = true;
    this.startTime = performance.now();
    this.frameCount = 0;
    
    console.log('🎬 Replay recording started');
  }

  stopRecording(metadata: any): ReplayData {
    this.isRecording = false;
    const endTime = performance.now();
    
    const replayData: ReplayData = {
      version: '1.0.0',
      gameConfig: metadata.gameConfig,
      startTime: this.startTime,
      endTime,
      duration: endTime - this.startTime,
      events: [...this.events],
      keyframes: [...this.keyframes],
      metadata: {
        finalScore: metadata.finalScore,
        maxCombo: metadata.maxCombo,
        totalNotes: metadata.totalNotes,
        accuracy: metadata.accuracy
      }
    };
    
    console.log('🎬 Replay recording stopped', {
      duration: Math.round(replayData.duration / 1000) + 's',
      events: this.events.length,
      keyframes: this.keyframes.length,
      size: Math.round(JSON.stringify(replayData).length / 1024) + 'KB'
    });
    
    return replayData;
  }

  recordEvent(type: GameEvent['type'], data: any): void {
    if (!this.isRecording) return;
    
    const event: GameEvent = {
      timestamp: performance.now() - this.startTime,
      frame: this.frameCount,
      type,
      data: JSON.parse(JSON.stringify(data)) // Deep clone to avoid reference issues
    };
    
    this.events.push(event);
  }

  recordKeyframe(gameState: Omit<GameState, 'timestamp' | 'frame'>): void {
    if (!this.isRecording) return;
    
    const keyframe: GameState = {
      timestamp: performance.now() - this.startTime,
      frame: this.frameCount,
      ...JSON.parse(JSON.stringify(gameState)) // Deep clone
    };
    
    this.keyframes.push(keyframe);
  }

  updateFrame(): void {
    if (!this.isRecording) return;
    this.frameCount++;
  }

  shouldSaveKeyframe(): boolean {
    return this.frameCount % this.keyframeInterval === 0;
  }

  getRecordingStats() {
    return {
      isRecording: this.isRecording,
      events: this.events.length,
      keyframes: this.keyframes.length,
      frames: this.frameCount,
      duration: this.isRecording ? performance.now() - this.startTime : 0
    };
  }
}

export const replayRecorder = new ReplayRecorder();