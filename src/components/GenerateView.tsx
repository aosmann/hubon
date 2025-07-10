import React, { useState } from 'react';
import { Ratio as AspectRatio, Palette } from 'lucide-react';
import TextInput from './TextInput';
import Dropdown from './Dropdown';
import SubmitButton from './SubmitButton';
import OutputPreview from './OutputPreview';

const GenerateView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('1:1');
  const [style, setStyle] = useState('Primary1');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const ratioOptions = [
    { id: '1', label: 'Square (1:1)', value: '1:1' },
    { id: '2', label: 'Horizontal (16:9)', value: '16:9' },
    { id: '3', label: 'Vertical (9:16)', value: '9:16' },
    { id: '4', label: 'Facebook (4:3)', value: '4:3' },
    { id: '5', label: 'Facebook (3:4)', value: '3:4' },
  ];

  const styleOptions = [
    { id: '1', label: 'Primary1', value: 'Primary1' },
    { id: '2', label: 'Primary2', value: 'Primary2' },
    { id: '3', label: 'Secondary', value: 'Secondary' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, using a placeholder image
    setGeneratedImage('https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=800');
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Image</h1>
          <p className="text-gray-600">Create beautiful images with AI using your custom prompts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <TextInput
                value={prompt}
                onChange={setPrompt}
                placeholder="Describe the image you want to generate..."
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown
                  options={ratioOptions}
                  value={ratio}
                  onChange={setRatio}
                  label="Aspect Ratio"
                  icon={<AspectRatio className="w-5 h-5 text-gray-500" />}
                />
                <Dropdown
                  options={styleOptions}
                  value={style}
                  onChange={setStyle}
                  label="Style"
                  icon={<Palette className="w-5 h-5 text-gray-500" />}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <SubmitButton
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                loading={isGenerating}
              />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <OutputPreview
              prompt={prompt}
              ratio={ratio}
              style={style}
              generatedImage={generatedImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateView;