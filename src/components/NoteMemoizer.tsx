import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { getRandomNote, GUITAR_TUNING } from '../utils/musicTheory';
import { storage } from '../utils/storage';
import Fretboard from './Fretboard';
import type { NoteMemoريzerSettings } from '../types';

const NoteMemoizer: React.FC = () => {
  const [settings, setSettings] = useState<NoteMemoريzerSettings>(() =>
    storage.notes.load({
      selectedStrings: [1, 2, 3, 4, 5, 6],
      currentNote: 'C',
      currentString: 1,
      currentFret: 0,
      score: 0,
      totalAttempts: 0,
      correctAttempts: 0
    })
  );

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    storage.notes.save(settings);
  }, [settings]);

  useEffect(() => {
    generateNewQuestion();
  }, [settings.selectedStrings]);

  const generateNewQuestion = () => {
    const note = getRandomNote();
    const string = settings.selectedStrings[Math.floor(Math.random() * settings.selectedStrings.length)];
    setSettings(prev => ({
      ...prev,
      currentNote: note,
      currentString: string,
      currentFret: 0
    }));

    setFeedback(null);
    setShowAnswer(false);
  };

  const handleFretClick = (string: number, _fret: number, note: string) => {
    string = 7-string;
    const isCorrect = note === settings.currentNote && string === settings.currentString;
    
    setSettings(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
      correctAttempts: prev.correctAttempts + (isCorrect ? 1 : 0),
      score: prev.totalAttempts > 0 
        ? Math.round(((prev.correctAttempts + (isCorrect ? 1 : 0)) / (prev.totalAttempts + 1)) * 100)
        : (isCorrect ? 100 : 0)
    }));
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setTimeout(() => {
        generateNewQuestion();
      }, 1500);
    } else {
      setShowAnswer(true);
    }
  };

  const toggleString = (string: number) => {
    setSettings(prev => {
      const newSelectedStrings = prev.selectedStrings.includes(string)
        ? prev.selectedStrings.filter(s => s !== string)
        : [...prev.selectedStrings, string].sort();
      
      return {
        ...prev,
        selectedStrings: newSelectedStrings.length > 0 ? newSelectedStrings : [string]
      };
    });
  };

  const resetStats = () => {
    setSettings(prev => ({
      ...prev,
      score: 0,
      totalAttempts: 0,
      correctAttempts: 0
    }));
  };

  const accuracy = settings.totalAttempts > 0 
    ? Math.round((settings.correctAttempts / settings.totalAttempts) * 100)
    : 0;

  const getStringName = (stringNumber: number) => {
    const stringNames = ['1st (High E)', '2nd (B)', '3rd (G)', '4th (D)', '5th (A)', '6th (Low E)'];
    return stringNames[stringNumber - 1];
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Settings Panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>
          
          {/* String Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Practice Strings ({settings.selectedStrings.length} selected)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map(string => (
                <button
                  key={string}
                  onClick={() => toggleString(string)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm text-left transition-colors flex items-center justify-between
                    ${settings.selectedStrings.includes(string)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  <span>{getStringName(string)}</span>
                  <span className="text-xs opacity-75">
                    {GUITAR_TUNING[string - 1]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <button
              onClick={generateNewQuestion}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              New Question
            </button>
            
            <button
              onClick={resetStats}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Reset Stats
            </button>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 content-center">
          <div className="text-center">

            
            <div className="mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                {settings.currentNote}
              </div>
              <div className="text-orange-400 font-semibold text-lg mb-2">
                on {getStringName(settings.currentString)}
              </div>
              <div className="text-gray-400">
                Click the correct position on the fretboard
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`
                flex items-center justify-center gap-2 p-3 rounded-lg mb-4
                ${feedback === 'correct' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }
              `}>
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Incorrect
                  </>
                )}
              </div>
            )}

            {/* Show Answer */}
            {showAnswer && (
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 p-3 rounded-lg mb-4">
                <div className="text-sm">Correct positions shown on fretboard</div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 content-center">
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {accuracy}%
              </div>
              <div className="text-gray-400 text-sm">Accuracy</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {settings.correctAttempts}
                </div>
                <div className="text-gray-400 text-xs">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {settings.totalAttempts - settings.correctAttempts}
                </div>
                <div className="text-gray-400 text-xs">Incorrect</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-semibold text-white">
                {settings.totalAttempts}
              </div>
              <div className="text-gray-400 text-sm">Total Attempts</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fretboard */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Fretboard</h3>
        <Fretboard
          onFretClick={handleFretClick}
          highlightedNotes={showAnswer ? [settings.currentNote] : []}
          highlightedString={7-settings.currentString}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default NoteMemoizer;