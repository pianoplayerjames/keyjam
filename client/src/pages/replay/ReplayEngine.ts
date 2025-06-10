// client/src/ReplayEngine.ts
import { GameEvent, ReplayData } from './ReplayRecorder';

export class ReplayEngine {
  private replayData: ReplayData;
  private currentFrame = 0;
  private currentEventIndex = 0;
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private onStateUpdate: ((state: any) => void) | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private targetFrameTime = 1000 / 60; // 60 FPS

  constructor(replayData: ReplayData) {
    this.replayData = replayData;
    this.initializeGameState();
  }

  setStateUpdateCallback(callback: (state: any) => void): void {
    this.onStateUpdate = callback;
    this.initializeGameState();
  }

  play(): void {
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.tick();
  }

  pause(): void {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop(): void {
    this.pause();
    this.seekToFrame(0);
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
  }

  seekToFrame(frame: number): void {
    const wasPlaying = this.isPlaying;
    this.pause();
    
    this.currentFrame = Math.max(0, Math.min(frame, this.getMaxFrame()));
    this.currentEventIndex = 0;
    this.initializeGameState();
    
    while (
      this.currentEventIndex < this.replayData.events.length &&
      this.replayData.events[this.currentEventIndex].frame <= this.currentFrame
    ) {
      this.applyEvent(this.replayData.events[this.currentEventIndex]);
      this.currentEventIndex++;
    }
    
    this.updateState();
    
    if (wasPlaying) {
      this.play();
    }
  }

  seekToTime(timeMs: number): void {
    const frame = Math.floor((timeMs / 1000) * 60); // Assuming 60 FPS
    this.seekToFrame(frame);
  }

  private tick = (): void => {
    if (!this.isPlaying) return;

    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    const adjustedFrameTime = this.targetFrameTime / this.playbackSpeed;

    if (deltaTime >= adjustedFrameTime) {
      this.advanceFrame();
      this.lastFrameTime = now - (deltaTime % adjustedFrameTime);
    }

    if (this.currentFrame < this.getMaxFrame()) {
      this.animationFrameId = requestAnimationFrame(this.tick);
    } else {
      this.pause();
    }
  };

  private advanceFrame(): void {
    this.currentFrame++;
    
    while (
      this.currentEventIndex < this.replayData.events.length &&
      this.replayData.events[this.currentEventIndex].frame <= this.currentFrame
    ) {
      this.applyEvent(this.replayData.events[this.currentEventIndex]);
      this.currentEventIndex++;
    }

    this.updateState();
  }

  private applyEvent(event: GameEvent): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({ type: 'apply_event', event });
    }
  }

  private initializeGameState(): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'initialize',
        data: {
          difficulty: this.replayData.gameConfig.difficulty,
          timeLimit: this.replayData.gameConfig.timeLimit
        }
      });
    }
  }

  private updateState(): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'update_frame',
        frame: this.currentFrame,
        time: (this.currentFrame / 60) * 1000
      });
    }
  }

  getMaxFrame(): number {
    if (this.replayData.events.length === 0) return 0;
    return Math.max(...this.replayData.events.map(event => event.frame));
  }

  getCurrentFrame(): number {
    return this.currentFrame;
  }

  getCurrentTime(): number {
    return (this.currentFrame / 60) * 1000;
  }

  getDuration(): number {
    return this.replayData.duration;
  }
  
  getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}