import React, { useState, useEffect, useRef, useMemo } from 'react';

interface Arena { 
  id: string; 
  name: string; 
  type: 'tournament' | 'ranked' | 'casual' | 'speed' | 'party' | 'battle-royale' | 'team-battle' | 'practice' | 'blitz' | 'championship' | 'seasonal' | 'custom'; 
  startTime: Date; 
  duration: number; 
  players: number; 
  maxPlayers: number; 
  difficulty: number; 
  prizePool?: number; 
  status: 'waiting' | 'starting' | 'live' | 'finished'; 
  timeControl: string; 
  host: string; 
}

interface ArenaTimetableViewProps {
  upcomingArenas: Arena[];
  onJoinArena: (arenaId: string) => void;
  onViewArena?: (arena: Arena) => void;
  getArenaTypeColor: (type: Arena['type']) => string;
  height: number;
}

const getArenaIcon = (type: Arena['type']): string => {
  const iconMap = {
    'tournament': '🏆',
    'ranked': '🎯',
    'casual': '🎮',
    'speed': '⚡',
    'party': '🎉',
    'battle-royale': '👑',
    'team-battle': '⚔️',
    'practice': '📚',
    'blitz': '💨',
    'championship': '🥇',
    'seasonal': '🌟',
    'custom': '🎨'
  };
  return iconMap[type] || '🎮';
};

