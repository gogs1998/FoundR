import { useState } from 'react';
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
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action') as string;
  const message = formData.get('message') as string;
  const conversationJson = formData.get('conversation') as string | null;

  const env = context.env as any;

  // Get OpenRouter API key from environment
  const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY || '';

  if (!OPENROUTER_API_KEY) {
    return json({
      error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.'
    }, { status: 500 });
  }

  try {
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
        // Generate code and deploy
        console.log('Generating code for spec:', response.spec);

        const code = await generateAppCode({
          spec: response.spec,
          userRequest: initialMessage
        }, OPENROUTER_API_KEY);

        console.log('Code generated, deploying...');

        // Deploy the app
        const userId = 'demo-user'; // TODO: Get from Clerk auth
        const appName = response.spec.appName || 'my-app';

        const deployment = await deployApp({
          code,
          userId,
          appName,
          spec: response.spec
        }, env);

        if (deployment.status === 'failed') {
          return json({
            type: 'error',
            error: deployment.error || 'Deployment failed'
          });
        }

        return json({
          type: 'complete',
          appUrl: deployment.url,
          appId: deployment.appId,
          logs: deployment.logs
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
    return json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
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

  // Handle fetcher responses
  if (fetcher.data && fetcher.state === 'idle') {
    if (fetcher.data.error) {
      // Show error message
      if (messages[messages.length - 1]?.role !== 'error') {
        setMessages([...messages, {
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
        setMessages([...messages, {
          role: 'assistant',
          content: response.question || 'Let me ask you a question...',
          options: response.options
        }]);
      }
    } else if (fetcher.data.type === 'complete') {
      // Show building message first if not already shown
      if (!messages.find(m => m.isBuilding)) {
        setTimeout(() => {
          setMessages([...messages, {
            role: 'assistant',
            content: '🎉 Your app is being built! This will take about 2 minutes...',
            isBuilding: true
          }]);

          // Show completion after a moment
          setTimeout(() => {
            setMessages([...messages, {
              role: 'assistant',
              content: '🎉 Your app is being built! This will take about 2 minutes...',
              isBuilding: true
            }, {
              role: 'assistant',
              content: `🎉 Your app is live!\n\n${fetcher.data.appUrl}\n\nTry it out! You can make changes by telling me what to adjust.`,
              appUrl: fetcher.data.appUrl
            }]);
          }, 2000);
        }, 100);
      } else if (!messages.find(m => m.appUrl)) {
        // Add completion message
        setMessages([...messages, {
          role: 'assistant',
          content: `🎉 Your app is live!\n\n${fetcher.data.appUrl}\n\nTry it out! You can make changes by telling me what to adjust.`,
          appUrl: fetcher.data.appUrl
        }]);
      }
    }
  }

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

                  {msg.options && !isLoading && (
                    <div className="mt-4 grid gap-2">
                      {msg.options.map((option, j) => (
                        <button
                          key={j}
                          onClick={() => handleAnswer(option)}
                          className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-left transition-all hover:scale-102"
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
          <div className="text-center">
            <p className="text-gray-400 mb-4">Choose an option above or describe what you want to change</p>
            <button
              onClick={() => {
                setMessages([]);
                setConversation(null);
                setInitialMessage('');
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all"
              disabled={isLoading}
            >
              Start Over
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
