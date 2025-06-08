// client/src/components/GameLogic.tsx
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../stores/gameStore'
import { useReplayStore } from '../stores/replayStore'
import { ComplexityManager, type PatternNote } from '../ComplexityManager'
import { replayRecorder } from '../replays/ReplayRecorder'
import { songs } from '../songs/song-data';

const allLetters = '12345678';
const allChannelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#f44336', '#673ab7', '#00bcd4'];

type Letter = ReturnType<typeof useGameStore.getState>['fallingLetters'][0];

const GameLogic = () => {
  const {
    gameConfig,
    complexity,
    health,
    timeLeft,
    isGameOver,
    setFallingLetters,
    setCombo,
    setHealth,
    setTimeLeft,
    setHitFeedback,
    incrementMissedNotes,
    incrementTotalNotesProcessed,
    incrementTotalNotes,
    setComplexity,
    setIsGameOver,
    addScore,
    heldKeys,
  } = useGameStore()

  const { isRecording } = useReplayStore()

  const lastSpawnTime = useRef(0)
  const frameCount = useRef(0)
  const patternPosition = useRef(0)
  const generatedPattern = useRef<PatternNote[]>([])
  const timerRef = useRef(0)
  const initComplexity = useRef(false)

  const lanes = gameConfig.lanes || 5;
  const letters = allLetters.slice(0, lanes);
  const channelPositions = Array.from({ length: lanes }, (_, i) => i - (lanes - 1) / 2);
  const channelColors = allChannelColors.slice(0, lanes);


  if (!initComplexity.current && (gameConfig.difficulty > 0 || gameConfig.mode === 'arcade')) {
    if (gameConfig.mode === 'arcade' && gameConfig.songId) {
        const song = songs.find(s => s.id === gameConfig.songId);
        if (song) {
            setComplexity(song.difficulty);
        }
    } else {
        setComplexity(gameConfig.difficulty);
    }
    initComplexity.current = true;
  }

  if (generatedPattern.current.length === 0 && complexity > 0) {
    if (gameConfig.mode === 'arcade' && gameConfig.songId) {
        const song = songs.find(s => s.id === gameConfig.songId);
        if (song) {
            generatedPattern.current = song.pattern;
        } else {
            generatedPattern.current = ComplexityManager.generatePattern(complexity, 8);
        }
    } else {
        generatedPattern.current = ComplexityManager.generatePattern(complexity, 8, lanes);
    }
  }

  useEffect(() => {
    const isTimeBasedGame = gameConfig.subMode === 'time' || gameConfig.mode === 'career';
    const hasTimeLimit = gameConfig.timeLimit !== -1;

    if (isTimeBasedGame && hasTimeLimit && timeLeft <= 0 && !isGameOver) {
        setIsGameOver(true);
    }
  }, [timeLeft, gameConfig, isGameOver, setIsGameOver]);

  useFrame((state, delta) => {
    if (isGameOver) return

    frameCount.current++

    if (isRecording) {
      replayRecorder.updateFrame()
    }

    const isTimeMode = gameConfig.subMode === 'time' || gameConfig.mode === 'career'
    const isEndlessMode = gameConfig.timeLimit === -1
    
    if (isTimeMode && !isEndlessMode && timeLeft > 0) {
      timerRef.current += delta
      if (timerRef.current >= 1.0) {
        setTimeLeft(timeLeft - 1)
        timerRef.current = 0
      }
    }

    const config = ComplexityManager.getConfig(complexity)
    const song = gameConfig.mode === 'arcade' && gameConfig.songId ? songs.find(s => s.id === gameConfig.songId) : null;
    const bpm = song ? song.bpm : 120 * config.bpmMultiplier;
    const beatInterval = 60 / bpm
    const spawnInterval = beatInterval / 2
    
    const currentTime = state.clock.getElapsedTime()
    const newlySpawnedNotes: Letter[] = [];

    if (currentTime - lastSpawnTime.current >= spawnInterval && generatedPattern.current.length > 0) {
      const note = generatedPattern.current[patternPosition.current % generatedPattern.current.length]
      
      note.channels.forEach(channelIndex => {
        if (channelIndex >= 0 && channelIndex < lanes) {
          const newLetter: Letter = {
            id: Math.random(),
            letter: letters[channelIndex],
            position: [channelPositions[channelIndex], 0.02, -40],
            duration: note.duration || 0,
            color: channelColors[channelIndex],
            spawnTime: currentTime,
            opacity: 1,
            complexityType: note.type || 'normal',
            wasProcessed: false,
            isMissed: false,
            isHit: false,
            isBeingHeld: false
          }
          newlySpawnedNotes.push(newLetter)
          replayRecorder.recordEvent('note_spawn', { letter: newLetter });
          incrementTotalNotes()
        }
      })
      
      lastSpawnTime.current = currentTime
      patternPosition.current++
    }
    
    let scoreToAddThisFrame = 0
    const baseSpeed = 15
    const moveSpeed = baseSpeed * config.speedMultiplier
    const actualMoveSpeed = moveSpeed * delta
    const shrinkSpeed = 8

    const currentFallingLetters = useGameStore.getState().fallingLetters;
    const allNotesThisFrame = [...currentFallingLetters, ...newlySpawnedNotes];

    const updatedLetters = allNotesThisFrame.map(letter => {
      const newLetter = { ...letter }

      if (newLetter.isHit) {
        newLetter.opacity = Math.max(0, (newLetter.opacity ?? 1) - delta * 2.5)
        newLetter.position = [
          newLetter.position[0], 
          newLetter.position[1] + delta * 1.5, 
          newLetter.position[2] + actualMoveSpeed
        ]
        return newLetter
      }

      if (newLetter.isBeingHeld) {
        if (heldKeys.has(newLetter.letter)) {
          scoreToAddThisFrame += 25 * delta
          newLetter.duration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta)
        } else {
          newLetter.isBeingHeld = false
        }
        return newLetter
      }

      newLetter.position = [
        newLetter.position[0], 
        newLetter.position[1], 
        newLetter.position[2] + actualMoveSpeed
      ]

      if (newLetter.isMissed) {
        newLetter.duration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta)
      } else {
        if (newLetter.position[2] > 8) {
          if (!newLetter.wasProcessed) {
            setHitFeedback({ text: 'MISSED', color: '#f44336', key: Date.now() })
            setCombo(0)
            incrementMissedNotes()
            incrementTotalNotesProcessed()
            newLetter.wasProcessed = true
            const healthPenalty = 10
            const newHealth = health - healthPenalty;
            setHealth(newHealth)
            replayRecorder.recordEvent('note_miss', {
                noteId: newLetter.id,
                health: newHealth
            });
          }
          newLetter.isMissed = true
        }
      }

      return newLetter
    })

    if (scoreToAddThisFrame > 0) {
      addScore(scoreToAddThisFrame)
    }

    const filteredLetters = updatedLetters.filter(letter => {
      const shouldKeep = !(letter.isMissed && letter.position[2] > 15) && 
                        !(letter.isHit && (letter.opacity ?? 1) <= 0)
      return shouldKeep
    })

    setFallingLetters(filteredLetters)
  })

  return null
}

export default GameLogic