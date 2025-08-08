import React from 'react';
import { Calendar, Copy, Download } from 'lucide-react';
import { ImageRecord } from '../services/imageStorage';

interface ImageCardProps {
  image: ImageRecord;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const downloadImage = async () => {
    try {
      const link = document.createElement('a');
      link.href = image.image_url;
      link.download = `generated-image-${image.id}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={image.image_url}
          alt={image.prompt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Prompt */}
        <p className="text-gray-800 text-sm leading-relaxed mb-4 line-clamp-3">
          {image.prompt}
        </p>
        
        {/* Date */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(image.created_at)}
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={copyPrompt}
            className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
