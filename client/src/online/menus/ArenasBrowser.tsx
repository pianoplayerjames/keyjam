// client/src/online/ArenasBrowser.tsx
import React, { useState } from 'react';
import { useOnlineStore } from '../../shared/stores/onlineStore';
import type { Arena } from '../../shared/stores/onlineStore';

interface ArenasBrowserProps {
  onBack: () => void;
  onJoinArena: (arenaId: string) => void;
}

const ArenasBrowser: React.FC<ArenasBrowserProps> = ({ onBack, onJoinArena }) => {
  const { arenas, playerData } = useOnlineStore();
  const [filter, setFilter] = useState({
    gameMode: 'all',
    region: 'all',
    ranked: 'all',
    showFull: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArenas = arenas.filter(arena => {
    if (filter.gameMode !== 'all' && arena.gameMode !== filter.gameMode) return false;
    if (filter.region !== 'all' && arena.region !== filter.region) return false;
    if (filter.ranked !== 'all') {
      if (filter.ranked === 'ranked' && !arena.isRanked) return false;
      if (filter.ranked === 'unranked' && arena.isRanked) return false;
    }
    if (!filter.showFull && arena.status === 'full') return false;
    if (searchTerm && !arena.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  const getStatusColor = (status: Arena['status']) => {
    switch (status) {
      case 'waiting': return '#4caf50';
      case 'in-progress': return '#ff9800';
      case 'full': return '#f44336';
      default: return '#666';
    }
  };

  const getPingColor = (ping: number) => {
    if (ping < 50) return '#4caf50';
    if (ping < 100) return '#ff9800';
    return '#f44336';
  };

  const canJoinArena = (arena: Arena) => {
    if (!playerData) return false;
    if (arena.status !== 'waiting') return false;
    if (arena.isRanked && arena.minElo && playerData.elo < arena.minElo) return false;
    if (arena.isRanked && arena.maxElo && playerData.elo > arena.maxElo) return false;
    return true;
  };
  
  if (!playerData) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏟️ Arena Browser
        </h1>

        <button
          style={{
            background: 'linear-gradient(45deg, #4caf50, #45a049)',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + Create Arena
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
        {/* Filters Sidebar */}
        <div style={{
          width: '250px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>🔍 Filters</h3>
          
          {/* Search */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
              Search Arenas
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Arena name..."
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Game Mode Filter */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
              Game Mode
            </label>

            <select
             value={filter.gameMode}
             onChange={(e) => setFilter({...filter, gameMode: e.target.value})}
             style={{
               width: '100%',
               padding: '8px',
               background: 'rgba(255, 255, 255, 0.1)',
               border: '1px solid rgba(255, 255, 255, 0.3)',
               borderRadius: '6px',
               color: 'white',
               fontSize: '14px'
             }}
           >
             <option value="all">All Modes</option>
             <option value="Battle Royale">Battle Royale</option>
             <option value="Team Battle">Team Battle</option>
             <option value="Tournament">Tournament</option>
             <option value="Practice">Practice</option>
             <option value="Speed Battle">Speed Battle</option>
           </select>
         </div>

         {/* Region Filter */}
         <div style={{ marginBottom: '20px' }}>
           <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
             Region
           </label>
           <select
             value={filter.region}
             onChange={(e) => setFilter({...filter, region: e.target.value})}
             style={{
               width: '100%',
               padding: '8px',
               background: 'rgba(255, 255, 255, 0.1)',
               border: '1px solid rgba(255, 255, 255, 0.3)',
               borderRadius: '6px',
               color: 'white',
               fontSize: '14px'
             }}
           >
             <option value="all">All Regions</option>
             <option value="NA-East">NA East</option>
             <option value="NA-West">NA West</option>
             <option value="EU-West">EU West</option>
             <option value="Asia">Asia</option>
           </select>
         </div>

         {/* Ranked Filter */}
         <div style={{ marginBottom: '20px' }}>
           <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
             Match Type
           </label>
           <select
             value={filter.ranked}
             onChange={(e) => setFilter({...filter, ranked: e.target.value})}
             style={{
               width: '100%',
               padding: '8px',
               background: 'rgba(255, 255, 255, 0.1)',
               border: '1px solid rgba(255, 255, 255, 0.3)',
               borderRadius: '6px',
               color: 'white',
               fontSize: '14px'
             }}
           >
             <option value="all">All Types</option>
             <option value="ranked">Ranked Only</option>
             <option value="unranked">Casual Only</option>
           </select>
         </div>

         {/* Show Full Toggle */}
         <div style={{ marginBottom: '20px' }}>
           <label style={{
             display: 'flex',
             alignItems: 'center',
             gap: '8px',
             fontSize: '14px',
             color: '#ccc',
             cursor: 'pointer'
           }}>
             <input
               type="checkbox"
               checked={filter.showFull}
               onChange={(e) => setFilter({...filter, showFull: e.target.checked})}
               style={{ accentColor: '#4caf50' }}
             />
             Show Full Arenas
           </label>
         </div>

         {/* Stats */}
         <div style={{
           background: 'rgba(255, 255, 255, 0.05)',
           borderRadius: '10px',
           padding: '15px',
           marginTop: '20px'
         }}>
           <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4caf50' }}>
             📊 Arena Stats
           </h4>
           <div style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.5' }}>
             <div>Total: {arenas.length} arenas</div>
             <div>Available: {arenas.filter(a => a.status === 'waiting').length}</div>
             <div>In Progress: {arenas.filter(a => a.status === 'in-progress').length}</div>
             <div>Showing: {filteredArenas.length}</div>
           </div>
         </div>
       </div>

       {/* Arena List */}
       <div style={{
         flex: 1,
         overflowY: 'auto',
         paddingRight: '10px'
       }}>
         <div style={{
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center',
           marginBottom: '20px'
         }}>
           <h2 style={{
             margin: 0,
             fontSize: '20px',
             color: '#fff'
           }}>
             Available Arenas ({filteredArenas.length})
           </h2>
           
           <div style={{
             display: 'flex',
             gap: '10px',
             alignItems: 'center',
             fontSize: '14px',
             color: '#ccc'
           }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }} />
               Waiting
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff9800' }} />
               In Progress
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f44336' }} />
               Full
             </div>
           </div>
         </div>

         {filteredArenas.length === 0 ? (
           <div style={{
             textAlign: 'center',
             padding: '60px 20px',
             color: '#666'
           }}>
             <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
             <h3 style={{ margin: '0 0 10px 0' }}>No Arenas Found</h3>
             <p>Try adjusting your filters or create a new arena!</p>
           </div>
         ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {filteredArenas.map((arena) => (
               <div
                 key={arena.id}
                 style={{
                   background: 'rgba(255, 255, 255, 0.05)',
                   borderRadius: '15px',
                   padding: '20px',
                   border: '1px solid rgba(255, 255, 255, 0.1)',
                   transition: 'all 0.3s ease'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                   e.currentTarget.style.transform = 'translateY(-2px)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                   e.currentTarget.style.transform = 'translateY(0)';
                 }}
               >
                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'flex-start',
                   marginBottom: '15px'
                 }}>
                   <div style={{ flex: 1 }}>
                     <div style={{
                       display: 'flex',
                       alignItems: 'center',
                       gap: '10px',
                       marginBottom: '8px'
                     }}>
                       <h3 style={{
                         margin: 0,
                         fontSize: '18px',
                         fontWeight: 'bold',
                         color: '#fff'
                       }}>
                         {arena.name}
                       </h3>
                       
                       <div style={{
                         background: getStatusColor(arena.status),
                         color: 'white',
                         padding: '2px 8px',
                         borderRadius: '12px',
                         fontSize: '12px',
                         fontWeight: 'bold',
                         textTransform: 'uppercase'
                       }}>
                         {arena.status}
                       </div>

                       {arena.isRanked && (
                         <div style={{
                           background: '#ffd700',
                           color: 'black',
                           padding: '2px 8px',
                           borderRadius: '12px',
                           fontSize: '12px',
                           fontWeight: 'bold'
                         }}>
                           RANKED
                         </div>
                       )}
                     </div>

                     <div style={{
                       display: 'flex',
                       alignItems: 'center',
                       gap: '15px',
                       fontSize: '14px',
                       color: '#ccc'
                     }}>
                       <span>Host: <strong style={{ color: '#4caf50' }}>{arena.host}</strong></span>
                       <span>Mode: <strong>{arena.gameMode}</strong></span>
                       <span>Region: <strong>{arena.region}</strong></span>
                     </div>
                   </div>

                   <button
                     onClick={() => onJoinArena(arena.id)}
                     disabled={!canJoinArena(arena)}
                     style={{
                       background: canJoinArena(arena) ? 
                         'linear-gradient(45deg, #4caf50, #45a049)' : 
                         '#666',
                       border: 'none',
                       color: 'white',
                       padding: '10px 20px',
                       borderRadius: '8px',
                       cursor: canJoinArena(arena) ? 'pointer' : 'not-allowed',
                       fontSize: '14px',
                       fontWeight: 'bold',
                       minWidth: '80px'
                     }}
                   >
                     {arena.status === 'full' ? 'Full' :
                      arena.status === 'in-progress' ? 'In Game' :
                      'Join'}
                   </button>
                 </div>

                 <div style={{
                   display: 'grid',
                   gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                   gap: '15px'
                 }}>
                   <div style={{
                     background: 'rgba(255, 255, 255, 0.05)',
                     borderRadius: '8px',
                     padding: '10px',
                     textAlign: 'center'
                   }}>
                     <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2196f3' }}>
                       {arena.players}/{arena.maxPlayers}
                     </div>
                     <div style={{ fontSize: '12px', color: '#ccc' }}>Players</div>
                   </div>

                   <div style={{
                     background: 'rgba(255, 255, 255, 0.05)',
                     borderRadius: '8px',
                     padding: '10px',
                     textAlign: 'center'
                   }}>
                     <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9800' }}>
                       {arena.difficulty}
                     </div>
                     <div style={{ fontSize: '12px', color: '#ccc' }}>Difficulty</div>
                   </div>

                   <div style={{
                     background: 'rgba(255, 255, 255, 0.05)',
                     borderRadius: '8px',
                     padding: '10px',
                     textAlign: 'center'
                   }}>
                     <div style={{
                       fontSize: '16px',
                       fontWeight: 'bold',
                       color: getPingColor(arena.ping)
                     }}>
                       {arena.ping}ms
                     </div>
                     <div style={{ fontSize: '12px', color: '#ccc' }}>Ping</div>
                   </div>

                   {arena.isRanked && (arena.minElo || arena.maxElo) && (
                     <div style={{
                       background: 'rgba(255, 255, 255, 0.05)',
                       borderRadius: '8px',
                       padding: '10px',
                       textAlign: 'center'
                     }}>
                       <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffd700' }}>
                         {arena.minElo || 0}-{arena.maxElo || '∞'}
                       </div>
                       <div style={{ fontSize: '12px', color: '#ccc' }}>ELO Range</div>
                     </div>
                   )}
                 </div>

                 {!canJoinArena(arena) && arena.status === 'waiting' && arena.isRanked && (
                   <div style={{
                     marginTop: '10px',
                     padding: '8px',
                     background: 'rgba(244, 67, 54, 0.2)',
                     borderRadius: '6px',
                     fontSize: '12px',
                     color: '#f44336',
                     textAlign: 'center'
                   }}>
                     ⚠️ Your ELO ({playerData.elo}) doesn't meet the requirements for this arena
                   </div>
                 )}
               </div>
             ))}
           </div>
         )}
       </div>
     </div>
   </div>
  );
};

export default ArenasBrowser;