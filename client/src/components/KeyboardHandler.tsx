import { useEffect } from 'react'
import { useGameStore } from '../stores/gameStore'
import { ComplexityManager } from '../ComplexityManager'

const letters = '12345'
const channelPositions = [-2, -1, 0, 1, 2]
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0']

const calculateHitAccuracy = (
  notePosition: number, 
  hitZoneCenter: number, 
  complexity: number
) => {
  const config = ComplexityManager.getConfig(complexity)
  const distance = Math.abs(notePosition - hitZoneCenter)
  
  const baseSpeed = 15;
  const moveSpeed = baseSpeed * config.speedMultiplier;

  const perfectWindow = config.timingWindows.perfect * moveSpeed;
  const goodWindow = config.timingWindows.good * moveSpeed;
  const almostWindow = config.timingWindows.almost * moveSpeed;
  
  const baseScore = 10 + (complexity / 10)
  const timingOffset = (notePosition - hitZoneCenter) / moveSpeed;
  
  if (distance <= perfectWindow) {
    return {
      accuracy: 'perfect' as const,
      timingOffset,
      score: Math.floor(baseScore * 2.5),
      feedback: distance <= perfectWindow * 0.3 ? 'PERFECT!' : 'EXCELLENT!',
      color: '#00e676'
    }
  } else if (distance <= goodWindow) {
    const goodness = 1 - ((distance - perfectWindow) / (goodWindow - perfectWindow))
    return {
      accuracy: 'good' as const,
      timingOffset,
      score: Math.floor(baseScore * (1.5 + goodness * 0.5)),
      feedback: goodness > 0.7 ? 'GREAT!' : 'GOOD',
      color: '#29b6f6'
    }
  } else if (distance <= almostWindow) {
    const okness = 1 - ((distance - goodWindow) / (almostWindow - goodWindow))
    return {
      accuracy: 'almost' as const,
      timingOffset,
      score: Math.floor(baseScore * (0.8 + okness * 0.4)),
      feedback: okness > 0.5 ? 'NICE' : 'ALMOST',
      color: '#ffc107'
    }
  } else {
    return {
      accuracy: 'miss' as const,
      timingOffset,
      score: 0,
      feedback: distance < almostWindow * 2 ? 'CLOSE' : 'MISS',
      color: '#f44336'
    }
  }
}

