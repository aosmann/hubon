import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface OutputPreviewProps {
  prompt: string;
  ratio: string;
  style: string;
  generatedImage?: string;
  revisedPrompt?: string;
}

const OutputPreview: React.FC<OutputPreviewProps> = ({ 
  prompt, 
  ratio, 
  style, 
  generatedImage, 
  revisedPrompt 
}) => {
  const getRatioLabel = (ratio: string) => {
    const ratioMap: { [key: string]: string } = {
      '1:1': 'Square (1:1)',
      '16:9': 'Horizontal (16:9)',
      '9:16': 'Vertical (9:16)',
      '4:3': 'Facebook (4:3)',
      '3:4': 'Facebook (3:4)'
    };
    return ratioMap[ratio] || ratio;
  };

  const outputText = `${prompt} | ${getRatioLabel(ratio)} | ${style}`;

  return (
    <div className="space-y-6">
      {/* Text Output */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">
            Generation Parameters
          </label>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-800 leading-relaxed">
            {outputText || 'Enter your prompt and select options to see the preview...'}
          </p>
        </div>
      </div>

      {/* Image Preview */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">
            Generated Image
          </label>
        </div>
        <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                Your generated image will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputPreview;