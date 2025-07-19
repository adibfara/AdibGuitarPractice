import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { MetronomeAudio } from '../utils/audio';
import { TIME_SIGNATURES } from '../utils/musicTheory';
import { storage } from '../utils/storage';
import type { MetronomeSettings, TimeSignature } from '../types';

const Metronome: React.FC = () => {
  const [settings, setSettings] = useState<MetronomeSettings>(() =>
    storage.metronome.load({
      bpm: 120,
      timeSignature: { numerator: 4, denominator: 4 },
      isPlaying: false,
      volume: 0.5,
      clickSound: 'classic'
    })
  );

  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<MetronomeAudio>(new MetronomeAudio());

  useEffect(() => {
    storage.metronome.save(settings);
  }, [settings]);

  useEffect(() => {
    if (settings.isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.isPlaying, settings.bpm, settings.timeSignature]);

  const startMetronome = async () => {
    await audioRef.current.initialize();
    
    const interval = (60 / settings.bpm) * 1000;
    
    intervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        const nextBeat = (prev + 1) % settings.timeSignature.numerator;
        const isAccent = nextBeat === 0;
        audioRef.current.playClick(isAccent, settings.volume);
        return nextBeat;
      });
    }, interval);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentBeat(0);
  };

  const toggleMetronome = () => {
    setSettings(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const updateBPM = (newBpm: number) => {
    setSettings(prev => ({ ...prev, bpm: Math.max(40, Math.min(200, newBpm)) }));
  };

  const updateTimeSignature = (timeSignature: TimeSignature) => {
    setSettings(prev => ({ ...prev, timeSignature }));
    setCurrentBeat(0);
  };

  const updateVolume = (volume: number) => {
    setSettings(prev => ({ ...prev, volume }));
    audioRef.current.setVolume(volume);
  };

  return (
    <div className="w-full">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        {/* BPM Display */}
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-white mb-1">{settings.bpm}</div>
          <div className="text-gray-400 text-sm">BPM</div>
        </div>

        {/* BPM Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => updateBPM(settings.bpm - 1)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            -1
          </button>
          <button
            onClick={() => updateBPM(settings.bpm - 10)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            -10
          </button>
          <input
            type="range"
            min="40"
            max="200"
            value={settings.bpm}
            onChange={(e) => updateBPM(parseInt(e.target.value))}
            className="flex-1 mx-2 accent-orange-500"
          />
          <button
            onClick={() => updateBPM(settings.bpm + 10)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            +10
          </button>
          <button
            onClick={() => updateBPM(settings.bpm + 1)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            +1
          </button>
        </div>

        {/* Beat Indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: settings.timeSignature.numerator }, (_, i) => (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-150
                ${currentBeat === i && settings.isPlaying
                  ? i === 0 
                    ? 'bg-orange-400 shadow-lg shadow-orange-400/50 scale-125' 
                    : 'bg-orange-300 shadow-lg shadow-orange-300/50 scale-125'
                  : 'bg-gray-600'
                }
              `}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleMetronome}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
              ${settings.isPlaying
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                : 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30'
              }
            `}
          >
            {settings.isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Time Signature Selection */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Signature
            </label>
            <select
              value={`${settings.timeSignature.numerator}/${settings.timeSignature.denominator}`}
              onChange={(e) => {
                const [num, den] = e.target.value.split('/').map(Number);
                updateTimeSignature({ numerator: num, denominator: den });
              }}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {TIME_SIGNATURES.map((sig) => (
                <option key={`${sig.numerator}/${sig.denominator}`} value={`${sig.numerator}/${sig.denominator}`}>
                  {sig.numerator}/{sig.denominator}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Volume
            </label>
            <div className="flex items-center gap-3">
              <Volume2 className="w-3 h-3 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => updateVolume(parseFloat(e.target.value))}
                className="flex-1 accent-orange-500"
              />
              <span className="text-xs text-gray-400 w-6">
                {Math.round(settings.volume * 100)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick BPM Presets */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm font-medium text-gray-300 mb-2">Quick Tempos</div>
          <div className="grid grid-cols-2 gap-1">
            {[60, 80, 100, 120, 140, 160, 180, 200].map((bpm) => (
              <button
                key={bpm}
                onClick={() => updateBPM(bpm)}
                className={`
                  px-2 py-1 rounded text-xs transition-colors
                  ${settings.bpm === bpm
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }
                `}
              >
                {bpm}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metronome;