const KeyboardHandler = () => {
  const {
    complexity,
    health,
    combo,
    score,
    fallingLetters,
    heldKeys,
    gameComplete,
    isGameOver,
    setHeldKeys,
    setFallingLetters,
    setScore,
    setCombo,
    setHealth,
    setHitFeedback,
    setTimingOffset,
    setShowTimingDisplay,
    addStamp,
    incrementPerfectNotes,
    incrementGoodNotes,
    incrementAlmostNotes,
    incrementMissedNotes,
    incrementTotalNotesProcessed
  } = useGameStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isGameOver || gameComplete) return
      
      const pressedLetter = event.key.toLowerCase()
      console.log('Key pressed:', pressedLetter)
      
      const channelIndex = letters.indexOf(pressedLetter)
      if (channelIndex === -1) return
      
      const xPosition = channelPositions[channelIndex]

      const newHeldKeys = new Set(heldKeys)
      newHeldKeys.add(pressedLetter)
      setHeldKeys(newHeldKeys)
      
      const hitZoneCenter = 2.0
      const config = ComplexityManager.getConfig(complexity)
      
      const maxWindow = config.timingWindows.almost * (complexity <= 30 ? 1.5 : 1.2)
      const hitBoxStart = hitZoneCenter - maxWindow
      const hitBoxEnd = hitZoneCenter + maxWindow

      const hittableNotes = fallingLetters.filter(l => {
        const noteCenter = l.position[2] - 0.8
        const noteHeight = 1.2 + (l.duration || 0)
        const noteFront = noteCenter + noteHeight / 2
        const noteBack = noteCenter - noteHeight / 2
        
        const overlaps = (noteFront >= hitBoxStart && noteBack <= hitBoxEnd) ||
                        (noteBack <= hitBoxEnd && noteFront >= hitBoxStart)

        return l.letter === pressedLetter &&
               !l.isMissed && !l.isHit && !l.isBeingHeld &&
               overlaps
      })

      console.log('Hittable notes:', hittableNotes.length)

      if (hittableNotes.length > 0) {
        const notesWithDistance = hittableNotes.map(note => ({
          note,
          distance: Math.abs((note.position[2] - 0.8) - hitZoneCenter)
        }))
        
        const { note: closestLetter } = notesWithDistance.reduce((closest, current) => 
          current.distance < closest.distance ? current : closest
        )
        
        const noteCenter = closestLetter.position[2] - 0.8
        const hitResult = calculateHitAccuracy(noteCenter, hitZoneCenter, complexity)
        
        console.log('Hit result:', hitResult)
        
        const newCombo = combo + 1
        const newScore = score + hitResult.score
        const healthBonus = hitResult.accuracy === 'perfect' ? 5 + (complexity / 50) :
                           hitResult.accuracy === 'good' ? 3 + (complexity / 100) :
                           1 + (complexity / 200)
        const newHealth = Math.min(100, health + healthBonus + (newCombo * 0.1))
        
        incrementTotalNotesProcessed()
        switch (hitResult.accuracy) {
          case 'perfect':
            incrementPerfectNotes()
            break
          case 'good':
            incrementGoodNotes()
            break
          case 'almost':
            incrementAlmostNotes()
            break
          case 'miss':
            incrementMissedNotes()
            break
        }
        
        setTimingOffset(hitResult.timingOffset)
        setShowTimingDisplay(true)
        setTimeout(() => setShowTimingDisplay(false), 1500)
        
        addStamp({
          id: Math.random(),
          position: [closestLetter.position[0], 0.1, noteCenter],
          color: hitResult.color
        })

        setHitFeedback({
          text: hitResult.feedback,
          color: hitResult.color,
          key: Date.now()
        })
        
        setScore(newScore)
        
        if (hitResult.accuracy !== 'miss') {
          setCombo(newCombo)
          setHealth(newHealth)
        } else {
          setCombo(0)
          const missPenalty = 3 + (complexity / 25)
          setHealth(health - missPenalty)
        }

        const isLongNote = (closestLetter.duration ?? 0) > 0.5
        if (isLongNote && hitResult.accuracy !== 'miss') {
          setFallingLetters(prev => prev.map(l => 
            l.id === closestLetter.id ? { ...l, isBeingHeld: true, isHit: false, wasProcessed: true } : l
          ))
        } else if (hitResult.accuracy !== 'miss') {
          setFallingLetters(prev => prev.map(l => 
            l.id === closestLetter.id ? { ...l, isHit: true, wasProcessed: true } : l
          ))
        }

      } else {
        console.log('No hittable notes found')
        
        const upcomingNotes = fallingLetters.filter(l =>
          l.letter === pressedLetter &&
          !l.isMissed && !l.isHit && !l.isBeingHeld &&
          (l.position[2] - 0.8) < hitBoxStart &&
          (l.position[2] - 0.8) > hitZoneCenter - maxWindow * 2
        )

        if (upcomingNotes.length > 0) {
          setHitFeedback({ text: 'EARLY', color: '#ffeb3b', key: Date.now() })
          setTimingOffset(upcomingNotes[0].position[2] - 0.8 - hitZoneCenter)
          setShowTimingDisplay(true)
          setTimeout(() => setShowTimingDisplay(false), 1500)
        } else {
          setHitFeedback({ text: 'MISS', color: '#f44336', key: Date.now() })
          setTimingOffset(0)
          incrementTotalNotesProcessed()
          incrementMissedNotes()
        }
        
        addStamp({
          id: Math.random(),
          position: [xPosition, 0.1, hitZoneCenter],
          color: '#f44336'
        })
        
        setCombo(0)
        const missPenalty = 3 + (complexity / 25)
        setHealth(health - missPenalty)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const releasedLetter = event.key.toLowerCase()
      console.log('Key released:', releasedLetter)
      
      const newHeldKeys = new Set(heldKeys)
      newHeldKeys.delete(releasedLetter)
      setHeldKeys(newHeldKeys)
      
      setFallingLetters(prev => prev.map(l => {
        if (l.letter === releasedLetter && l.isBeingHeld) {
          return { ...l, isBeingHeld: false }
        }
        return l
      }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    complexity,
    health,
    combo,
    score,
    fallingLetters,
    heldKeys,
    gameComplete,
    isGameOver,
    setHeldKeys,
    setFallingLetters,
    setScore,
    setCombo,
    setHealth,
    setHitFeedback,
    setTimingOffset,
    setShowTimingDisplay,
    addStamp,
    incrementPerfectNotes,
    incrementGoodNotes,
    incrementAlmostNotes,
    incrementMissedNotes,
    incrementTotalNotesProcessed
  ])

  return null
}

export default KeyboardHandler