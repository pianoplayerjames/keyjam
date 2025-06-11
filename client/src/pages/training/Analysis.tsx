import React, { useState } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface PerformanceData {
  id: string;
  songName: string;
  difficulty: number;
  score: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  perfectHits: number;
  goodHits: number;
  almostHits: number;
  missedHits: number;
  totalNotes: number;
  playDate: Date;
  timeSpent: number;
  averageTiming: number;
  consistencyScore: number;
  weakSpots: WeakSpot[];
  strengths: string[];
  suggestions: string[];
}

interface WeakSpot {
  section: string;
  timestamp: number;
  issue: 'timing' | 'accuracy' | 'combo-break' | 'pattern-difficulty';
  severity: 'low' | 'medium' | 'high';
  description: string;
  improvementTip: string;
}

interface PerformanceAnalysisProps {
  onBack: () => void;
}

const mockPerformanceData: PerformanceData[] = [
  {
    id: '1',
    songName: 'Neon Dreams',
    difficulty: 85,
    score: 247680,
    accuracy: 94.2,
    combo: 156,
    maxCombo: 234,
    perfectHits: 189,
    goodHits: 32,
    almostHits: 8,
    missedHits: 5,
    totalNotes: 234,
    playDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    timeSpent: 180,
    averageTiming: -12.5,
    consistencyScore: 87,
    weakSpots: [
      {
        section: 'Bridge Section',
        timestamp: 95,
        issue: 'timing',
        severity: 'high',
        description: 'Consistently hitting early on rapid sequences',
        improvementTip: 'Practice with metronome at slower speed, focus on audio cues'
      },
      {
        section: 'Chorus Transition',
        timestamp: 145,
        issue: 'combo-break',
        severity: 'medium',
        description: 'Missed chord progression pattern',
        improvementTip: 'Review chord patterns tutorial, practice finger positioning'
      }
    ],
    strengths: ['Excellent accuracy on single notes', 'Consistent timing in slow sections', 'Good overall rhythm sense'],
    suggestions: [
      'Practice rapid sequences at 75% speed',
      'Focus on chord transition patterns',
      'Work on maintaining consistency during intensity changes'
    ]
  },
  {
    id: '2',
    songName: 'Electric Pulse',
    difficulty: 72,
    score: 189450,
    accuracy: 96.8,
    combo: 198,
    maxCombo: 203,
    perfectHits: 197,
    goodHits: 6,
    almostHits: 0,
    missedHits: 0,
   totalNotes: 203,
   playDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
   timeSpent: 145,
   averageTiming: 2.1,
   consistencyScore: 94,
   weakSpots: [
     {
       section: 'Final Section',
       timestamp: 130,
       issue: 'pattern-difficulty',
       severity: 'low',
       description: 'Slight hesitation on polyrhythm pattern',
       improvementTip: 'Practice polyrhythm exercises to build confidence'
     }
   ],
   strengths: ['Nearly perfect accuracy', 'Excellent timing consistency', 'Strong pattern recognition'],
   suggestions: [
     'Challenge yourself with higher difficulty songs',
     'Focus on polyrhythm training',
     'Maintain this excellent form'
   ]
 },
 {
   id: '3',
   songName: 'Quantum Beat',
   difficulty: 91,
   score: 312750,
   accuracy: 89.3,
   combo: 89,
   maxCombo: 278,
   perfectHits: 248,
   goodHits: 19,
   almostHits: 7,
   missedHits: 4,
   totalNotes: 278,
   playDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
   timeSpent: 210,
   averageTiming: -8.7,
   consistencyScore: 76,
   weakSpots: [
     {
       section: 'Speed Section',
       timestamp: 75,
       issue: 'accuracy',
       severity: 'high',
       description: 'Multiple misses during high-speed sequence',
       improvementTip: 'Break down speed sections, practice individual patterns slowly'
     },
     {
       section: 'Complex Pattern',
       timestamp: 165,
       issue: 'combo-break',
       severity: 'high',
       description: 'Struggled with cross-hand pattern',
       improvementTip: 'Practice cross-hand exercises, focus on hand coordination'
     }
   ],
   strengths: ['Good overall score', 'Strong performance in standard sections'],
   suggestions: [
     'Focus on speed training exercises',
     'Practice cross-hand coordination drills',
     'Consider lowering difficulty until patterns are mastered'
   ]
 }
];

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ onBack }) => {
 const [selectedSession, setSelectedSession] = useState<PerformanceData | null>(null);
 const [analysisTab, setAnalysisTab] = useState<'overview' | 'timing' | 'patterns' | 'progress'>('overview');
 const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

 const getAccuracyColor = (accuracy: number) => {
   if (accuracy >= 95) return 'text-green-400';
   if (accuracy >= 90) return 'text-yellow-400';
   if (accuracy >= 80) return 'text-orange-400';
   return 'text-red-400';
 };

 const getSeverityColor = (severity: string) => {
   switch (severity) {
     case 'low': return 'text-green-400 bg-green-400/10 border-green-400/30';
     case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
     case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
     default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
   }
 };

 const getIssueIcon = (issue: string) => {
   switch (issue) {
     case 'timing': return '⏱️';
     case 'accuracy': return '🎯';
     case 'combo-break': return '💥';
     case 'pattern-difficulty': return '🧩';
     default: return '❓';
   }
 };

 const formatTime = (seconds: number) => {
   const mins = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${mins}:${secs.toString().padStart(2, '0')}`;
 };

 const calculateOverallStats = () => {
   if (mockPerformanceData.length === 0) return null;
   
   const avgAccuracy = mockPerformanceData.reduce((sum, session) => sum + session.accuracy, 0) / mockPerformanceData.length;
   const avgScore = mockPerformanceData.reduce((sum, session) => sum + session.score, 0) / mockPerformanceData.length;
   const totalPlayTime = mockPerformanceData.reduce((sum, session) => sum + session.timeSpent, 0);
   const avgConsistency = mockPerformanceData.reduce((sum, session) => sum + session.consistencyScore, 0) / mockPerformanceData.length;
   
   return {
     avgAccuracy: avgAccuracy.toFixed(1),
     avgScore: Math.round(avgScore),
     totalPlayTime,
     avgConsistency: avgConsistency.toFixed(1),
     sessionsAnalyzed: mockPerformanceData.length,
     improvementTrend: '+2.3%' // Mock trend
   };
 };

 const overallStats = calculateOverallStats();

 if (selectedSession) {
   return (
     <div className="min-h-screen bg-slate-900">
       <CenteredContainer maxWidth="2xl" accountForLeftNav={true}>
         <div className="py-8">
           <div className="flex items-center gap-4 mb-8">
             <button
               onClick={() => setSelectedSession(null)}
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors"
             >
               ← Back to Analysis
             </button>
             <div>
               <h1 className="text-3xl font-bold text-white">{selectedSession.songName}</h1>
               <p className="text-gray-400">Detailed Performance Analysis</p>
             </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
               <div className="bg-slate-800 rounded-xl p-6 mb-6">
                 <div className="flex gap-4 mb-6">
                   {['overview', 'timing', 'patterns', 'progress'].map((tab) => (
                     <button
                       key={tab}
                       onClick={() => setAnalysisTab(tab as any)}
                       className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                         analysisTab === tab
                           ? 'bg-blue-600 text-white'
                           : 'text-gray-400 hover:text-white hover:bg-slate-700'
                       }`}
                     >
                       {tab}
                     </button>
                   ))}
                 </div>

                 {analysisTab === 'overview' && (
                   <div className="space-y-6">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                         <div className="text-2xl font-bold text-white">{selectedSession.score.toLocaleString()}</div>
                         <div className="text-sm text-gray-400">Score</div>
                       </div>
                       <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                         <div className={`text-2xl font-bold ${getAccuracyColor(selectedSession.accuracy)}`}>
                           {selectedSession.accuracy}%
                         </div>
                         <div className="text-sm text-gray-400">Accuracy</div>
                       </div>
                       <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                         <div className="text-2xl font-bold text-white">{selectedSession.maxCombo}</div>
                         <div className="text-sm text-gray-400">Max Combo</div>
                       </div>
                       <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                         <div className="text-2xl font-bold text-white">{selectedSession.consistencyScore}</div>
                         <div className="text-sm text-gray-400">Consistency</div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <h3 className="text-lg font-bold text-white mb-4">Hit Distribution</h3>
                         <div className="space-y-3">
                           <div className="flex justify-between items-center">
                             <span className="text-green-400">Perfect</span>
                             <span className="text-white font-semibold">{selectedSession.perfectHits}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-yellow-400">Good</span>
                             <span className="text-white font-semibold">{selectedSession.goodHits}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-orange-400">Almost</span>
                             <span className="text-white font-semibold">{selectedSession.almostHits}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-red-400">Missed</span>
                             <span className="text-white font-semibold">{selectedSession.missedHits}</span>
                           </div>
                         </div>
                       </div>

                       <div>
                         <h3 className="text-lg font-bold text-white mb-4">Timing Analysis</h3>
                         <div className="space-y-3">
                           <div className="flex justify-between items-center">
                             <span className="text-gray-400">Average Timing</span>
                             <span className={`font-semibold ${selectedSession.averageTiming < 0 ? 'text-orange-400' : 'text-blue-400'}`}>
                               {selectedSession.averageTiming > 0 ? '+' : ''}{selectedSession.averageTiming}ms
                             </span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-gray-400">Play Time</span>
                             <span className="text-white font-semibold">{formatTime(selectedSession.timeSpent)}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-gray-400">Difficulty</span>
                             <span className="text-white font-semibold">{selectedSession.difficulty}/100</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {analysisTab === 'timing' && (
                   <div className="space-y-6">
                     <div className="bg-slate-700/50 rounded-lg p-4">
                       <h3 className="text-lg font-bold text-white mb-4">Timing Distribution</h3>
                       <div className="h-48 bg-slate-600 rounded flex items-end justify-center">
                         <div className="text-gray-400 text-sm">Timing graph visualization would go here</div>
                       </div>
                     </div>
                     
                     <div>
                       <h3 className="text-lg font-bold text-white mb-4">Timing Insights</h3>
                       <div className="space-y-3">
                         <div className="p-4 bg-slate-700/30 rounded-lg">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-orange-400">⚠️</span>
                             <span className="font-semibold text-white">Early Timing Tendency</span>
                           </div>
                           <p className="text-gray-300 text-sm">
                             You tend to hit notes {Math.abs(selectedSession.averageTiming)}ms early on average. 
                             Try focusing on audio cues rather than visual ones.
                           </p>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {analysisTab === 'patterns' && (
                   <div className="space-y-6">
                     <div>
                       <h3 className="text-lg font-bold text-white mb-4">Pattern Performance</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-700/30 rounded-lg">
                           <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
                           <ul className="space-y-1 text-sm text-gray-300">
                             {selectedSession.strengths.map((strength, index) => (
                               <li key={index}>• {strength}</li>
                             ))}
                           </ul>
                         </div>
                         <div className="p-4 bg-slate-700/30 rounded-lg">
                           <h4 className="font-semibold text-orange-400 mb-2">Areas for Improvement</h4>
                           <ul className="space-y-1 text-sm text-gray-300">
                             {selectedSession.suggestions.map((suggestion, index) => (
                               <li key={index}>• {suggestion}</li>
                             ))}
                           </ul>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {analysisTab === 'progress' && (
                   <div className="space-y-6">
                     <div className="bg-slate-700/50 rounded-lg p-4">
                       <h3 className="text-lg font-bold text-white mb-4">Progress Over Time</h3>
                       <div className="h-48 bg-slate-600 rounded flex items-center justify-center">
                         <div className="text-gray-400 text-sm">Progress chart would go here</div>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             </div>

             <div className="space-y-6">
               <div className="bg-slate-800 rounded-xl p-6">
                 <h3 className="font-bold text-white mb-4">Weak Spots</h3>
                 <div className="space-y-3">
                   {selectedSession.weakSpots.map((weakSpot, index) => (
                     <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                       <div className="flex items-center gap-2 mb-2">
                         <span className="text-lg">{getIssueIcon(weakSpot.issue)}</span>
                         <span className="font-semibold text-white">{weakSpot.section}</span>
                         <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(weakSpot.severity)}`}>
                           {weakSpot.severity}
                         </span>
                       </div>
                       <p className="text-sm text-gray-300 mb-2">{weakSpot.description}</p>
                       <p className="text-xs text-blue-400">{weakSpot.improvementTip}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="bg-slate-800 rounded-xl p-6">
                 <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                 <div className="space-y-3">
                   <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                     Practice Weak Sections
                   </button>
                   <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
                     Replay Song
                   </button>
                   <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                     View Replay
                   </button>
                   <button className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors">
                     Export Analysis
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </CenteredContainer>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-slate-900">
     <CenteredContainer maxWidth="2xl" accountForLeftNav={true}>
       <div className="py-8">
         <div className="flex items-center gap-4 mb-8">
           <button
             onClick={onBack}
             className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors"
           >
             ← Back
           </button>
           <div>
             <h1 className="text-4xl font-bold text-white">Performance Analysis</h1>
             <p className="text-gray-400">Deep insights into your rhythm game performance</p>
           </div>
         </div>

         {overallStats && (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
             <div className="bg-slate-800 rounded-xl p-4 text-center">
               <div className="text-2xl font-bold text-green-400">{overallStats.avgAccuracy}%</div>
               <div className="text-sm text-gray-400">Avg Accuracy</div>
               <div className="text-xs text-green-400 mt-1">{overallStats.improvementTrend}</div>
             </div>
             <div className="bg-slate-800 rounded-xl p-4 text-center">
               <div className="text-2xl font-bold text-blue-400">{overallStats.avgScore.toLocaleString()}</div>
               <div className="text-sm text-gray-400">Avg Score</div>
             </div>
             <div className="bg-slate-800 rounded-xl p-4 text-center">
               <div className="text-2xl font-bold text-purple-400">{overallStats.avgConsistency}</div>
               <div className="text-sm text-gray-400">Consistency</div>
             </div>
             <div className="bg-slate-800 rounded-xl p-4 text-center">
               <div className="text-2xl font-bold text-yellow-400">{Math.floor(overallStats.totalPlayTime / 60)}h</div>
               <div className="text-sm text-gray-400">Total Practice</div>
             </div>
             <div className="bg-slate-800 rounded-xl p-4 text-center">
               <div className="text-2xl font-bold text-cyan-400">{overallStats.sessionsAnalyzed}</div>
               <div className="text-sm text-gray-400">Sessions</div>
             </div>
             <div className="bg-slate-800 rounded-xl p-4 text-center">
               <div className="text-2xl font-bold text-orange-400">A+</div>
               <div className="text-sm text-gray-400">Grade</div>
             </div>
           </div>
         )}

         <div className="flex justify-between items-center mb-6">
           <div className="flex gap-4">
             {['week', 'month', 'all'].map((range) => (
               <button
                 key={range}
                 onClick={() => setTimeRange(range as any)}
                 className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                   timeRange === range
                     ? 'bg-blue-600 text-white'
                     : 'text-gray-400 hover:text-white hover:bg-slate-700'
                 }`}
               >
                 {range === 'all' ? 'All Time' : `This ${range}`}
               </button>
             ))}
           </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {mockPerformanceData.map((session) => (
             <div
               key={session.id}
               className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors cursor-pointer"
               onClick={() => setSelectedSession(session)}
             >
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-bold text-white mb-1">{session.songName}</h3>
                   <p className="text-sm text-gray-400">
                     {session.playDate.toLocaleDateString()} • Difficulty {session.difficulty}
                   </p>
                 </div>
                 <div className={`text-lg font-bold ${getAccuracyColor(session.accuracy)}`}>
                   {session.accuracy}%
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4">
                 <div>
                   <div className="text-sm text-gray-400">Score</div>
                   <div className="font-semibold text-white">{session.score.toLocaleString()}</div>
                 </div>
                 <div>
                   <div className="text-sm text-gray-400">Max Combo</div>
                   <div className="font-semibold text-white">{session.maxCombo}</div>
                 </div>
               </div>

               <div className="mb-4">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-400">Hit Distribution</span>
                 </div>
                 <div className="flex gap-1 h-2 rounded overflow-hidden">
                   <div 
                     className="bg-green-400"
                     style={{ width: `${(session.perfectHits / session.totalNotes) * 100}%` }}
                   />
                   <div 
                     className="bg-yellow-400"
                     style={{ width: `${(session.goodHits / session.totalNotes) * 100}%` }}
                   />
                   <div 
                     className="bg-orange-400"
                     style={{ width: `${(session.almostHits / session.totalNotes) * 100}%` }}
                   />
                   <div 
                     className="bg-red-400"
                     style={{ width: `${(session.missedHits / session.totalNotes) * 100}%` }}
                   />
                 </div>
               </div>

               {session.weakSpots.length > 0 && (
                 <div className="mb-4">
                   <div className="text-sm text-gray-400 mb-2">Areas to Improve</div>
                   <div className="flex flex-wrap gap-1">
                     {session.weakSpots.slice(0, 2).map((spot, index) => (
                       <span
                         key={index}
                         className={`text-xs px-2 py-1 rounded border ${getSeverityColor(spot.severity)}`}
                       >
                         {spot.issue}
                       </span>
                     ))}
                     {session.weakSpots.length > 2 && (
                       <span className="text-xs px-2 py-1 rounded border border-gray-400/30 text-gray-400">
                         +{session.weakSpots.length - 2} more
                       </span>
                     )}
                   </div>
                 </div>
               )}

               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-400">Consistency: {session.consistencyScore}/100</span>
                 <span className="text-blue-400 hover:text-blue-300">View Details →</span>
               </div>
             </div>
           ))}
         </div>
       </div>
     </CenteredContainer>
   </div>
 );
};

export default PerformanceAnalysis;