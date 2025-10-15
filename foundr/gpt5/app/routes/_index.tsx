import { Link } from '@remix-run/react';
import { Sparkles, Zap, Code, MessageSquare } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-7xl font-bold text-white mb-6">
          You bring the idea,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            we make the app
          </span>
        </h1>

        <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Describe your app in plain English. Answer 3 questions. Get a live URL in 2 minutes.
          <br />
          Then refine it through conversation.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <Link
            to="/build"
            className="px-10 py-5 bg-purple-600 hover:bg-purple-700 rounded-xl text-white text-xl font-semibold transition-all hover:scale-105"
          >
            Start Building Free
          </Link>
          <Link
            to="/pricing"
            className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xl font-semibold transition-all"
          >
            See Pricing
          </Link>
        </div>

        {/* Demo Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20"></div>
          <div className="relative bg-slate-800/50 backdrop-blur border border-white/10 rounded-3xl p-8">
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Sparkles size={64} className="mx-auto mb-4 text-purple-400" />
                <p className="text-white text-lg">Interactive Demo Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-5xl font-bold text-white text-center mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">1. Describe</h3>
            <p className="text-gray-300 text-lg">
              Tell us what you want to build in plain English. No technical jargon needed.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">2. Answer</h3>
            <p className="text-gray-300 text-lg">
              We ask 3-5 smart questions to understand exactly what you need.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Code size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">3. Deploy</h3>
            <p className="text-gray-300 text-lg">
              Get a live URL in 2 minutes. Then refine through conversation.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Teaser */}
      <div className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          Build Free. Pay Only to Scale.
        </h2>
        <p className="text-2xl text-gray-300 mb-12">
          $0 to build. $0 to deploy. $0 to host (up to 10k visits).
          <br />
          Then just $19/mo for your own domain.
        </p>

        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-8 py-4">
          <div className="text-left">
            <div className="text-sm text-gray-400">Average cost to build an app</div>
            <div className="text-3xl font-bold text-white">$0</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to build your app?
          </h2>
          <Link
            to="/build"
            className="inline-block px-12 py-6 bg-white text-purple-600 rounded-xl text-xl font-bold hover:scale-105 transition-all"
          >
            Start Building Now →
          </Link>
        </div>
      </div>

    </div>
  );
}
