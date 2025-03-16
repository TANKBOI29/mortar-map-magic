
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { mortarPositions } from '@/lib/mortar-utils';

interface ControlPanelProps {
  className?: string;
  selectedMortar: string;
  onSelectMortar: (mortarId: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  className,
  selectedMortar,
  onSelectMortar
}) => {
  return (
    <Card className={cn("glass-panel", className)}>
      <CardHeader>
        <CardTitle className="text-center text-lg">Mortar Control Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Select Mortar Position</label>
          <Select value={selectedMortar} onValueChange={onSelectMortar}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select mortar" />
            </SelectTrigger>
            <SelectContent>
              {mortarPositions.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-md text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 pl-1">
            <li>Select a mortar position from the dropdown</li>
            <li>Click anywhere on the map to set a target</li>
            <li>Use the calculated aiming solution to adjust your mortar</li>
          </ol>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4">
          <p className="mb-1">Color Legend:</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-mortar"></div>
            <span>Mortar Position</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-target"></div>
            <span>Target Position</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
