import OpenAI from 'openai';

export interface CodeGenerationRequest {
  spec: any;
  userRequest: string;
}

export async function generateAppCode(
  request: CodeGenerationRequest,
  apiKey: string
): Promise<string> {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://foundr.app',
      'X-Title': 'FoundR'
    }
  });

  const prompt = generateCodePrompt(request.spec, request.userRequest);

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat', // Free model
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Code generation error:', error);
    throw new Error('Failed to generate app code');
  }
}

function generateCodePrompt(spec: any, userRequest: string): string {
  return `You are an expert full-stack developer. Build a complete, production-ready React application based on these requirements.

ORIGINAL REQUEST:
${userRequest}

APP SPECIFICATION:
${JSON.stringify(spec, null, 2)}

TECHNICAL REQUIREMENTS:

Framework: React with TypeScript
Styling: Tailwind CSS (use ONLY core utility classes, no custom classes)
Responsive: Mobile-first design
Performance: Optimize for fast load times

${spec.technicalRequirements?.auth ? `
Authentication: Include login/signup with Clerk
User roles: ${spec.userModel}
` : 'No authentication needed'}

${spec.technicalRequirements?.database ? `
Database: Use Cloudflare D1 (SQLite)
Schema: Infer from requirements
CRUD operations: Include all necessary queries
` : 'No database needed - use React state'}

${spec.technicalRequirements?.storage ? `
File Storage: Use Cloudflare R2
Upload handling: Include file upload UI
` : 'No file storage needed'}

${spec.technicalRequirements?.apis?.length ? `
External APIs: ${spec.technicalRequirements.apis.join(', ')}
Error handling: Handle API failures gracefully
` : ''}

UI PRIORITIES:
- ${spec.uiPriority}
- Clean, modern design
- Intuitive navigation
- Fast interactions

FEATURES TO IMPLEMENT:
${spec.features?.map((f: string) => `- ${f}`).join('\n')}

CODE STRUCTURE:

Create a single-file React component that includes:
1. All necessary imports
2. Type definitions
3. Component logic
4. Rendered UI
5. Inline styles (Tailwind)

CRITICAL RULES:
- ✅ Production-ready code (no TODOs or placeholders)
- ✅ Handle all error cases
- ✅ Mobile responsive
- ✅ Use ONLY Tailwind core classes
- ✅ Include all functionality (no "implement later")
- ❌ NO localStorage or sessionStorage (not supported)
- ❌ NO console.logs in production code
- ❌ NO placeholder data (unless specified)

Return ONLY the complete React component code. No explanations, no markdown, just the code.`;
}

