import React, { useState } from 'react';
import { Music, Timer, Brain, Guitar, X } from 'lucide-react';
import Metronome from './components/Metronome';
import ScalesPractice from './components/ScalesPractice';
import NoteMemoizer from './components/NoteMemoizer';
import type { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('metronome');
  const [showMetronomePopup, setShowMetronomePopup] = useState(false);

  const navigationItems = [
    { id: 'scales' as AppView, label: 'Scales', icon: Music },
    { id: 'notes' as AppView, label: 'Notes', icon: Brain }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'scales':
        return <ScalesPractice />;
      case 'notes':
        return <NoteMemoizer />;
      default:
        return <ScalesPractice />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Guitar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Adib Guitar Practice Studio</h1>
                <p className="text-xs text-gray-400">Master your craft</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {/* Metronome Button */}
              <button
                onClick={() => setShowMetronomePopup(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-600 hover:border-orange-500"
              >
                <Timer className="w-4 h-4" />
                <span className="hidden sm:inline">Metronome</span>
              </button>
              
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${currentView === item.id
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {renderCurrentView()}
      </main>

      {/* Metronome Popup */}
      {showMetronomePopup && (
        <div className="fixed top-0 right-0 h-full w-96 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 z-50 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">Metronome</h2>
            <button
              onClick={() => setShowMetronomePopup(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="p-4 h-full overflow-y-auto">
            <Metronome />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-sm border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p className="text-xs mt-2 opacity-75">
              Adib Guitar Practice Studio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;