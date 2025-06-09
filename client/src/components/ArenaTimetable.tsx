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

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initial centering on current time
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

  // Global mouse event handlers for dragging
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
        background: '#1a1a2e', 
        cursor: isDragging ? 'grabbing' : 'grab', 
        userSelect: 'none'
      }}
    >
      <div style={{ 
        position: 'absolute', 
        width: `${timelineTotalWidth}px`, 
        transform: `translate(${offset.x}px, ${offset.y}px)` 
      }}>
        {/* Sticky Header */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          background: '#1a1a2e', 
          borderBottom: '1px solid #4a4a6e' 
        }}>
          <div style={{ display: 'flex', height: '45px', alignItems: 'center' }}>
            {Array.from({ length: timelineHours }).map((_, i) => (
              <div 
                key={`header-${i}`} 
                style={{ 
                  width: `${hourWidth}px`, 
                  padding: '10px', 
                  borderLeft: '1px solid #4a4a6e', 
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
          
          {/* Current Time Indicator */}
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
          
          {/* Current Time Label */}
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
          {/* Minute Lines */}
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
          
          {/* Extended Current Time Indicator Line */}
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
          
          {/* Arenas */}
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
        // Use onViewArena if available, otherwise fallback to onJoinArena
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
        borderRadius: '5px', 
        padding: '8px', 
        color: 'white', 
        cursor: 'pointer', 
        zIndex: 1,
        pointerEvents: 'auto',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
                  fontSize: '12px',
                  marginBottom: '2px'
                }}>
                  {arena.name}
                </div>
                <div style={{
                  fontSize: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{arena.players}/{arena.maxPlayers}</span>
                  {arena.prizePool && (
                    <span style={{ color: '#ffd700' }}>
                      💰${(arena.prizePool / 1000).toFixed(0)}k
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '9px',
                  opacity: 0.8,
                  marginTop: '1px'
                }}>
                  {arena.startTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                  })}
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
      
      {/* Resize Handle */}
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
        {/* Resize Indicator */}
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
          {/* Drag Icon */}
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
          
          {/* Height Display */}
          <span style={{
            fontSize: '11px',
            color: '#fff',
            fontWeight: 'bold',
            minWidth: '50px',
            textAlign: 'center'
          }}>
            {timetableHeight}px
          </span>
          
          {/* Progress Bar */}
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
          
          {/* Size Labels */}
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