// Example generated code for a cocktail app
export function getExampleCocktailAppCode(): string {
  return `import React, { useState, useEffect } from 'react';
import { Search, Heart, Plus, X } from 'lucide-react';

interface Cocktail {
  id: string;
  name: string;
  spirit_type: string;
  ingredients: string[];
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
  glass_type: string;
  image_url?: string;
  isCustom?: boolean;
}

const sampleCocktails: Cocktail[] = [
  {
    id: '1',
    name: 'Mojito',
    spirit_type: 'rum',
    ingredients: ['2oz White Rum', '1oz Lime Juice', 'Mint Leaves', '2 tsp Sugar', 'Soda Water'],
    instructions: 'Muddle mint and sugar. Add rum and lime juice. Shake with ice. Top with soda water.',
    difficulty: 'easy',
    glass_type: 'highball',
    image_url: '🍹'
  },
  {
    id: '2',
    name: 'Old Fashioned',
    spirit_type: 'whiskey',
    ingredients: ['2oz Bourbon', '1 tsp Sugar', '2 dashes Angostura Bitters', 'Orange Peel'],
    instructions: 'Muddle sugar and bitters. Add bourbon and ice. Stir gently. Garnish with orange peel.',
    difficulty: 'easy',
    glass_type: 'rocks',
    image_url: '🥃'
  },
  {
    id: '3',
    name: 'Margarita',
    spirit_type: 'tequila',
    ingredients: ['2oz Tequila', '1oz Lime Juice', '1oz Triple Sec', 'Salt for rim'],
    instructions: 'Shake all ingredients with ice. Strain into salt-rimmed glass.',
    difficulty: 'easy',
    glass_type: 'margarita',
    image_url: '🍸'
  }
];

export default function CocktailApp() {
  const [cocktails, setCocktails] = useState<Cocktail[]>(sampleCocktails);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpirit, setSelectedSpirit] = useState<string>('all');
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCocktail, setNewCocktail] = useState<Partial<Cocktail>>({});

  const spirits = ['all', ...Array.from(new Set(cocktails.map(c => c.spirit_type)))];

  const filteredCocktails = cocktails.filter(cocktail => {
    const matchesSearch = cocktail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cocktail.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpirit = selectedSpirit === 'all' || cocktail.spirit_type === selectedSpirit;
    return matchesSearch && matchesSpirit;
  });

  const handleAddCocktail = () => {
    if (newCocktail.name && newCocktail.ingredients && newCocktail.instructions) {
      const cocktail: Cocktail = {
        id: Date.now().toString(),
        name: newCocktail.name,
        spirit_type: newCocktail.spirit_type || 'other',
        ingredients: Array.isArray(newCocktail.ingredients) ? newCocktail.ingredients : [newCocktail.ingredients],
        instructions: newCocktail.instructions,
        difficulty: newCocktail.difficulty || 'medium',
        glass_type: newCocktail.glass_type || 'cocktail',
        isCustom: true,
        image_url: newCocktail.image_url || '🍸'
      };

      setCocktails([...cocktails, cocktail]);
      setNewCocktail({});
      setShowAddForm(false);
    }
  };

  if (selectedCocktail) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedCocktail(null)}
            className="mb-6 flex items-center gap-2 text-purple-400 hover:text-purple-300"
          >
            ← Back to cocktails
          </button>

          <div className="bg-slate-800 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{selectedCocktail.image_url}</div>
              <h1 className="text-4xl font-bold mb-2">{selectedCocktail.name}</h1>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <span className="bg-purple-600 px-3 py-1 rounded-full">{selectedCocktail.spirit_type}</span>
                <span className="bg-slate-700 px-3 py-1 rounded-full">{selectedCocktail.difficulty}</span>
                <span className="bg-slate-700 px-3 py-1 rounded-full">{selectedCocktail.glass_type}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {selectedCocktail.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Instructions</h2>
                <p className="text-gray-300 leading-relaxed">{selectedCocktail.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🍸 Cocktail Recipes</h1>
          <p className="text-gray-400">Find the perfect drink for any occasion</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cocktails or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {spirits.map(spirit => (
              <button
                key={spirit}
                onClick={() => setSelectedSpirit(spirit)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  selectedSpirit === spirit
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {spirit === 'all' ? 'All Spirits' : spirit}
              </button>
            ))}
          </div>
        </div>

        {/* Add Cocktail Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold flex items-center gap-2 mx-auto transition-all"
          >
            <Plus size={20} />
            Add Custom Cocktail
          </button>
        </div>

        {/* Add Cocktail Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add Cocktail</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Cocktail name"
                  value={newCocktail.name || ''}
                  onChange={(e) => setNewCocktail({...newCocktail, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <select
                  value={newCocktail.spirit_type || ''}
                  onChange={(e) => setNewCocktail({...newCocktail, spirit_type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select spirit type</option>
                  <option value="rum">Rum</option>
                  <option value="vodka">Vodka</option>
                  <option value="whiskey">Whiskey</option>
                  <option value="gin">Gin</option>
                  <option value="tequila">Tequila</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  placeholder="Ingredients (one per line)"
                  value={newCocktail.ingredients || ''}
                  onChange={(e) => setNewCocktail({...newCocktail, ingredients: e.target.value.split('\\n').filter(i => i.trim())})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                />

                <textarea
                  placeholder="Instructions"
                  value={newCocktail.instructions || ''}
                  onChange={(e) => setNewCocktail({...newCocktail, instructions: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleAddCocktail}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all"
                  >
                    Add Cocktail
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cocktail Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCocktails.map(cocktail => (
            <div
              key={cocktail.id}
              className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-all cursor-pointer group"
              onClick={() => setSelectedCocktail(cocktail)}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{cocktail.image_url}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  {cocktail.name}
                </h3>
                {cocktail.isCustom && (
                  <span className="inline-block mt-1 px-2 py-1 bg-purple-600 text-xs rounded-full">
                    Custom
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Spirit:</span>
                  <span className="capitalize text-purple-400">{cocktail.spirit_type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="capitalize">{cocktail.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Glass:</span>
                  <span className="capitalize">{cocktail.glass_type}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-gray-400 line-clamp-2">
                  {cocktail.ingredients.slice(0, 2).join(', ')}
                  {cocktail.ingredients.length > 2 && ` + ${cocktail.ingredients.length - 2} more`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredCocktails.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No cocktails found matching your search.</p>
            <button
              onClick={() => {setSearchTerm(''); setSelectedSpirit('all');}}
              className="mt-4 text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}`;
}
