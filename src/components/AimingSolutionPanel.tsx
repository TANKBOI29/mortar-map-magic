
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Crosshair, Target, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AimingSolution, getCompassDirection } from '@/lib/mortar-utils';

interface AimingSolutionPanelProps {
  className?: string;
  solution: AimingSolution | null;
}

const AimingSolutionPanel: React.FC<AimingSolutionPanelProps> = ({
  className,
  solution
}) => {
  if (!solution) {
    return (
      <Card className={cn("glass-panel", className)}>
        <CardHeader>
          <CardTitle className="text-center text-lg">Mortar Aiming Solution</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Select a mortar position and click on the map to calculate an aiming solution.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-panel animate-scale-in", className)}>
      <CardHeader>
        <CardTitle className="text-center text-lg">Mortar Aiming Solution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          {/* Azimuth Indicator */}
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 w-10 h-10">
              <Compass className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Azimuth (Direction)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{solution.azimuth}°</div>
                <div className="text-sm text-muted-foreground">
                  {getCompassDirection(solution.azimuth)}
                </div>
              </div>
            </div>
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <div className="absolute h-8 w-0.5 bg-primary rounded origin-bottom transform transition-all duration-500"
                    style={{ transform: `rotate(${solution.azimuth}deg)` }}></div>
                <div className="absolute text-[10px] font-medium top-1">N</div>
                <div className="absolute text-[10px] font-medium bottom-1">S</div>
                <div className="absolute text-[10px] font-medium left-1">W</div>
                <div className="absolute text-[10px] font-medium right-1">E</div>
              </div>
            </div>
          </div>

          {/* Elevation Indicator */}
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 w-10 h-10">
              <Crosshair className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Elevation</div>
              <div className="text-2xl font-bold">{solution.elevation}°</div>
            </div>
            <div className="w-20 h-10 relative">
              <div className="absolute bottom-0 w-full h-0.5 bg-primary/20"></div>
              <div className="absolute bottom-0 left-1/2 h-8 w-0.5 bg-primary/20 origin-bottom transform rotate-90"></div>
              <div className="absolute bottom-0 left-1/2 h-8 w-0.5 bg-primary origin-bottom transform transition-all duration-500"
                  style={{ transform: `rotate(${90 - solution.elevation}deg)` }}></div>
            </div>
          </div>

          {/* Distance Indicator */}
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 w-10 h-10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Distance</div>
              <div className="text-2xl font-bold">{solution.distance} units</div>
            </div>
          </div>

          {/* Flight Time Indicator */}
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 w-10 h-10">
              <Clock3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Estimated Flight Time</div>
              <div className="text-2xl font-bold">{solution.timeOfFlight} sec</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AimingSolutionPanel;
