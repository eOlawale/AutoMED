import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, AlertTriangle, Loader2, Bot, User } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Vehicle, ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface Props {
  vehicle: Vehicle;
}

export const DiagnosisChat: React.FC<Props> = ({ vehicle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `Hi! I see you're driving a **${vehicle.year} ${vehicle.brand} ${vehicle.model}**. What trouble is it giving you today? You can describe a sound, a leak, or a warning light.`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix for Gemini API
        const base64Data = base64.split(',')[1];
        setSelectedImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await geminiService.diagnoseIssue(vehicle, userMsg.text, selectedImage || undefined);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error connecting to the diagnostic database. Please try again.",
        isError: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-brand-600 p-4 text-white flex items-center gap-2">
        <Bot className="w-6 h-6" />
        <div>
          <h3 className="font-semibold">AI Diagnostic Technician</h3>
          <p className="text-xs text-brand-100 opacity-80">Powered by Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
              } ${msg.isError ? 'bg-red-50 border-red-200 text-red-800' : ''}`}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-sm prose-slate max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span className="text-sm text-slate-500">Analyzing engine data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 text-xs text-brand-600 bg-brand-50 p-2 rounded">
            <Upload className="w-3 h-3" />
            Image attached ready for analysis
            <button onClick={() => setSelectedImage(null)} className="ml-auto font-bold hover:text-brand-800">×</button>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-full transition-colors"
            title="Upload photo of issue"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe the sound, leak, or problem..."
            className="flex-1 bg-slate-100 border-0 rounded-full px-4 focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
          <button
            onClick={handleSend}
            disabled={(!input && !selectedImage) || isLoading}
            className="p-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-brand-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
