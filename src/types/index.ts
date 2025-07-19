// Core types for the guitar practice application

export interface Scale {
  name: string;
  intervals: number[];
  notes: string[];
}

export interface Mode {
  name: string;
  intervals: number[];
}

export interface Note {
  name: string;
  frequency: number;
}

export interface FretboardPosition {
  string: number;
  fret: number;
  note: string;
}

export interface MetronomeSettings {
  bpm: number;
  timeSignature: TimeSignature;
  isPlaying: boolean;
  volume: number;
  clickSound: string;
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface ScalePracticeSettings {
  selectedKeys: string[];
  selectedModes: string[];
  practiceList: ScalePracticeItem[];
  currentIndex: number;
}

export interface ScalePracticeItem {
  key: string;
  mode: string;
  scale: Scale;
}

export interface NoteMemoريzerSettings {
  selectedStrings: number[];
  currentNote: string;
  currentString: number;
  currentFret: number;
  score: number;
  totalAttempts: number;
  correctAttempts: number;
}

export type AppView = 'metronome' | 'scales' | 'notes';