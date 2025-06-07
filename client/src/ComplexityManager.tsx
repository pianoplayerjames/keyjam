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
    
    // Use different curves for different difficulty aspects
    const linear = t;
    const exponential = Math.pow(t, 2);
    const steep = Math.pow(t, 3);
    const inverse = 1 - Math.pow(1 - t, 2);
    const easeIn = Math.pow(t, 1.5); // Gentler curve for easier progression
    
    // Speed curves - very slow at low levels, normal at high levels
    const speedCurve = complexity <= 20 ? this.lerp(0.3, 0.6, t * 5) : // Very slow for 1-20
                      complexity <= 40 ? this.lerp(0.6, 0.8, (t - 0.2) * 2.5) : // Slow for 21-40
                      complexity <= 60 ? this.lerp(0.8, 1.0, (t - 0.4) * 2.5) : // Normal for 41-60
                      this.lerp(1.0, 2.0, (t - 0.6) * 2.5); // Fast for 61+
    
    // BPM curve - separate from speed for independent control
    const bpmCurve = complexity <= 30 ? this.lerp(0.5, 0.7, t * 3.33) : // Much slower BPM for 1-30
                     complexity <= 60 ? this.lerp(0.7, 1.0, (t - 0.3) * 1.43) : // Normal BPM for 31-60
                     this.lerp(1.0, 1.5, (t - 0.6) * 2.5); // Faster BPM for 61+
    
    return {
      // Note spawning - much more sparse at low levels
      spawnProbability: complexity <= 10 ? this.lerp(0.05, 0.15, t * 10) : // Very sparse for 1-10
                       complexity <= 30 ? this.lerp(0.15, 0.4, (t - 0.1) * 1.11) : // Sparse for 11-30
                       this.lerp(0.4, 0.95, (t - 0.3) * 1.43), // Normal to dense for 31+
      
      maxSimultaneousNotes: complexity <= 20 ? 1 : // Only single notes for 1-20
                           complexity <= 50 ? Math.floor(this.lerp(1, 2, (t - 0.2) * 3.33)) : // Max 2 for 21-50
                           Math.floor(this.lerp(2, 5, (t - 0.5) * 2)), // Up to 5 for 51+
      
      offBeatProbability: complexity <= 40 ? 0 : // No off-beat for 1-40
                         this.lerp(0, 0.8, (t - 0.4) * 1.67), // Gradual off-beat for 41+
      
      subdivisions: this.getSubdivisions(complexity),
      subdivisionWeights: [1],
      patternComplexity: Math.floor(this.lerp(1, 10, steep)),
      
      // Speed control - much slower at low levels
      speedMultiplier: speedCurve,
      bpmMultiplier: bpmCurve,
      
      // Timing windows - MUCH more generous at low levels
      timingWindows: {
        perfect: complexity <= 20 ? this.lerp(0.4, 0.25, t * 5) : // Very generous for 1-20
                complexity <= 50 ? this.lerp(0.25, 0.15, (t - 0.2) * 3.33) : // Generous for 21-50
                this.lerp(0.15, 0.05, (t - 0.5) * 2), // Tight for 51+
        
        good: complexity <= 20 ? this.lerp(0.8, 0.5, t * 5) : // Very generous for 1-20
             complexity <= 50 ? this.lerp(0.5, 0.3, (t - 0.2) * 3.33) : // Generous for 21-50
             this.lerp(0.3, 0.1, (t - 0.5) * 2), // Tight for 51+
        
        almost: complexity <= 20 ? this.lerp(1.2, 0.8, t * 5) : // Very generous for 1-20
               complexity <= 50 ? this.lerp(0.8, 0.5, (t - 0.2) * 3.33) : // Generous for 21-50
               this.lerp(0.5, 0.15, (t - 0.5) * 2) // Tight for 51+
      },
      
      // Advanced patterns only at high complexity
      polyrhythmChance: complexity > 80 ? this.lerp(0, 0.4, (complexity - 80) / 20) : 0,
      crossHandPatterns: complexity > 70,
      rapidFireChance: complexity > 60 ? this.lerp(0, 0.3, (complexity - 60) / 40) : 0,
      
      // Hold notes - simpler at low levels
      holdNoteComplexity: complexity <= 30 ? 0 : this.lerp(0, 0.6, (t - 0.3) * 1.43),
      
      // Visual complexity
      noteVariations: Math.floor(this.lerp(1, 8, easeIn)),
      visualDistraction: complexity <= 40 ? 0 : this.lerp(0, 0.5, (t - 0.4) * 1.67),
      fadeInTime: complexity <= 30 ? this.lerp(3.0, 2.0, t * 3.33) : // Much more warning time
                  this.lerp(2.0, 0.3, (t - 0.3) * 1.43) // Normal to fast for higher levels
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

  static generatePattern(complexity: number, measures: number = 4): PatternNote[] {
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
            channels.push(Math.floor(Math.random() * 5));
          } else {
            const noteCount = Math.min(
              Math.floor(Math.random() * config.maxSimultaneousNotes) + 1,
              5
            );
            
            for (let i = 0; i < noteCount; i++) {
              const channel = Math.floor(Math.random() * 5);
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