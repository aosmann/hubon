import React, { useState } from 'react';
import { Ratio as AspectRatio, Palette, AlertCircle } from 'lucide-react';
import TextInput from './TextInput';
import Dropdown from './Dropdown';
import SubmitButton from './SubmitButton';
import OutputPreview from './OutputPreview';
import { generateImage } from '../services/imageGeneration';
import { saveGeneratedImage } from '../services/imageStorage';

const GenerateView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('1:1');
  const [style, setStyle] = useState('Primary1');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [revisedPrompt, setRevisedPrompt] = useState<string>('');

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
    
    setError('');
    setGeneratedImage('');
    setRevisedPrompt('');
    setIsGenerating(true);
    
    try {
      const result = await generateImage({
        prompt,
        ratio,
        style,
      });

      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        if (result.revisedPrompt) {
          setRevisedPrompt(result.revisedPrompt);
        }
        
        // Save the generated image to the database
        await saveGeneratedImage({
          prompt: result.revisedPrompt || prompt,
          imageUrl: result.imageUrl,
        });
      } else {
        setError(result.details || result.error || 'Failed to generate image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
    
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
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-1">Generation Failed</h4>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <OutputPreview
              prompt={prompt}
              ratio={ratio}
              style={style}
              generatedImage={generatedImage}
              revisedPrompt={revisedPrompt}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateView;
