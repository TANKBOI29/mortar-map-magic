
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  mortarPositions, 
  calculateAimingSolution, 
  AimingSolution, 
  getCompassDirection 
} from '@/lib/mortar-utils';

interface MortarMapProps {
  className?: string;
  selectedMortar: string;
  onSolutionCalculated: (solution: AimingSolution | null) => void;
}

const MortarMap: React.FC<MortarMapProps> = ({
  className,
  selectedMortar,
  onSolutionCalculated
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [targetPosition, setTargetPosition] = useState<{ x: number, y: number } | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  
  // Handle map click to set target location
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    // Get click coordinates relative to the map
    const rect = mapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / mapScale;
    const y = (e.clientY - rect.top) / mapScale;
    
    // Set target position
    setTargetPosition({ x, y });
    
    // Calculate aiming solution
    if (selectedMortar) {
      try {
        const solution = calculateAimingSolution(selectedMortar, x, y);
        onSolutionCalculated(solution);
      } catch (error) {
        console.error(error);
        onSolutionCalculated(null);
      }
    }
  };
  
  // Handle window resize
  useEffect(() => {
    const updateMapScale = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        setMapScale(rect.width / 1187); // Assuming 1187 is the original map width
      }
    };
    
    window.addEventListener('resize', updateMapScale);
    updateMapScale();
    
    return () => {
      window.removeEventListener('resize', updateMapScale);
    };
  }, [isImageLoaded]);
  
  return (
    <div className={cn("relative overflow-hidden rounded-xl shadow-lg", className)}>
      <div
        ref={mapRef}
        className="relative w-full cursor-crosshair"
        onClick={handleMapClick}
      >
        <img
          src="/lovable-uploads/b7f2695f-582e-43f8-9140-6ca55eee09e5.png"
          alt="Mortar Map"
          className="w-full h-auto"
          onLoad={() => {
            setIsImageLoaded(true);
          }}
        />
        
        {/* Render mortar positions */}
        {isImageLoaded && mortarPositions.map((position) => (
          <div
            key={position.id}
            className={cn(
              "mortar-point absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
              selectedMortar === position.id && "ring-2 ring-white scale-125"
            )}
            style={{
              left: `${position.x * mapScale}px`,
              top: `${position.y * mapScale}px`,
            }}
            title={position.name}
          />
        ))}
        
        {/* Render target position if set */}
        {isImageLoaded && targetPosition && (
          <div 
            className="target-point absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${targetPosition.x * mapScale}px`,
              top: `${targetPosition.y * mapScale}px`,
            }}
          />
        )}
        
        {/* Render line from mortar to target */}
        {isImageLoaded && targetPosition && selectedMortar && (
          <TrajectoryLine
            mortarId={selectedMortar}
            targetPosition={targetPosition}
            mapScale={mapScale}
          />
        )}
      </div>
    </div>
  );
};

interface TrajectoryLineProps {
  mortarId: string;
  targetPosition: { x: number, y: number };
  mapScale: number;
}

const TrajectoryLine: React.FC<TrajectoryLineProps> = ({
  mortarId,
  targetPosition,
  mapScale
}) => {
  const mortar = mortarPositions.find(m => m.id === mortarId);
  if (!mortar) return null;
  
  const startX = mortar.x * mapScale;
  const startY = mortar.y * mapScale;
  const endX = targetPosition.x * mapScale;
  const endY = targetPosition.y * mapScale;
  
  // Calculate length and angle for SVG
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  
  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    >
      <svg className="absolute top-0 left-0 w-full h-full">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-target"
            />
          </marker>
        </defs>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className="stroke-target animate-fade-in"
          strokeWidth="2"
          strokeDasharray="5,5"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    </div>
  );
};

export default MortarMap;
