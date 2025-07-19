// Music theory utilities and constants

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const MODES = [
  { name: 'Ionian (Major)', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
  { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11] },
  { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
  { name: 'Aeolian (Natural Minor)', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10] }
];

export const TIME_SIGNATURES = [
  { numerator: 4, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 2, denominator: 4 },
  { numerator: 6, denominator: 8 },
  { numerator: 5, denominator: 4 },
  { numerator: 7, denominator: 8 }
];

// Standard guitar tuning (low to high)
export const GUITAR_TUNING = ['E', 'A', 'D', 'G', 'B', 'E']; // 6th, 5th, 4th, 3rd, 2nd, 1st strings

// Hardcoded string notes for accurate fretboard mapping
// Each array represents frets 0-12 for each string
export const STRING_NOTES = {
  1: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'], // 6th string (Low E)
  2: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'], // 5th string (A)
  3: ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'], // 4th string (D)
  4: ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'], // 3rd string (G)
  5: ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], // 2nd string (B)
  6: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E']  // 1st string (High E)
};

export function getScale(key: string, mode: typeof MODES[0]) {
  const keyIndex = NOTES.indexOf(key);
  const scaleNotes = mode.intervals.map(interval => {
    const noteIndex = (keyIndex + interval) % 12;
    return NOTES[noteIndex];
  });
  
  return {
    name: `${key} ${mode.name}`,
    intervals: mode.intervals,
    notes: scaleNotes
  };
}

export function getNoteAtPosition(string: number, fret: number): string {
  // Use hardcoded string notes for accurate mapping
  if (fret < 0 || fret > 12 || string < 0 || string > 6) {
    return 'C'; // Default fallback
  }
  
  return STRING_NOTES[string as keyof typeof STRING_NOTES][fret];
}

export function getPositionsForNote(note: string, maxFret: number = 12): Array<{string: number, fret: number}> {
  const positions: Array<{string: number, fret: number}> = [];
  
  for (let string = 1; string <= 6; string++) {
    for (let fret = 0; fret <= maxFret; fret++) {
      const stringNotes = STRING_NOTES[string as keyof typeof STRING_NOTES];
      if (stringNotes[fret] === note) {
        positions.push({ string, fret });
      }
    }
  }
  
  return positions;
}

export function getRandomNote(): string {
  return NOTES[Math.floor(Math.random() * NOTES.length)];
}

export function getRandomString(): number {
  return Math.floor(Math.random() * 6) + 1;
}