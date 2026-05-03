import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../utils/helpers';

interface AIGuideProps {
  siteName: string;
  country: string;
}

export default function AIGuide({ siteName, country }: AIGuideProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateGuide = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert travel guide and historian. Write a short, fascinating, and engaging guide about the World Heritage site "${siteName}" in ${country}. 
      Focus on hidden secrets, best time to visit, and cultural significance. 
      Format everything with beautiful, clean markdown. Please keep it under 300 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are a warm, engaging travel companion. You give practical advice but also share fascinating historical secrets.',
        }
      });

      if (response.text) {
        setContent(response.text);
      } else {
        setError('Could not generate the guide. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the guide.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-1 dark:from-indigo-950/40 dark:to-purple-950/40">
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-xl font-bold">AI Travel Guide & Secrets</h3>
          </div>
          
          {content && !isLoading && (
            <button 
              onClick={generateGuide}
              className="p-2 text-zinc-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors"
              title="Regenerate Guide"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>

        {!content && !isLoading && (
          <div className="text-center py-6">
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
              Unlock hidden secrets, practical travel tips, and fascinating historical insights about {siteName} powered by Gemini AI.
            </p>
            <button
              onClick={generateGuide}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Generate Guide
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-indigo-600 dark:text-indigo-400">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-sm font-medium animate-pulse">Consulting the archives...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-950/50 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {content && !isLoading && (
          <div className="prose prose-indigo dark:prose-invert prose-sm sm:prose-base max-w-none prose-p:leading-relaxed">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
