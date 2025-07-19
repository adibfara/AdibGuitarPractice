import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';
import { NOTES, MODES, getScale } from '../utils/musicTheory';
import { storage } from '../utils/storage';
import Fretboard from './Fretboard';
import type { ScalePracticeSettings, ScalePracticeItem } from '../types';

const ScalesPractice: React.FC = () => {
  const [settings, setSettings] = useState<ScalePracticeSettings>(() =>
    storage.scales.load({
      selectedKeys: ['C'],
      selectedModes: ['Ionian (Major)'],
      practiceList: [],
      currentIndex: 0
    })
  );

  const [showFretboard, setShowFretboard] = useState(true);

  useEffect(() => {
    storage.scales.save(settings);
  }, [settings]);

  const generatePracticeList = () => {
    const newList: ScalePracticeItem[] = [];
    
    settings.selectedKeys.forEach(key => {
      settings.selectedModes.forEach(modeName => {
        const mode = MODES.find(m => m.name === modeName);
        if (mode) {
          const scale = getScale(key, mode);
          newList.push({ key, mode: modeName, scale });
        }
      });
    });

    // Shuffle the list
    for (let i = newList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newList[i], newList[j]] = [newList[j], newList[i]];
    }

    setSettings(prev => ({
      ...prev,
      practiceList: newList,
      currentIndex: 0
    }));
  };

  const toggleKey = (key: string) => {
    setSettings(prev => ({
      ...prev,
      selectedKeys: prev.selectedKeys.includes(key)
        ? prev.selectedKeys.filter(k => k !== key)
        : [...prev.selectedKeys, key]
    }));
  };

  const toggleMode = (mode: string) => {
    setSettings(prev => ({
      ...prev,
      selectedModes: prev.selectedModes.includes(mode)
        ? prev.selectedModes.filter(m => m !== mode)
        : [...prev.selectedModes, mode]
    }));
  };

  const nextScale = () => {
    if (settings.practiceList.length === 0) return;
    
    setSettings(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.practiceList.length
    }));
  };

  const resetProgress = () => {
    setSettings(prev => ({ ...prev, currentIndex: 0 }));
  };

  const currentScale = settings.practiceList[settings.currentIndex];

  return (
    <div className="max-w-6xl mx-auto p-2">


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          
          {/* Key Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                Keys ({settings.selectedKeys.length} selected)
              </label>
              <button
                onClick={() => setSettings(prev => ({ 
                  ...prev, 
                  selectedKeys: prev.selectedKeys.length === NOTES.length ? [] : [...NOTES] 
                }))}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
              >
                {settings.selectedKeys.length === NOTES.length ? 'Clear All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {NOTES.map(key => (
                <button
                  key={key}
                  onClick={() => toggleKey(key)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${settings.selectedKeys.includes(key)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                Modes ({settings.selectedModes.length} selected)
              </label>
              <button
                onClick={() => setSettings(prev => ({ 
                  ...prev, 
                  selectedModes: prev.selectedModes.length === MODES.length 
                    ? [] 
                    : MODES.map(m => m.name)
                }))}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
              >
                {settings.selectedModes.length === MODES.length ? 'Clear All' : 'Select All'}
              </button>
            </div>
            <div className=" grid grid-cols-2 gap-2 ">
              {MODES.map(mode => (
                <button
                  key={mode.name}
                  onClick={() => toggleMode(mode.name)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm text-left transition-colors
                    ${settings.selectedModes.includes(mode.name)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePracticeList}
            disabled={settings.selectedKeys.length === 0 || settings.selectedModes.length === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            Generate Practice List ({settings.selectedKeys.length * settings.selectedModes.length} scales)
          </button>
        </div>

        {/* Current Scale Display */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          {currentScale ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Current Scale</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetProgress}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <span className="text-sm text-gray-400">
                    {settings.currentIndex + 1} / {settings.practiceList.length}
                  </span>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  {currentScale.scale.name}
                </div>
                <div className="text-gray-400">
                  Notes: {currentScale.scale.notes.join(' - ')}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={nextScale}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Next Scale
                </button>
                <button
                  onClick={() => setShowFretboard(!showFretboard)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {showFretboard ? 'Hide' : 'Show'} Fretboard
                </button>
              </div>

              {/* Scale Information */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Key:</span>
                  <span className="text-white font-medium">{currentScale.key}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-white font-medium">{currentScale.mode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pattern:</span>
                  <span className="text-white font-mono text-xs">
                    {currentScale.scale.intervals.join(' - ')}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                Select keys and modes, then generate your practice list
              </div>
              <div className="text-6xl text-gray-600 mb-4">♪</div>
              <div className="text-gray-500">Ready to practice!</div>
            </div>
          )}
        </div>
      </div>

      {/* Fretboard */}
      {currentScale && showFretboard && (
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">

          <Fretboard
            highlightedNotes={currentScale.scale.notes}
            showNoteNames={true}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ScalesPractice;