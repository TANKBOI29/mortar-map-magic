
import React, { useState } from 'react';
import MortarMap from '@/components/MortarMap';
import ControlPanel from '@/components/ControlPanel';
import AimingSolutionPanel from '@/components/AimingSolutionPanel';
import { AimingSolution } from '@/lib/mortar-utils';
import { mortarPositions } from '@/lib/mortar-utils';

const Index = () => {
  const [selectedMortar, setSelectedMortar] = useState<string>(mortarPositions[0].id);
  const [aimingSolution, setAimingSolution] = useState<AimingSolution | null>(null);

  const handleSolutionCalculated = (solution: AimingSolution | null) => {
    setAimingSolution(solution);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary/20 overflow-x-hidden">
      <div className="container py-6 lg:py-10 px-4 max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2 animate-fade-in">
            Mortar Aiming System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            Use this tool to calculate precise aiming solutions for your mortar system. Select a mortar position and click on the map to set your target.
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <MortarMap
              className="w-full h-auto animate-scale-in"
              selectedMortar={selectedMortar}
              onSolutionCalculated={handleSolutionCalculated}
            />
          </div>

          <div className="space-y-6">
            <ControlPanel
              className="animate-slide-up"
              selectedMortar={selectedMortar}
              onSelectMortar={setSelectedMortar}
            />
            
            <AimingSolutionPanel
              className="animate-slide-up"
              solution={aimingSolution}
            />
          </div>
        </div>
        
        <footer className="mt-10 text-center text-sm text-muted-foreground">
          <p>
            Mortar positioning data based on in-game map coordinates. For simulation purposes only.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
