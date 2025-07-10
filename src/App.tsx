import React, { useState } from 'react';
import { Home, Compass, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import GenerateView from './components/GenerateView';
import HomeView from './components/HomeView';
import PlaceholderView from './components/PlaceholderView';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return (
          <PlaceholderView
            title="Explore Gallery"
            description="Discover amazing AI-generated images from the community"
            icon={<Compass className="w-8 h-8 text-gray-500" />}
          />
        );
      case 'generate':
        return <GenerateView />;
      case 'settings':
        return (
          <PlaceholderView
            title="Settings"
            description="Customize your image generation preferences"
            icon={<Settings className="w-8 h-8 text-gray-500" />}
          />
        );
      default:
        return <GenerateView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;