export const ArenaTimetableView: React.FC<ArenaTimetableViewProps> = ({ 
  upcomingArenas, 
  onJoinArena, 
  onViewArena,
  getArenaTypeColor, 
  height 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const timelineStart = useMemo(() => { const d = new Date(); d.setMinutes(0,0,0); return d; }, []);

  const timelineHours = 8;
  const laneHeight = 60;
  const hourWidth = 400;
  const timelineTotalWidth = timelineHours * hourWidth;

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      const viewportCenter = viewportRef.current.clientWidth / 2;
      const minutesFromStart = (currentTime.getTime() - timelineStart.getTime()) / 60000;
      const currentOffsetPx = minutesFromStart * (hourWidth / 60);
      setOffset({ x: viewportCenter - currentOffsetPx, y: 0 });
    }
  }, [timelineStart, currentTime]);

  const laidOutArenas = useMemo(() => {
    const lanes: Date[] = [];
    const sortedArenas = [...upcomingArenas].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    return sortedArenas.map(arena => {
      let placedLane = -1;
      for (let i = 0; i < lanes.length; i++) { 
        if (lanes[i] <= arena.startTime) { 
          placedLane = i; 
          break; 
        } 
      }
      if (placedLane === -1) { 
        placedLane = lanes.length; 
      }
      lanes[placedLane] = new Date(arena.startTime.getTime() + arena.duration * 60000);
      return { ...arena, lane: placedLane };
    });
  }, [upcomingArenas]);

  const maxLanes = laidOutArenas.length > 0 ? Math.max(...laidOutArenas.map(a => a.lane)) + 1 : 0;
  const contentTotalHeight = Math.min(maxLanes, 30) * laneHeight + 45;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    const viewportHeight = viewportRef.current?.clientHeight ?? 0;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const clampedX = Math.max(viewportWidth - timelineTotalWidth, Math.min(newX, 0));
    const clampedY = Math.max(viewportHeight - contentTotalHeight, Math.min(newY, 0));
    
    setOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const viewportWidth = viewportRef.current?.clientWidth ?? 0;
        const viewportHeight = viewportRef.current?.clientHeight ?? 0;
        
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        const clampedX = Math.max(viewportWidth - timelineTotalWidth, Math.min(newX, 0));
        const clampedY = Math.max(viewportHeight - contentTotalHeight, Math.min(newY, 0));
        
        setOffset({ x: clampedX, y: clampedY });
      };

      const handleGlobalMouseUp = () => setIsDragging(false);

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, timelineTotalWidth, contentTotalHeight]);

  const getCurrentTimePosition = () => {
    const minutesFromStart = (currentTime.getTime() - timelineStart.getTime()) / 60000;
    return minutesFromStart * (hourWidth / 60);
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div 
      ref={viewportRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ 
        width: '100%', 
        height: `${height}px`, 
        position: 'relative', 
        overflow: 'hidden', 
        cursor: isDragging ? 'grabbing' : 'grab', 
        userSelect: 'none'
      }}
    >
      <div style={{ 
        position: 'absolute', 
        width: `${timelineTotalWidth}px`, 
        transform: `translate(${offset.x}px, ${offset.y}px)` 
      }}>
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10
        }}>
          <div style={{ display: 'flex', height: '25px', alignItems: 'center' }}>
            {Array.from({ length: timelineHours }).map((_, i) => (
              <div 
                key={`header-${i}`} 
                style={{ 
                  width: `${hourWidth}px`, 
                  padding: '10px', 
                  color: '#aaa' 
                }}
              >
                {new Date(timelineStart.getTime() + i * 3600000).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  hour12: true 
                })}
              </div>
            ))}
          </div>
          
          <div style={{ 
            position: 'absolute', 
            left: `${currentTimePosition}px`, 
            top: 0, 
            bottom: 0, 
            width: '3px', 
            background: 'linear-gradient(to bottom, #ff1493, #ff69b4)', 
            zIndex: 15, 
            pointerEvents: 'none',
            boxShadow: '0 0 10px #ff1493, 0 0 20px #ff1493'
          }} />
          
          <div style={{
            position: 'absolute',
            left: `${currentTimePosition}px`,
            top: '5px',
            transform: 'translateX(-50%)',
            background: '#ff1493',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            zIndex: 16,
            pointerEvents: 'none',
            boxShadow: '0 2px 10px rgba(255, 20, 147, 0.5)',
            whiteSpace: 'nowrap'
          }}>
            {currentTime.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
        
        <div style={{ position: 'relative', height: `${contentTotalHeight - 45}px` }}>
          {Array.from({ length: timelineHours * 2 }).map((_, i) => (
            <div 
              key={`line-${i}`} 
              style={{ 
                position: 'absolute', 
                left: `${i * (hourWidth / 2)}px`, 
                top: 0, 
                height: '100%', 
                borderLeft: '1px dashed rgba(255, 255, 255, 0.1)' 
              }} 
            />
          ))}
          
          <div style={{ 
            position: 'absolute', 
            left: `${currentTimePosition}px`, 
            top: 0, 
            height: '100%',
            width: '3px', 
            background: 'linear-gradient(to bottom, #ff1493, #ff69b4)', 
            zIndex: 5, 
            pointerEvents: 'none',
            boxShadow: '0 0 10px #ff1493',
            opacity: 0.7
          }} />
          
          {laidOutArenas.map(arena => {
            const startOffsetMinutes = (arena.startTime.getTime() - timelineStart.getTime()) / 60000;
            const leftPx = startOffsetMinutes * (hourWidth / 60);
            const widthPx = arena.duration * (hourWidth / 60) - 4;
            const bgColor = arena.status === 'finished' ? '#424242' : getArenaTypeColor(arena.type);
            
            return (
              <div 
                key={arena.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onViewArena) {
                    onViewArena(arena);
                  } else {
                    onJoinArena(arena.id);
                  }
                }} 
                title={arena.name} 
                style={{ 
                  position: 'absolute', 
                  top: `${arena.lane * laneHeight + 5}px`, 
                  left: `${leftPx}px`, 
                  width: `${widthPx}px`, 
                  height: '50px', 
                  background: bgColor, 
                  borderRadius: '8px', 
                  padding: '6px', 
                  color: 'white', 
                  cursor: 'pointer', 
                  zIndex: 1,
                  pointerEvents: 'auto',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${bgColor}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  whiteSpace: 'nowrap', 
                  textOverflow: 'ellipsis', 
                  overflow: 'hidden',
                  fontSize: '11px',
                  marginBottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '12px', flexShrink: 0 }}>{getArenaIcon(arena.type)}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{arena.name}</span>
                </div>
                
                <div style={{
                  fontSize: '9px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2px',
                  gap: '4px'
                }}>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <span>👥</span>
                    <span>{arena.players}/{arena.maxPlayers}</span>
                  </div>
                  
                  {arena.prizePool && (
                    <div style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: '#ffd700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <span>💰</span>
                      <span>${(arena.prizePool / 1000).toFixed(0)}k</span>
                    </div>
                  )}
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  background: 'rgba(0, 0, 0, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  color: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <span>🕐</span>
                  <span>
                    {arena.startTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ResizableTimetableProps {
  upcomingArenas: Arena[];
  onJoinArena: (arenaId: string) => void;
  onViewArena?: (arena: Arena) => void;
  getArenaTypeColor: (type: Arena['type']) => string;
}

export const ResizableTimetable: React.FC<ResizableTimetableProps> = ({ 
  upcomingArenas, 
  onJoinArena, 
  onViewArena,
  getArenaTypeColor 
}) => {
  const [timetableHeight, setTimetableHeight] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const minHeight = 200;
  const maxHeight = 600;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    const startY = e.clientY;
    const startHeight = timetableHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      setTimetableHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const progressPercent = ((timetableHeight - minHeight) / (maxHeight - minHeight)) * 100;

  return (
    <div style={{ position: 'relative' }}>
      <ArenaTimetableView 
        upcomingArenas={upcomingArenas} 
        onJoinArena={onJoinArena} 
        onViewArena={onViewArena}
        getArenaTypeColor={getArenaTypeColor}
        height={timetableHeight}
      />
      
      <div 
        ref={resizeRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          bottom: '-8px',
          left: 0,
          right: 0,
          height: '16px',
          cursor: 'ns-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isResizing ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: '8px',
          transition: 'background 0.2s ease',
          zIndex: 30,
          pointerEvents: 'auto'
        }}
        onMouseEnter={(e) => {
          if (!isResizing) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.2s ease',
          opacity: isResizing ? 1 : 0.7,
          pointerEvents: 'none'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                width: '12px',
                height: '2px',
                background: '#fff',
                borderRadius: '1px',
                opacity: 0.6
              }} />
            ))}
          </div>
          
          <span style={{
            fontSize: '11px',
            color: '#fff',
            fontWeight: 'bold',
            minWidth: '50px',
            textAlign: 'center'
          }}>
            {timetableHeight}px
          </span>
          
          <div style={{
            width: '60px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4caf50, #2196f3)',
              borderRadius: '2px',
              transition: 'width 0.1s ease'
            }} />
          </div>
          
          <div style={{
            fontSize: '9px',
            color: '#aaa',
            display: 'flex',
            flexDirection: 'column',
            lineHeight: '1'
          }}>
            <span>{progressPercent < 25 ? 'Small' : progressPercent < 75 ? 'Medium' : 'Large'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};