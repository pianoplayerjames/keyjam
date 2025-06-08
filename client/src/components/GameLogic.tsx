// client/src/components/GameLogic.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../stores/gameStore'
import { useReplayStore } from '../stores/replayStore'
import { ComplexityManager, type PatternNote } from '../ComplexityManager'
import { replayRecorder } from '../replays/ReplayRecorder'

const letters = '12345'
const channelPositions = [-2, -1, 0, 1, 2]
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0']

const GameLogic = () => {
  const {
    gameConfig,
    complexity,
    health,
    combo,
    score,
    timeLeft,
    isGameOver,
    fallingLetters,
    heldKeys,
    setFallingLetters,
    setScore,
    setCombo,
    setHealth,
    setTimeLeft,
    setHitFeedback,
    incrementMissedNotes,
    incrementTotalNotesProcessed,
    incrementTotalNotes,
    setComplexity
  } = useGameStore()

  const { isRecording } = useReplayStore()

  // Note spawning state
  const lastSpawnTime = useRef(0)
  const frameCount = useRef(0)
  const patternPosition = useRef(0)
  const generatedPattern = useRef<PatternNote[]>([])

  // Timer state
  const timerRef = useRef(0)

  // Initialize complexity from game config
  const initComplexity = useRef(false)
  if (!initComplexity.current && gameConfig.difficulty > 0) {
    setComplexity(gameConfig.difficulty)
    initComplexity.current = true
    console.log('Setting complexity to:', gameConfig.difficulty)
  }

  // Generate pattern if needed
  if (generatedPattern.current.length === 0 && complexity > 0) {
    generatedPattern.current = ComplexityManager.generatePattern(complexity, 8)
    console.log('Generated pattern with', generatedPattern.current.length, 'notes at complexity', complexity)
  }

  useFrame((state, delta) => {
    if (isGameOver) return

    frameCount.current++

    // Record frame update for replay
    if (isRecording) {
      replayRecorder.updateFrame()
    }

    // Update timer for time-based modes
    const isTimeMode = gameConfig.subMode === 'time' || gameConfig.mode === 'career'
    const isEndlessMode = gameConfig.timeLimit === -1
    
    if (isTimeMode && !isEndlessMode && timeLeft > 0) {
      timerRef.current += delta
      if (timerRef.current >= 1.0) {
        setTimeLeft(timeLeft - 1)
        timerRef.current = 0
      }
    }

    // Get complexity config
    const config = ComplexityManager.getConfig(complexity)
    
    // Calculate spawn timing based on complexity
    const bpm = 120 * config.bpmMultiplier
    const beatInterval = 60 / bpm // seconds per beat
    const spawnInterval = beatInterval / 2 // spawn notes more frequently
    
    // Pattern-based note spawning
    const currentTime = state.clock.getElapsedTime()
    if (currentTime - lastSpawnTime.current >= spawnInterval && generatedPattern.current.length > 0) {
      const note = generatedPattern.current[patternPosition.current % generatedPattern.current.length]
      
      // Spawn probability check
      if (Math.random() < config.spawnProbability) {
        // Create notes for each channel in the pattern note
        note.channels.forEach(channelIndex => {
          if (channelIndex >= 0 && channelIndex < 5) {
            const newLetter = {
              id: Math.random(),
              letter: letters[channelIndex],
              position: [channelPositions[channelIndex], 0.02, -40] as [number, number, number],
              duration: note.duration || 0,
              color: channelColors[channelIndex],
              spawnTime: currentTime,
              opacity: 1,
              complexityType: note.type || 'normal' as const,
              wasProcessed: false,
              isMissed: false,
              isHit: false,
              isBeingHeld: false
            }
            
            setFallingLetters(prev => [...prev, newLetter])
            incrementTotalNotes()
          }
        })
      }
      
      lastSpawnTime.current = currentTime
      patternPosition.current++
    }

    // Note movement and cleanup logic
    if (fallingLetters.length > 0) {
      // Calculate movement speed based on complexity
      const baseSpeed = 4 // Base units per second
      const moveSpeed = baseSpeed * config.speedMultiplier
      const actualMoveSpeed = moveSpeed * delta // Units per frame
      
      const shrinkSpeed = 8
      let scoreToAddThisFrame = 0

      const updatedLetters = fallingLetters.map(letter => {
        const newLetter = { ...letter }

        // Handle hit letters
        if (newLetter.isHit) {
          const newOpacity = Math.max(0, (newLetter.opacity ?? 1) - delta * 2.5)
          newLetter.opacity = newOpacity
          newLetter.position = [
            newLetter.position[0], 
            newLetter.position[1] + delta * 1.5, 
            newLetter.position[2] + actualMoveSpeed
          ]
          return newLetter
        }

        // Handle held letters
        if (newLetter.isBeingHeld) {
          if (heldKeys.has(newLetter.letter)) {
            scoreToAddThisFrame += 25 * delta
            const newDuration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta)
            newLetter.duration = newDuration
          } else {
            newLetter.isBeingHeld = false
          }
          return newLetter
        }

        // Move the note forward
        newLetter.position = [
          newLetter.position[0], 
          newLetter.position[1], 
          newLetter.position[2] + actualMoveSpeed
        ]

        // Handle missed letters
        if (newLetter.isMissed) {
          const newDuration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta)
          newLetter.duration = newDuration
        } else {
          // Check if note passed hit zone (more reasonable distance)
          if (newLetter.position[2] > 8) { // Much closer miss threshold
            if (!newLetter.wasProcessed) {
              console.log('Note missed:', newLetter.letter, 'at position', newLetter.position[2])
              setHitFeedback({ text: 'MISSED', color: '#f44336', key: Date.now() })
              setCombo(0)
              incrementMissedNotes()
              incrementTotalNotesProcessed()
              newLetter.wasProcessed = true
              const healthPenalty = 10
              setHealth(health - healthPenalty)
            }
            newLetter.isMissed = true
          }
        }

        return newLetter
      })

      // Filter out notes that are completely off-screen
      const filteredLetters = updatedLetters.filter(letter => {
        const shouldKeep = !(letter.isMissed && letter.position[2] > 15) && 
                          !(letter.isHit && (!letter.opacity || letter.opacity <= 0))
        return shouldKeep
      })

      setFallingLetters(filteredLetters)
      
      if (scoreToAddThisFrame > 0) {
        setScore(score + scoreToAddThisFrame)
      }
    }

    // Debug logging every 2 seconds
    if (frameCount.current % 120 === 0) {
      console.log('GameLogic Debug:', {
        complexity,
        configComplexity: gameConfig.difficulty,
        fallingLettersCount: fallingLetters.length,
        config: {
          spawnProbability: config.spawnProbability,
          speedMultiplier: config.speedMultiplier,
          bpmMultiplier: config.bpmMultiplier
        },
        actualMoveSpeed: 4 * config.speedMultiplier * delta,
        patternLength: generatedPattern.current.length
      })
    }
  })

  return null
}

export default GameLogic