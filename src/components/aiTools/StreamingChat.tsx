import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { useGemini } from '../../services/geminiService';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';

interface StreamingChatProps {
  systemPrompt: string;
  initialMessage: string;
  placeholder: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model?: string;
  provider?: string;
}

const StreamingChat: React.FC<StreamingChatProps> = ({ systemPrompt, initialMessage, placeholder }) => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const gemini = useGemini();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: initialMessage,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  // Simulate typing effect
  useEffect(() => {
    if (isTyping && currentResponse) {
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: currentResponse,
          sender: 'ai',
          timestamp: new Date()
        }]);
        setCurrentResponse('');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isTyping, currentResponse]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get context data for the AI to use
      const contextData = {
        deals: Object.values(deals).map(deal => ({
          id: deal.id,
          title: deal.title,
          value: deal.value,
          stage: deal.stage,
          probability: deal.probability
        })),
        contacts: Object.values(contacts).map(contact => ({
          id: contact.id,
          name: contact.name,
          company: contact.company,
          status: contact.status
        })),
        totalDeals: Object.keys(deals).length,
        totalContacts: Object.keys(contacts).length
      };
      
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Determine which AI service to use based on the query complexity
      // For complex queries about strategy, forecasting, etc., use GPT-4o
      const isComplexQuery = 
        input.toLowerCase().includes('forecast') || 
        input.toLowerCase().includes('strategy') ||
        input.toLowerCase().includes('recommend') ||
        input.toLowerCase().includes('analyze') ||
        input.toLowerCase().includes('predict') ||
        input.length > 100;
      
      let response;
      
      if (isComplexQuery) {
        // Use OpenAI for complex queries
        response = await gemini.generateContent({
          prompt: `
            System: ${systemPrompt}
            
            CRM Context: ${JSON.stringify(contextData)}
            
            ${messages.map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n')}
            
            User: ${input}
            
            Assistant:`,
          model: 'gpt-4o-mini', // Use OpenAI model
          temperature: 0.7,
          featureUsed: 'streaming-chat'
        });
      } else {
        // Use Google for simpler queries
        response = await gemini.generateContent({
          prompt: `
            You are a helpful sales assistant. You have access to this CRM data: ${JSON.stringify(contextData)}
            
            ${messages.map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n')}
            
            User: ${input}
            
            Assistant:`,
          model: 'gemma-2-9b-it', // Use Google model
          temperature: 0.7,
          featureUsed: 'streaming-chat'
        });
      }

      // Simulate streaming by setting typing state
      setIsTyping(true);
      setCurrentResponse(response.content);
      
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "I'm sorry, I'm having trouble generating a response right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-600 mr-2'
              }`}>
                {message.sender === 'user' ? (
                  <UserIcon className="text-white" size={16} />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.model && message.provider && (
                  <div className="mt-1 text-xs opacity-70">
                    Generated by {message.provider} {message.model}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 mr-2 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-700 text-white">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 mr-2 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-700 text-white">
                <Loader2 size={16} className="animate-spin text-white" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } disabled:opacity-50`}
            disabled={isLoading || isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isTyping}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {isLoading || isTyping ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamingChat;