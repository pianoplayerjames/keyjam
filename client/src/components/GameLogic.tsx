// client/src/components/GameLogic.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../stores/gameStore'
import { useReplayStore } from '../stores/replayStore'
import { ComplexityManager, type PatternNote } from '../ComplexityManager'
import { replayRecorder } from '../ReplayRecorder'

const letters = '12345'
const channelPositions = [-2, -1, 0, 1, 2]
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0']
const baseBpm = 120

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
    incrementTotalNotes
  } = useGameStore()

  const { isRecording } = useReplayStore()

  // Note spawning state
  const randomSpawnTimer = useRef(0)
  const frameCount = useRef(0)

  // Timer state
  const timerRef = useRef(0)

  useFrame((state, delta) => {
    if (isGameOver) return

    frameCount.current++

    // Log debug info every 60 frames (about once per second)
    if (frameCount.current % 60 === 0) {
      console.log('GameLogic Debug:', {
        fallingLettersCount: fallingLetters.length,
        complexity,
        frameCount: frameCount.current
      })
    }

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

    // Note spawning logic - simplified
    randomSpawnTimer.current += delta
    const spawnInterval = 2.0 // Spawn every 2 seconds for testing
    
    if (randomSpawnTimer.current >= spawnInterval) {
      randomSpawnTimer.current = 0
      
      console.log('Attempting to spawn note...')
      
      // Always spawn a note for testing
      const channelIndex = Math.floor(Math.random() * 5)
      
      const newLetter = {
        id: Math.random(),
        letter: letters[channelIndex],
        position: [channelPositions[channelIndex], 0.02, -10] as [number, number, number], // Start closer for testing
        duration: 0,
        color: channelColors[channelIndex],
        spawnTime: state.clock.getElapsedTime(),
        opacity: 1,
        complexityType: 'normal' as const,
        wasProcessed: false,
        isMissed: false,
        isHit: false,
        isBeingHeld: false
      }
      
      console.log('Spawning note:', newLetter)
      
      setFallingLetters(prev => {
        const newLetters = [...prev, newLetter]
        console.log('New letters array:', newLetters)
        return newLetters
      })
      
      incrementTotalNotes()
    }

    // Note movement and cleanup logic - ONLY run if we have notes
    if (fallingLetters.length > 0) {
      console.log('Processing', fallingLetters.length, 'falling letters')
      
      const moveSpeed = 2 // Slower for testing
      const shrinkSpeed = 8
      let scoreToAddThisFrame = 0

      const updatedLetters = fallingLetters.map(letter => {
        const newLetter = { ...letter }

        if (newLetter.isHit) {
          const newOpacity = Math.max(0, (newLetter.opacity ?? 1) - delta * 2.5)
          newLetter.opacity = newOpacity
          newLetter.position = [
            newLetter.position[0], 
            newLetter.position[1] + delta * 1.5, 
            newLetter.position[2] + delta
          ]
          return newLetter
        }

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
          newLetter.position[2] + moveSpeed * delta
        ]

        if (newLetter.isMissed) {
          const newDuration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta)
          newLetter.duration = newDuration
        } else {
          // Check if note passed hit zone - much more lenient for testing
          if (newLetter.position[2] > 15) { // Much further back for testing
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

      // Filter out notes that are completely off-screen - very lenient
      const filteredLetters = updatedLetters.filter(letter => {
        const shouldKeep = !(letter.isMissed && letter.position[2] > 20) && 
                          !(letter.isHit && (!letter.opacity || letter.opacity <= 0))
        
        if (!shouldKeep) {
          console.log('Removing letter:', letter.letter, 'isMissed:', letter.isMissed, 'position:', letter.position[2], 'opacity:', letter.opacity)
        }
        
        return shouldKeep
      })

      console.log('After processing:', filteredLetters.length, 'letters remaining')
      
      setFallingLetters(filteredLetters)
      
      if (scoreToAddThisFrame > 0) {
        setScore(score + scoreToAddThisFrame)
      }
    }
  })

  return null
}

export default GameLogic