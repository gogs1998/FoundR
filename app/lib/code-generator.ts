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
${Array.isArray(spec.features)
  ? spec.features.map((f: string) => `- ${f}`).join('\n')
  : typeof spec.features === 'string'
    ? `- ${spec.features}`
    : '- Core functionality as described above'}

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
