
import React from 'react';
import { CirclePlay, CircleStop, Thermometer, Gauge, RefreshCcw, Plus } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface MobileReactionControlsProps {
  temperature: number;
  pressure: number;
  isReacting: boolean;
  hasSufficientReactants: boolean;
  onTemperatureChange: (value: number) => void;
  onPressureChange: (value: number) => void;
  onToggleReaction: () => void;
  onResetSimulation?: () => void;
  onAddChemical?: () => void; // New prop for adding chemicals
}

const MobileReactionControls = ({
  temperature,
  pressure,
  isReacting,
  hasSufficientReactants,
  onTemperatureChange,
  onPressureChange,
  onToggleReaction,
  onResetSimulation,
  onAddChemical
}: MobileReactionControlsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 bg-background/95 backdrop-blur-md border border-border rounded-lg mt-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium flex items-center mb-2">
            <Thermometer className="w-4 h-4 mr-1" />
            {t('sim.temperature')}: {temperature}°C
          </label>
          <Slider
            value={[temperature]}
            min={0}
            max={150}
            step={1}
            onValueChange={(value) => onTemperatureChange(value[0])}
            disabled={isReacting}
            className="mt-2"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium flex items-center mb-2">
            <Gauge className="w-4 h-4 mr-1" />
            {t('sim.pressure')}: {pressure} atm
          </label>
          <Slider
            value={[pressure]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={(value) => onPressureChange(value[0])}
            disabled={isReacting}
            className="mt-2"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onToggleReaction}
            className={`flex-1 px-4 py-3 rounded-lg font-medium ${
              isReacting 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            } transition-colors duration-200 flex items-center justify-center`}
            disabled={!isReacting && !hasSufficientReactants}
          >
            {isReacting ? (
              <>
                <CircleStop className="w-5 h-5 mr-2" />
                {t('sim.stop.reaction')}
              </>
            ) : (
              <>
                <CirclePlay className="w-5 h-5 mr-2" />
                {t('sim.start.reaction')}
              </>
            )}
          </Button>
          
          {/* Reset Button - always show it */}
          <Button
            onClick={onResetSimulation}
            className="px-4 py-3 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center"
            disabled={isReacting}
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            {t('sim.reset', 'Reset')}
          </Button>
          
          {/* Add Chemical Button - show even during reaction */}
          {onAddChemical && (
            <Button
              onClick={onAddChemical}
              className="px-4 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('sim.add', 'Add')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileReactionControls;
