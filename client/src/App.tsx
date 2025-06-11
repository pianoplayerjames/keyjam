import { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '@/App.css';
import Game from '@/stage/Game';
import Transition from '@/shared/components/Transition';
import PulsingBackground from '@/shared/components/PulsingBackground';
import { useGameStore } from '@/shared/stores/gameStore';
import { useMenuStore } from '@/shared/stores/menuStore';
import { useReplayStore } from '@/shared/stores/replayStore';
import QuickMatch from '@/pages/online/QuickMatch';
import ReplayPlayer from '@/pages/replay/components/ReplayPlayer';
import { TopBar } from '@/ui/TopBar';
import { Navigation } from '@/ui/Navigation';
import CareerMenu from '@/pages/career';
import OnlinePortal from '@/pages/online/Multiplayer';
import Training from '@/pages/training';
import ReplayBrowser from '@/pages/replay/components/ReplayBrowser';
import ArcadeMenu from '@/pages/arcade';
import { AnimatedBackground } from '@/shared/components/AnimatedBackground';
import LeftNav from '@/ui/LeftNav';
import { ArenaPage } from '@/pages/online/Arena';
import MouseTrail from '@/shared/utils/MouseTrail';
import { BottomPanel } from '@/ui/BottomPanel/BottomPanel';
import CommunityForums from '@/pages/social/CommunityForums';

const SimpleLoading = () => (
 <group>
   <mesh>
     <boxGeometry args={[1, 1, 1]} />
     <meshBasicMaterial color="#ff4f7b" />
   </mesh>
 </group>
);

interface PlayerStats {
 totalReplays: number;
 bestScore: number;
 bestAccuracy: number;
 totalPlayTime: number;
}

function App() {
 const { gameState, gameConfig, setGameConfig, setGameState } = useGameStore();
 const { menuState, setMenuState, isTransitioning, setIsTransitioning } = useMenuStore();
 const isPlayingReplay = useReplayStore((state) => state.isPlaying);
 const navigate = useNavigate();

 const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
 const [playerData] = useState({
   username: 'RhythmMaster',
   rank: 'Diamond',
   elo: 1847,
   level: 28,
   wins: 156,
   losses: 89,
   draws: 12,
   status: 'online' as const
 });

 const [localGameConfig, setLocalGameConfig] = useState({
   ...gameConfig,
   songId: ''
 });

 const [cursorStyle, setCursorStyle] = useState<'modern' | 'gaming' | 'minimal' | 'magnetic' | 'morphing'>('modern');

 useEffect(() => {
   const handleContextMenu = (e: MouseEvent) => {
     e.preventDefault();
     return false;
   };

   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'F11') {
       e.preventDefault();
       if (!document.fullscreenElement) {
         document.documentElement.requestFullscreen();
       } else {
         document.exitFullscreen();
       }
     }
     if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
       e.preventDefault();
       return false;
     }
   };

   const handleSelectStart = (e: Event) => {
     if (!(e.target as HTMLElement).matches('input, textarea, [contenteditable="true"]')) {
       e.preventDefault();
       return false;
     }
   };

   document.addEventListener('contextmenu', handleContextMenu);
   document.addEventListener('keydown', handleKeyDown);
   document.addEventListener('selectstart', handleSelectStart);

   return () => {
     document.removeEventListener('contextmenu', handleContextMenu);
     document.removeEventListener('keydown', handleKeyDown);
     document.removeEventListener('selectstart', handleSelectStart);
   };
 }, []);

 useEffect(() => {
   try {
     const storedReplays = localStorage.getItem('rhythm-game-replays');
     const replays = storedReplays ? JSON.parse(storedReplays).state.savedReplays : [];

     if (replays && replays.length > 0) {
       const bestScore = Math.max(...replays.map((r: any) => r.metadata.finalScore));
       const bestAccuracy = Math.max(...replays.map((r: any) => r.metadata.accuracy));
       const totalPlayTime = replays.reduce((sum: number, r: any) => sum + r.duration, 0);

       setPlayerStats({
         totalReplays: replays.length,
         bestScore,
         bestAccuracy,
         totalPlayTime
       });
     }
   } catch (error) {
     console.error('Failed to load player stats:', error);
   }
 }, []);

 const handleStartGameWithConfig = (config: typeof gameConfig) => {
   setGameConfig(config);
   setIsTransitioning(true);
   setGameState('in-transition');
 };

 const handleTransitionComplete = () => {
   setGameState('game');
   setIsTransitioning(false);
 };

 const handleBackToMenu = () => {
   setGameState('menu');
   setMenuState('main');
   setIsTransitioning(false);
 };

 const handleSelectSong = (songId: string) => {
   const newConfig = { ...localGameConfig, mode: 'arcade' as const, subMode: 'arcade' as const, songId };
   setLocalGameConfig(newConfig);
   handleStartGameWithConfig(newConfig);
 };

 if (gameState === 'game') {
   return (
     <>
       <Game onBackToMenu={handleBackToMenu} />
       <MouseTrail 
         enabled={true}
         cursorStyle="gaming"
         particleCount={60}
         particleSize={0.03}
         fadeSpeed={0.94}
         color="#ff6b9d"
       />
     </>
   );
 }

 const renderMainMenu = () => {
   if (menuState === 'time-selection' || menuState === 'score-selection' || menuState === 'difficulty') {
     return (
       <div className="relative w-screen h-screen">
         <Canvas camera={{ position: [0, 0, 10], fov: 60 }} className="absolute inset-0">
           <Suspense fallback={null}>
             <AnimatedBackground />
           </Suspense>
         </Canvas>
         <div className="absolute inset-0 z-10 pb-16">
           {menuState === 'time-selection' && <TimeSelectionMenu onBack={() => setMenuState('main')} onSelectTime={(timeLimit) => {
             setLocalGameConfig(prev => ({ ...prev, timeLimit }));
             setMenuState('difficulty');
           }} />}
           {menuState === 'score-selection' && <ScoreSelectionMenu onBack={() => setMenuState('main')} />}
           {menuState === 'difficulty' && <DifficultyMenu onBack={() => setMenuState(localGameConfig.subMode === 'time' ? 'time-selection' : 'score-selection')} />}
         </div>
       </div>
     );
   }

   return (
     <div className="fixed inset-0 z-50">
       <LeftNav />
       <AnimatedBackground />
       <div className="relative z-10 flex flex-col h-screen">
         <TopBar playerData={playerData} playerStats={playerStats} />
         <Navigation />
         <div className="flex-grow relative overflow-y-auto pb-16">
           <Routes>
               <Route path="/" element={<OnlinePortal onBack={() => navigate('/')} onStartGame={(config) => handleStartGameWithConfig(config)} />} />
               <Route path="/career" element={<CareerMenu onBack={() => navigate('/')} />} />
               <Route path="/arcade" element={<ArcadeMenu onBack={() => navigate('/')} onSelectSong={handleSelectSong} />} />
               <Route path="/training" element={<Training onBack={() => navigate('/')} onSelectMode={(mode) => {
                 setLocalGameConfig(prev => ({ ...prev, mode: 'practise', subMode: mode }));
                 setMenuState(mode === 'time' ? 'time-selection' : 'score-selection');
               }} />} />
               <Route path="/replays" element={<div className="h-full"><ReplayBrowser isVisible={true} onClose={() => navigate('/')} /></div>} />
               <Route path="/arena/:id" element={<ArenaPage />} />
               <Route path="/online/quick" element={<QuickMatch onBack={() => navigate('/')} onStartGame={(config) => handleStartGameWithConfig(config)} />} />
               <Route path="/social/forums" element={<CommunityForums onBack={() => navigate('/')} />} />
           </Routes>
         </div>
       </div>
     </div>
   )
 }

 return (
   <>
     <div className="relative w-screen h-screen overflow-hidden" style={{ visibility: isPlayingReplay ? 'hidden' : 'visible' }}>
       {isPlayingReplay && <ReplayPlayer />}

       <Canvas
         camera={{ position: [0, 2.5, 5], fov: 75 }}
         className="absolute inset-0"
       >
         <Suspense fallback={<SimpleLoading />}>
           <PulsingBackground />
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

       {gameState === 'menu' && renderMainMenu()}

       <BottomPanel />
     </div>

     <MouseTrail 
       cursorStyle="minimal"
       opacity={0.8}
       size={1.2}
       hideWhenIdle={true}
       idleTimeout={4000}
     />
     
   </>
 );
}

export default App;