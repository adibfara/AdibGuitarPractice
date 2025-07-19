import React from 'react';
import { getNoteAtPosition } from '../utils/musicTheory';

interface FretboardProps {
  highlightedNotes?: string[];
  highlightedString?: number;
  onFretClick?: (string: number, fret: number, note: string) => void;
  showNoteNames?: boolean;
  maxFrets?: number;
  className?: string;
}

const Fretboard: React.FC<FretboardProps> = ({
  highlightedNotes = [],
  highlightedString,
  onFretClick,
  showNoteNames = false,
  maxFrets = 12,
  className = ''
}) => {
  const strings = ['E', 'B', 'G', 'D', 'A', 'E']; // High to low for visual representation
  const fretMarkers = [3, 5, 7, 9, 12]; // Standard fret markers
  const doubleDotFrets = [12]; // Frets with double dots

  const handleFretClick = (string: number, fret: number) => {
    const actualString = 6 - string; // Convert visual string to actual string number (1-6)
    const note = getNoteAtPosition(actualString, fret);
    onFretClick?.(actualString, fret, note);
  };

  const isHighlighted = (string: number, fret: number) => {
    const actualString = 6 - string; // Convert visual string to actual string number (1-6)
    const note = getNoteAtPosition(actualString, fret);
    return highlightedNotes.includes(note);
  };

  const isStringHighlighted = (string: number) => {
    const actualString = 6 - string; // Convert visual string to actual string number (1-6)
    return highlightedString === actualString;
  };
  return (
    <div className={`fretboard ${className}`}>



      {/* Strings and frets */}
      <div className="space-y-3">
        {strings.map((openNote, stringIndex) => (
          <div key={stringIndex} className={`flex items-center ${isStringHighlighted(stringIndex) ? 'bg-orange-500/10 rounded-lg p-1' : ''}`}>
            {/* String label */}
            <div className={`w-12 text-right pr-2 text-sm font-medium ${isStringHighlighted(stringIndex) ? 'text-orange-400' : 'text-gray-300'}`}>
              {openNote}
            </div>
            
            {/* Nut */}
            <div className={`w-1 h-8 mr-1 ${isStringHighlighted(stringIndex) ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
            
            {/* Frets */}
            <div className="flex flex-1">
              {Array.from({ length: maxFrets }, (_, fret) => {
                const actualString = 6 - stringIndex; // Convert visual string to actual string number (1-6)
                const note = getNoteAtPosition(actualString, fret + 1);
                const highlighted = isHighlighted(stringIndex, fret + 1);
                
                return (
                  <div
                    key={fret}
                    className={`flex-1 relative border-r border-gray-600 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-colors ${isStringHighlighted(stringIndex) ? 'bg-orange-500/5' : ''}`}
                    onClick={() => handleFretClick(stringIndex, fret + 1)}
                  >
                    {/* String line */}
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full h-0.5 ${isStringHighlighted(stringIndex) ? 'bg-orange-400' : stringIndex < 2 ? 'bg-gray-400' : stringIndex < 4 ? 'bg-gray-500' : 'bg-gray-600'}`}></div>
                    </div>
                    
                    {/* Note dot */}
                    {(highlighted || showNoteNames) && (
                      <div
                        className={`
                          relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                          ${highlighted 
                            ? 'bg-orange-500 text-white shadow-lg' 
                            : 'bg-gray-600 text-gray-300'
                          }
                        `}
                      >
                        {note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fret markers */}
      <div className="flex mt-1">
        <div className="w-12"></div> {/* Spacer for nut */}
        {Array.from({ length: maxFrets }, (_, fret) => (
            <div key={fret} className="flex-1 flex justify-center items-center h-4">
              {fretMarkers.includes(fret + 1) && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    {doubleDotFrets.includes(fret + 1) && (
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    )}
                  </div>
              )}
            </div>
        ))}
      </div>
      {/* Fret numbers */}
      <div className="flex mt-2">
        <div className="w-12"></div> {/* Spacer for nut */}
        {Array.from({ length: maxFrets }, (_, i) => (
            <div key={i} className="flex-1 text-center text-xs text-gray-400">
              {i + 1}
            </div>
        ))}
      </div>
    </div>
  );
};

export default Fretboard;