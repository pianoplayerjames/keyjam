// client/src/App.tsx
import { useEffect, Suspense } from 'react' // Add Suspense to the import
import { Canvas } from '@react-three/fiber'
import Game from './Game'
import MainMenu from './MainMenu'
import Transition from './Transition'
import FloatingShapes from './FloatingShapes'
import GradientBackground from './GradientBackground'
import { useGameStore } from './stores/gameStore'
import { useMenuStore } from './stores/menuStore'
import './App.css'

const SimpleLoading = () => (
  <group>
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff4f7b" />
    </mesh>
  </group>
)

function App() {
  const { gameState, gameConfig, setGameConfig, setGameState } = useGameStore()
  const { menuState, isTransitioning, setIsTransitioning, setMenuState } = useMenuStore()

const handleStartGame = (config: typeof gameConfig) => {
  console.log('Starting game with config:', config)
  setGameConfig(config)
  setIsTransitioning(true)
  setGameState('in-transition')
}

  const handleTransitionComplete = () => {
    setGameState('game')
    setIsTransitioning(false)
  }

  const handleBackToMenu = () => {
    setGameState('menu')
    setMenuState('main')
    setIsTransitioning(false)
  }

  const handleMenuNavigation = (newState: string) => {
    setMenuState(newState)
  }

  if (gameState === 'game') {
    return <Game onBackToMenu={handleBackToMenu} />
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Canvas 
        camera={{ position: [0, 2.5, 5], fov: 75 }} 
        className="absolute inset-0"
      >
        <Suspense fallback={<SimpleLoading />}>
          <GradientBackground combo={0} />
          <FloatingShapes />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          
          {gameState === 'in-transition' && (
            <Transition 
              onTransitionComplete={handleTransitionComplete}
              gameMode={gameConfig.mode}
            />
          )}
        </Suspense>
      </Canvas>

      {gameState === 'menu' && (
        <MainMenu 
          menuState={menuState}
          onStartGame={handleStartGame}
          onMenuNavigation={handleMenuNavigation}
          isTransitioning={isTransitioning}
        />
      )}
    </div>
  )
}

export default App