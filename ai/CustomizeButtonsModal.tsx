import React, { useState, useMemo } from 'react';
import { X, Search, Settings, Target, Check, RotateCcw, Download, Upload, Sparkles, Brain, Palette } from 'lucide-react';
import { useCustomizationStore, CustomizationLocation } from '../../store/customizationStore';
import { AI_GOALS, AI_GOAL_CATEGORIES, getGoalById, getRecommendedGoals } from '../../data/aiGoals';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import SelectableGoalCard from './SelectableGoalCard';

interface CustomizeButtonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: CustomizationLocation;
  entityType?: 'contact' | 'deal' | 'company';
}

const CustomizeButtonsModal: React.FC<CustomizeButtonsModalProps> = ({
  isOpen,
  onClose,
  initialLocation = 'contactCards',
  entityType = 'contact'
}) => {
  const {
    buttonConfigurations,
    setButtonConfiguration,
    resetToDefaults,
    exportConfiguration,
    importConfiguration
  } = useCustomizationStore();

  const [activeLocation, setActiveLocation] = useState<CustomizationLocation>(initialLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showRecommended, setShowRecommended] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    buttonConfigurations[activeLocation] || []
  );

  // Update selected goals when location changes
  React.useEffect(() => {
    setSelectedGoals(buttonConfigurations[activeLocation] || []);
  }, [activeLocation, buttonConfigurations]);

  // Filtered goals based on search, category, and recommendations
  const filteredGoals = useMemo(() => {
    let goals = AI_GOALS;

    // Filter by search query
    if (searchQuery) {
      goals = goals.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      goals = goals.filter(goal => goal.category === selectedCategory);
    }

    // Filter by recommendations
    if (showRecommended) {
      const entityTypeForLocation = activeLocation.includes('contact') ? 'contact' : 
                                   activeLocation.includes('deal') ? 'deal' : 'company';
      const recommended = getRecommendedGoals(entityTypeForLocation);
      goals = goals.filter(goal => recommended.some(r => r.id === goal.id));
    }

    return goals;
  }, [searchQuery, selectedCategory, showRecommended, activeLocation]);

  const locationLabels = {
    contactCards: 'Contact Cards',
    dealCards: 'Deal Cards',
    contactDetail: 'Contact Detail Pages',
    dealDetail: 'Deal Detail Pages'
  };

  const maxButtonsPerLocation = 6;

  const handleGoalToggle = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(prev => prev.filter(id => id !== goalId));
    } else if (selectedGoals.length < maxButtonsPerLocation) {
      setSelectedGoals(prev => [...prev, goalId]);
    }
  };

  const handleSave = () => {
    setButtonConfiguration(activeLocation, selectedGoals);
    onClose();
  };

  const handleReset = () => {
    resetToDefaults(activeLocation);
    setSelectedGoals(buttonConfigurations[activeLocation] || []);
  };

  const handleExport = () => {
    const config = exportConfiguration();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-button-configuration.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importConfiguration(content);
      if (success) {
        setSelectedGoals(buttonConfigurations[activeLocation] || []);
      } else {
        alert('Invalid configuration file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-6xl px-6 pt-6 pb-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
          {/* Header - matching AI Goals page style */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customize AI Goals</h1>
                <p className="text-gray-600 mt-1">
                  Personalize your AI tools for different areas of the CRM
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Location Tabs - Card style */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900">Customize For</h4>
                  <p className="text-sm text-gray-600">Select where to customize buttons</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(locationLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveLocation(key as CustomizationLocation)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeLocation === key
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {label}
                      <span className="block text-xs text-gray-500 mt-1">
                        {buttonConfigurations[key as CustomizationLocation]?.length || 0} / {maxButtonsPerLocation} buttons
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card className="mt-4">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900">Configuration</h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Reset to Defaults
                  </Button>
                  
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Download size={16} className="mr-2" />
                    Export Config
                  </Button>
                  
                  <label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start cursor-pointer"
                      asChild
                    >
                      <span>
                        <Upload size={16} className="mr-2" />
                        Import Config
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search and Filters Card */}
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900">Find AI Goals</h4>
                  <p className="text-sm text-gray-600">Search and filter from {AI_GOALS.length} available goals</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search AI goals..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="All">All Categories</option>
                      {AI_GOAL_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>

                    {/* Recommended Toggle */}
                    <Button
                      onClick={() => setShowRecommended(!showRecommended)}
                      variant={showRecommended ? "default" : "outline"}
                      size="sm"
                      className={showRecommended ? "bg-gradient-to-r from-yellow-500 to-orange-500" : ""}
                    >
                      <Sparkles size={16} className="mr-2" />
                      Recommended Only
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Goals Preview Card */}
              <Card>
                <CardHeader>
                  <h5 className="text-lg font-semibold text-gray-900">
                    Selected for {locationLabels[activeLocation]}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {selectedGoals.length}/{maxButtonsPerLocation} goals selected
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedGoals.map(goalId => {
                      const goal = getGoalById(goalId);
                      return goal ? (
                        <span
                          key={goalId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200"
                        >
                          {goal.title}
                          <button
                            onClick={() => handleGoalToggle(goalId)}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ) : null;
                    })}
                    {selectedGoals.length === 0 && (
                      <span className="text-sm text-gray-500">No goals selected - choose from the grid below</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Goals Grid - Using Exact InteractiveGoalCard Design */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Available AI Goals</h4>
                  <p className="text-sm text-gray-600">{filteredGoals.length} goals found</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                  {filteredGoals.map(goal => {
                    const isSelected = selectedGoals.includes(goal.id);
                    const canSelect = !isSelected && selectedGoals.length < maxButtonsPerLocation;
                    
                    return (
                      <SelectableGoalCard
                        key={goal.id}
                        goal={goal}
                        isSelected={isSelected}
                        canSelect={canSelect}
                        onToggle={handleGoalToggle}
                      />
                    );
                  })}
                </div>

                {filteredGoals.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeButtonsModal;