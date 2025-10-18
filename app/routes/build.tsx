import { useState, useEffect, useRef } from 'react';
import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { useFetcher } from '@remix-run/react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { QuestionAgent, type QuestionResponse, type AppSpec } from '~/lib/question-agent';
import { generateAppCode } from '~/lib/code-generator';
import { deployApp } from '~/lib/simple-deploy';

interface Message {
  role: string;
  content: string;
  options?: string[];
  appUrl?: string;
  isBuilding?: boolean;
  code?: string;
  appName?: string;
  spec?: any;
}

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    const message = formData.get('message') as string;
    const conversationJson = formData.get('conversation') as string | null;

    // @ts-ignore - context.env is provided by Cloudflare
    const env = context?.env || {};

    // Get OpenRouter API key from environment
    const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY || '';

    if (!OPENROUTER_API_KEY) {
      return json({
        error: 'OpenRouter API key not configured. Please add it in Cloudflare Pages Settings → Environment Variables.'
      }, { status: 500 });
    }

    if (action === 'start') {
      // Start new conversation
      const agent = new QuestionAgent(OPENROUTER_API_KEY);
      const response = await agent.start(message);

      return json({
        type: 'question',
        response,
        conversation: agent.getConversation(),
        initialMessage: message
      });
    } else if (action === 'answer') {
      // Continue conversation
      if (!conversationJson) {
        return json({ error: 'No conversation history provided' }, { status: 400 });
      }

      const conversation = JSON.parse(conversationJson);
      const initialMessage = formData.get('initialMessage') as string;

      const agent = new QuestionAgent(OPENROUTER_API_KEY);
      (agent as any).messages = conversation;

      const response = await agent.answer(message);

      if (response.type === 'ready' && response.spec) {
        // Generate code
        console.log('Generating code for spec:', JSON.stringify(response.spec, null, 2));

        // Ensure features is an array
        if (response.spec.features && !Array.isArray(response.spec.features)) {
          console.log('Converting features to array:', response.spec.features);
          if (typeof response.spec.features === 'string') {
            response.spec.features = [response.spec.features];
          } else if (typeof response.spec.features === 'object') {
            response.spec.features = Object.values(response.spec.features);
          }
        }

        const code = await generateAppCode({
          spec: response.spec,
          userRequest: initialMessage
        }, OPENROUTER_API_KEY);

        console.log('Code generated successfully!');

        // Return code for preview
        return json({
          type: 'preview',
          code,
          spec: response.spec,
          appName: response.spec.appName || 'my-app'
        });
      }

      return json({
        type: 'question',
        response,
        conversation: agent.getConversation(),
        initialMessage
      });
    }

    return json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Build action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error stack:', errorStack);
    return json({
      error: `Error: ${errorMessage}`,
      details: errorStack
    }, { status: 500 });
  }
}

export default function Build() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState<any>(null);
  const [initialMessage, setInitialMessage] = useState('');

  const fetcher = useFetcher<any>();
  const isLoading = fetcher.state !== 'idle';
  const lastProcessedData = useRef<any>(null);

  const handleStart = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue
    };
    setMessages([userMessage]);
    setInitialMessage(inputValue);

    const formData = new FormData();
    formData.append('action', 'start');
    formData.append('message', inputValue);

    fetcher.submit(formData, { method: 'POST' });
    setInputValue('');
  };

  const handleAnswer = async (answer: string) => {
    // Add user answer
    const userMessage: Message = {
      role: 'user',
      content: answer
    };
    setMessages([...messages, userMessage]);

    const formData = new FormData();
    formData.append('action', 'answer');
    formData.append('message', answer);
    formData.append('conversation', JSON.stringify(conversation));
    formData.append('initialMessage', initialMessage);

    fetcher.submit(formData, { method: 'POST' });
  };

  // Handle fetcher responses in useEffect
  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle' && fetcher.data !== lastProcessedData.current) {
      lastProcessedData.current = fetcher.data;

      try {
        if (fetcher.data.error) {
          // Show error message
          if (messages[messages.length - 1]?.role !== 'error') {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `❌ Error: ${fetcher.data.error}`
            }]);
          }
        } else if (fetcher.data.type === 'question') {
          const response = fetcher.data.response as QuestionResponse;
          setConversation(fetcher.data.conversation);
          if (fetcher.data.initialMessage) {
            setInitialMessage(fetcher.data.initialMessage);
          }

          // Add AI question
          if (messages[messages.length - 1]?.content !== response.question) {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: response.question || 'Let me ask you a question...',
              options: response.options
            }]);
          }
        } else if (fetcher.data.type === 'preview') {
          // Show code preview
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ Code generated successfully!\n\nHere's a preview of your ${fetcher.data.appName}:`,
            code: fetcher.data.code,
            appName: fetcher.data.appName,
            spec: fetcher.data.spec
          }]);
        } else if (fetcher.data.type === 'complete') {
          // Show building message first if not already shown
          if (!messages.find(m => m.isBuilding)) {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: '🎉 Your app is being built! This will take about 2 minutes...',
                isBuilding: true
              }]);

              // Show completion after a moment
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: `🎉 Your app is live!\n\n${fetcher.data.appUrl}\n\nTry it out! You can make changes by telling me what to adjust.`,
                  appUrl: fetcher.data.appUrl
                }]);
              }, 2000);
            }, 100);
          } else if (!messages.find(m => m.appUrl)) {
            // Add completion message
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `🎉 Your app is live!\n\n${fetcher.data.appUrl}\n\nTry it out! You can make changes by telling me what to adjust.`,
              appUrl: fetcher.data.appUrl
            }]);
          }
        }
      } catch (error) {
        console.error('Error handling fetcher data:', error);
        if (messages[messages.length - 1]?.role !== 'error') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `❌ Error handling response: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]);
        }
      }
    }
  }, [fetcher.data, fetcher.state, messages]);

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

                  {msg.code && (
                    <div className="mt-4">
                      {/* Live Preview */}
                      <div className="bg-white rounded-lg mb-4 border-4 border-gray-700">
                        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                          <span className="text-white text-sm font-semibold">Live Preview</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const iframe = document.getElementById(`preview-${i}`) as HTMLIFrameElement;
                                if (iframe?.contentWindow) {
                                  iframe.contentWindow.location.reload();
                                }
                              }}
                              className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-700 rounded"
                            >
                              Refresh
                            </button>
                            <button
                              onClick={() => {
                                const modal = document.getElementById(`code-${i}`);
                                if (modal) modal.classList.toggle('hidden');
                              }}
                              className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-700 rounded"
                            >
                              View Code
                            </button>
                          </div>
                        </div>
                        <iframe
                          id={`preview-${i}`}
                          srcDoc={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${msg.appName || 'Preview'}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${msg.code}

    // Render the app
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`}
                          className="w-full h-[600px] bg-white"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>

                      {/* Code Modal */}
                      <div id={`code-${i}`} className="hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
                        <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                          <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-semibold">Generated Code</h3>
                            <button
                              onClick={() => {
                                const modal = document.getElementById(`code-${i}`);
                                if (modal) modal.classList.add('hidden');
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              ✕ Close
                            </button>
                          </div>
                          <div className="p-6 overflow-y-auto flex-1">
                            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{msg.code}</pre>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          // TODO: Trigger deployment
                          alert('Deployment coming soon! Preview is working.');
                        }}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all"
                      >
                        Deploy to Production →
                      </button>
                    </div>
                  )}

                  {msg.appUrl && (
                    <div className="mt-4">
                      <a
                        href={msg.appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all"
                      >
                        Open App →
                      </a>
                    </div>
                  )}

                  {msg.options && (
                    <div className="mt-4 grid gap-2">
                      {msg.options.map((option, j) => (
                        <button
                          key={j}
                          onClick={() => handleAnswer(option)}
                          disabled={isLoading}
                          className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-left transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
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
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleStart()}
              placeholder="I need a cocktail recipe app for my bar..."
              className="flex-1 px-6 py-5 bg-white/10 border border-white/20 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
              disabled={isLoading}
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
          <div>
            <div className="flex gap-3 mb-4">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && inputValue.trim() && handleAnswer(inputValue) && setInputValue('')}
                placeholder="Type your answer or choose an option above..."
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <button
                onClick={() => {
                  if (inputValue.trim()) {
                    handleAnswer(inputValue);
                    setInputValue('');
                  }
                }}
                disabled={isLoading || !inputValue.trim()}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                Send
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  setMessages([]);
                  setConversation(null);
                  setInitialMessage('');
                  setInputValue('');
                }}
                className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-white text-sm transition-all"
                disabled={isLoading}
              >
                Start Over
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
