import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ImageIcon } from 'lucide-react';
import { getImageHistory, ImageRecord } from '../services/imageStorage';
import ImageCard from './ImageCard';

const HomeView: React.FC = () => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadImages = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const imageHistory = await getImageHistory();
      setImages(imageHistory);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleRefresh = () => {
    loadImages(true);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your creations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Creations</h1>
            <p className="text-gray-600">
              {images.length > 0 
                ? `${images.length} AI-generated images in your gallery`
                : 'Start generating images to see them here'
              }
            </p>
          </div>
          
          {images.length > 0 && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* Content */}
        {images.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start creating amazing AI-generated images. Your creations will appear here as beautiful cards.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Go to Generate tab to create your first image</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
