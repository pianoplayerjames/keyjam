// client/src/ComplexityManager.tsx
interface ComplexityConfig {
  spawnProbability: number;
  maxSimultaneousNotes: number;
  offBeatProbability: number;
  subdivisions: number[];
  subdivisionWeights: number[];
  patternComplexity: number;
  speedMultiplier: number;
  bpmMultiplier: number; // New: separate BPM control
  timingWindows: {
    perfect: number;
    good: number;
    almost: number;
  };
  polyrhythmChance: number;
  crossHandPatterns: boolean;
  rapidFireChance: number;
  holdNoteComplexity: number;
  noteVariations: number;
  visualDistraction: number;
  fadeInTime: number;
}

interface PatternNote {
  channels: number[];
  timing: number;
  type: 'normal' | 'chord' | 'rapid' | 'cross' | 'polyrhythm' | 'syncopated' | 'hold';
  duration?: number;
}

class ComplexityManager {
  private static configs: { [key: number]: ComplexityConfig } = {};

  static getConfig(complexity: number): ComplexityConfig {
    complexity = Math.max(1, Math.min(100, complexity));
    
    if (!this.configs[complexity]) {
      this.configs[complexity] = this.generateConfig(complexity);
    }
    
    return this.configs[complexity];
  }

private static generateConfig(complexity: number): ComplexityConfig {
    const t = (complexity - 1) / 99;
    
    const linear = t;
    const exponential = Math.pow(t, 2);
    const steep = Math.pow(t, 3);
    const inverse = 1 - Math.pow(1 - t, 2);
    const easeIn = Math.pow(t, 1.5);
    
    const speedCurve = complexity <= 20 ? this.lerp(0.3, 0.6, t * 5) : 
                      complexity <= 40 ? this.lerp(0.6, 0.8, (t - 0.2) * 2.5) : 
                      complexity <= 60 ? this.lerp(0.8, 1.0, (t - 0.4) * 2.5) : 
                      this.lerp(1.0, 2.0, (t - 0.6) * 2.5);
    
    const bpmCurve = complexity <= 30 ? this.lerp(0.5, 0.7, t * 3.33) : 
                     complexity <= 60 ? this.lerp(0.7, 1.0, (t - 0.3) * 1.43) : 
                     this.lerp(1.0, 1.5, (t - 0.6) * 2.5);
    
    return {
      spawnProbability: complexity <= 10 ? this.lerp(0.3, 0.5, t * 10) : 
                       complexity <= 30 ? this.lerp(0.5, 0.6, (t - 0.1) * 1.11) : 
                       this.lerp(0.6, 0.95, (t - 0.3) * 1.43),
      
      maxSimultaneousNotes: complexity <= 20 ? 1 : 
                           complexity <= 50 ? Math.floor(this.lerp(1, 2, (t - 0.2) * 3.33)) : 
                           Math.floor(this.lerp(2, 5, (t - 0.5) * 2)),
      
      offBeatProbability: complexity <= 40 ? 0 : 
                         this.lerp(0, 0.8, (t - 0.4) * 1.67),
      
      subdivisions: this.getSubdivisions(complexity),
      subdivisionWeights: [1],
      patternComplexity: Math.floor(this.lerp(1, 10, steep)),
      
      speedMultiplier: speedCurve,
      bpmMultiplier: bpmCurve,
      
      timingWindows: {
        perfect: complexity <= 20 ? this.lerp(0.4, 0.25, t * 5) : 
                complexity <= 50 ? this.lerp(0.25, 0.15, (t - 0.2) * 3.33) : 
                this.lerp(0.15, 0.05, (t - 0.5) * 2),
        
        good: complexity <= 20 ? this.lerp(0.8, 0.5, t * 5) : 
             complexity <= 50 ? this.lerp(0.5, 0.3, (t - 0.2) * 3.33) : 
             this.lerp(0.3, 0.1, (t - 0.5) * 2),
        
        almost: complexity <= 20 ? this.lerp(1.2, 0.8, t * 5) : 
               complexity <= 50 ? this.lerp(0.8, 0.5, (t - 0.2) * 3.33) : 
               this.lerp(0.5, 0.15, (t - 0.5) * 2)
      },
      
      polyrhythmChance: complexity > 80 ? this.lerp(0, 0.4, (complexity - 80) / 20) : 0,
      crossHandPatterns: complexity > 70,
      rapidFireChance: complexity > 60 ? this.lerp(0, 0.3, (complexity - 60) / 40) : 0,
      
      holdNoteComplexity: complexity <= 30 ? 0 : this.lerp(0, 0.6, (t - 0.3) * 1.43),
      
      noteVariations: Math.floor(this.lerp(1, 8, easeIn)),
      visualDistraction: complexity <= 40 ? 0 : this.lerp(0, 0.5, (t - 0.4) * 1.67),
      fadeInTime: complexity <= 30 ? this.lerp(3.0, 2.0, t * 3.33) : 
                  this.lerp(2.0, 0.3, (t - 0.3) * 1.43)
    };
  }

  private static getSubdivisions(complexity: number): number[] {
    if (complexity <= 15) return [2, 4]; // Only whole and half notes for 1-15
    if (complexity <= 30) return [1, 2]; // Whole and half notes for 16-30
    if (complexity <= 50) return [1, 0.5]; // Add quarter notes for 31-50
    if (complexity <= 70) return [1, 0.5, 0.25]; // Add eighth notes for 51-70
    if (complexity <= 85) return [1, 0.5, 0.25, 0.125]; // Add sixteenth notes for 71-85
    return [1, 0.5, 0.25, 0.125, 0.0625, 1/3, 1/6]; // All subdivisions for 86+
  }

  private static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  }

  static generatePattern(complexity: number, measures: number = 4, lanes: number = 5): PatternNote[] {
    const pattern: PatternNote[] = [];
    const config = this.getConfig(complexity);
    
    // Much simpler patterns for low complexity
    for (let measure = 0; measure < measures; measure++) {
      const beatsPerMeasure = complexity <= 10 ? 2 : 4; // Fewer beats for very easy
      
      for (let beat = 0; beat < beatsPerMeasure; beat++) {
        const beatTime = measure * beatsPerMeasure + beat;
        
        // Very low spawn probability for easy levels
        const spawnChance = complexity <= 10 ? 0.3 : 
                           complexity <= 20 ? 0.4 :
                           complexity <= 40 ? 0.5 :
                           config.spawnProbability;
        
        if (Math.random() < spawnChance) {
          const channels = [];
          
          // Single notes only for low complexity
          if (complexity <= 40) {
            channels.push(Math.floor(Math.random() * lanes));
          } else {
            const noteCount = Math.min(
              Math.floor(Math.random() * config.maxSimultaneousNotes) + 1,
              lanes
            );
            
            for (let i = 0; i < noteCount; i++) {
              const channel = Math.floor(Math.random() * lanes);
              if (!channels.includes(channel)) {
                channels.push(channel);
              }
            }
          }
          
          if (channels.length > 0) {
            pattern.push({
              channels,
              timing: beatTime,
              type: channels.length > 1 ? 'chord' : 'normal'
            });
          }
        }
      }
    }
    
    return pattern;
  }
}

export { ComplexityManager, type ComplexityConfig, type PatternNote };