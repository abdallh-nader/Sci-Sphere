
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { Chemical } from '../context/SimulationContext';
import { chemicals } from '../data/chemicals';
import { Search, Filter, Check, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ChemicalSelectorProps {
  onSelectChemical: (chemicalId: string) => void;
  onCancel: () => void;
  isPouring: boolean;
}

const ChemicalSelector = ({ onSelectChemical, onCancel, isPouring }: ChemicalSelectorProps) => {
  const { language } = useTheme();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | 'solid' | 'liquid' | 'gas'>('all');
  const [open, setOpen] = useState(false);
  const [filteredChemicals, setFilteredChemicals] = useState<Chemical[]>(chemicals);
  
  // Filter chemicals based on search term and state filter
  useEffect(() => {
    let filtered = [...chemicals];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(chem => 
        chem.name.toLowerCase().includes(searchLower) || 
        chem.nameAr.includes(searchLower) ||
        chem.id.toLowerCase().includes(searchLower)
      );
    }
    
    if (stateFilter !== 'all') {
      filtered = filtered.filter(chem => chem.state === stateFilter);
    }
    
    setFilteredChemicals(filtered);
  }, [searchTerm, stateFilter]);
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search.chemicals')}
            className="w-full pl-8 p-2 rounded-lg text-sm bg-background/60 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-lg bg-background/60 hover:bg-background/80 transition">
              <Filter className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t('filter.by.state')}</h4>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setStateFilter('all')}
                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-primary/10 text-sm"
                >
                  <span>{t('all.states')}</span>
                  {stateFilter === 'all' && <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setStateFilter('solid')}
                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-primary/10 text-sm"
                >
                  <span>{t('state.solid')}</span>
                  {stateFilter === 'solid' && <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setStateFilter('liquid')}
                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-primary/10 text-sm"
                >
                  <span>{t('state.liquid')}</span>
                  {stateFilter === 'liquid' && <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setStateFilter('gas')}
                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-primary/10 text-sm"
                >
                  <span>{t('state.gas')}</span>
                  {stateFilter === 'gas' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {stateFilter !== 'all' && (
          <Badge 
            variant="outline" 
            className="text-xs"
            onClick={() => setStateFilter('all')}
          >
            {t(`state.${stateFilter}`)} ✕
          </Badge>
        )}
        {searchTerm && (
          <Badge 
            variant="outline" 
            className="text-xs"
            onClick={() => setSearchTerm('')}
          >
            "{searchTerm}" ✕
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
        {filteredChemicals.length > 0 ? (
          filteredChemicals.map((chemical) => (
            <button
              key={chemical.id}
              onClick={() => onSelectChemical(chemical.id)}
              className="px-3 py-2 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors duration-200 flex items-center button-shine"
              disabled={isPouring}
            >
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: chemical.color }}
              ></span>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="truncate text-xs font-medium">
                  {language === 'en' ? chemical.name : chemical.nameAr}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {language === 'en' 
                    ? chemical.state
                    : t(`state.${chemical.state}`)}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-2 text-center py-4 text-sm text-muted-foreground">
            {t('no.results')}
          </div>
        )}
      </div>
      
      <button
        onClick={onCancel}
        className="w-full px-4 py-2 rounded-lg text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
        disabled={isPouring}
      >
        {t('action.back')}
      </button>
    </div>
  );
};

export default ChemicalSelector;
