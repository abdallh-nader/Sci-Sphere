
import React from 'react';
import { useTranslation } from '../utils/i18n';
import { Thermometer, Gauge, Droplets } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface ReactionParametersProps {
  temperature: number;
  pressure: number;
  globalQuantity: number;
  isReacting: boolean;
  onTemperatureChange: (value: number) => void;
  onPressureChange: (value: number) => void;
  onGlobalQuantityChange: (value: number[]) => void;
}

const ReactionParameters = ({
  temperature,
  pressure,
  globalQuantity,
  isReacting,
  onTemperatureChange,
  onPressureChange,
  onGlobalQuantityChange
}: ReactionParametersProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-secondary/10">
        <label className="text-sm font-medium flex items-center mb-2">
          <Droplets className="w-4 h-4 mr-1" />
          {t('sim.default.quantity', 'Default Quantity')}: {globalQuantity} ml
        </label>
        <Slider
          value={[globalQuantity]}
          min={0.5}
          max={10}
          step={0.5}
          onValueChange={onGlobalQuantityChange}
          disabled={isReacting}
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t('sim.quantity.help', 'Default quantity for new chemicals')}
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium flex items-center">
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
        <label className="text-sm font-medium flex items-center">
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
    </div>
  );
};

export default ReactionParameters;
