
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Beaker, Lightbulb, Volume2, VolumeX, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MobileControlsProps {
  soundEnabled: boolean;
  toggleSound: () => void;
  showTips?: boolean;
  backPath?: string;
  showReactionControls?: boolean;
  temperature?: number;
  pressure?: number;
  onTemperatureChange?: (value: number) => void;
  onPressureChange?: (value: number) => void;
  isReacting?: boolean;
  onToggleReaction?: () => void;
  hasSufficientReactants?: boolean;
  onResetSimulation?: () => void; // Added reset functionality
}

const MobileControls = ({
  soundEnabled,
  toggleSound,
  showTips = false,
  backPath = "/",
  showReactionControls = false,
  temperature = 25,
  pressure = 1,
  onTemperatureChange,
  onPressureChange,
  isReacting = false,
  onToggleReaction,
  hasSufficientReactants = false,
  onResetSimulation,
}: MobileControlsProps) => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-30 px-4 py-3 flex justify-between items-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(backPath)}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex space-x-2">
        {showReactionControls && onToggleReaction && (
          <Button
            variant={isReacting ? "destructive" : "default"}
            size="sm"
            onClick={onToggleReaction}
            disabled={!isReacting && !hasSufficientReactants}
          >
            {isReacting ? t('sim.stop.reaction', 'Stop') : t('sim.start.reaction', 'Start')}
          </Button>
        )}
        
        {/* Reset Button */}
        {onResetSimulation && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetSimulation}
            disabled={isReacting}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSound}
          aria-label={soundEnabled ? t('sound.disable', 'Disable sound') : t('sound.enable', 'Enable sound')}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
        
        {showTips && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Lightbulb className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'en' ? "right" : "left"}>
              <SheetHeader>
                <SheetTitle>{t('freemode.tips.title', 'Experimentation Tips')}</SheetTitle>
                <SheetDescription>
                  {t('freemode.tips.description', 'How to get the most out of your experiments')}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <Alert variant="default" className="bg-primary/5 border-primary/20">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>{t('freemode.tips.title', 'Experimentation Tips')}</AlertTitle>
                  <AlertDescription className="mt-2">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>{t('freemode.tips.combine', 'Combine at least two chemicals to start a reaction')}</li>
                      <li>{t('freemode.tips.temperature', 'Adjust temperature to see different reaction results')}</li>
                      <li>{t('freemode.tips.states', 'Mix chemicals in different states (solid, liquid, gas) for varied effects')}</li>
                      <li>{t('freemode.tips.acid', 'Try acid-base or metal-acid combinations for dramatic reactions')}</li>
                      <li>{t('freemode.tips.intense', 'Some intense combinations may even break the test tube!')}</li>
                      <li>{t('freemode.tips.quantity', 'Change chemical quantity (ml) to control reaction intensity')}</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default MobileControls;
