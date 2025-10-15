import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function Build() {
  const [messages, setMessages] = useState<Array<{role: string, content: string, options?: string[]}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);

    // Add user message
    const newMessages = [
      ...messages,
      { role: 'user', content: inputValue }
    ];
    setMessages(newMessages);

    try {
      // TODO: Integrate with real Question Agent
      // For now, simulate the conversation flow
      setTimeout(() => {
        const aiResponse = {
          role: 'assistant',
          content: 'Got it! I need to ask a few questions to build exactly what you want.\n\nWho will use this app?',
          options: ['Just me', 'Me and my team', 'Public users']
        };
        setMessages([...newMessages, aiResponse]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }

    setInputValue('');
  };

  const handleAnswer = async (answer: string) => {
    setIsLoading(true);

    // Add user answer
    const newMessages = [
      ...messages,
      { role: 'user', content: answer }
    ];
    setMessages(newMessages);

    // TODO: Continue conversation with Question Agent
    // For now, simulate next steps
    setTimeout(() => {
      if (messages.length === 1) {
        // After first answer
        const aiResponse = {
          role: 'assistant',
          content: 'Perfect! Next question: What\'s the main thing people will do with this app?',
          options: ['Browse content', 'Create/manage data', 'Communicate/interact', 'Track/monitor something']
        };
        setMessages([...newMessages, aiResponse]);
      } else if (messages.length === 3) {
        // After second answer
        const aiResponse = {
          role: 'assistant',
          content: 'Great! One more question: Any specific features you need?',
          options: ['Search and filters', 'User accounts', 'Payment integration', 'File uploads', 'Something else']
        };
        setMessages([...newMessages, aiResponse]);
      } else if (messages.length === 5) {
        // After third answer - ready to build
        const aiResponse = {
          role: 'assistant',
          content: 'Perfect! I have enough information to build your app.\n\nBuilding now... This will take about 2 minutes.',
        };
        setMessages([...newMessages, aiResponse]);

        // Simulate building process
        setTimeout(() => {
          const finalResponse = {
            role: 'assistant',
            content: '🎉 Your app is live!\n\nhttps://your-app.foundr.app\n\nTry it out! You can make changes by telling me what to adjust.'
          };
          setMessages([...newMessages, aiResponse, finalResponse]);
        }, 3000);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black">
      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            FoundR
          </h1>
          <p className="text-2xl text-purple-300">
            Describe your app, answer a few questions
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-6 min-h-[600px] max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-32">
              <Sparkles size={80} className="mx-auto mb-8 text-purple-400 animate-pulse" />
              <p className="text-3xl text-white mb-4 font-semibold">
                What do you want to build?
              </p>
              <p className="text-xl text-gray-400">
                Describe your app in plain English
              </p>
              <div className="mt-8 text-left max-w-md mx-auto space-y-2">
                <p className="text-gray-500 text-sm">Examples:</p>
                <p className="text-gray-400">"A cocktail recipe app for my bar"</p>
                <p className="text-gray-400">"Breathing exercise app for my students"</p>
                <p className="text-gray-400">"Schedule manager for my cheer team"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl animate-fade-in ${
                    msg.role === 'user'
                      ? 'ml-12 bg-purple-600'
                      : 'mr-12 bg-slate-700'
                  } text-white`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.options && (
                    <div className="mt-4 grid gap-2">
                      {msg.options.map((option, j) => (
                        <button
                          key={j}
                          onClick={() => handleAnswer(option)}
                          disabled={isLoading}
                          className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-left transition-all hover:scale-102 disabled:opacity-50"
                        >
                          {option}
                          <ArrowRight className="inline ml-2" size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="mr-12 bg-slate-700 p-6 rounded-2xl flex items-center gap-3">
                  <Loader2 className="animate-spin text-purple-400" size={24} />
                  <span className="text-white">Thinking...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        {messages.length === 0 ? (
          <div className="flex gap-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              placeholder="I need a cocktail recipe app for my bar..."
              className="flex-1 px-6 py-5 bg-white/10 border border-white/20 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <button
              onClick={handleStart}
              disabled={isLoading || !inputValue.trim()}
              className="px-10 py-5 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              Start Building
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Choose an option above or describe what you want to change</p>
            <button
              onClick={() => setMessages([])}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all"
            >
              Start Over
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
