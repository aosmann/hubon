import React from 'react';

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, icon }) => {
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderView;