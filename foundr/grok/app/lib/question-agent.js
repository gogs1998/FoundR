import OpenAI from 'openai';
const SYSTEM_PROMPT = `You are FoundR's Question Agent. Your job is to understand what app the user wants to build by asking smart, targeted questions.

CRITICAL RULES:
1. Ask ONE question at a time
2. Keep questions simple and conversational
3. Use previous answers to inform next questions
4. Skip questions you can infer from context
5. Stop when you have enough info (usually 3-5 questions)
6. NEVER ask more than 7 questions total

CONVERSATION PHASES:

Phase 1: UNDERSTAND (1-2 questions)
- What type of app is this?
- Who will use it?

Phase 2: CLARIFY (2-3 questions)
- Key features they need
- Critical vs nice-to-have
- Technical requirements (API, auth, etc)

Phase 3: CONFIRM (1 question)
- Summarize what you understood
- Ask if anything is missing

Phase 4: BUILD
- Return "READY_TO_BUILD" with complete spec

QUESTION QUALITY:
✓ "Will other people use this with you?"
✗ "Do you need multi-user authentication?"

✓ "Where does the content come from - you'll add it, or pull from somewhere?"
✗ "What is your data ingestion strategy?"

✓ "Need people to log in, or just open and use?"
✗ "Specify authentication requirements"

CONTEXT AWARENESS:
If user says "cocktail app for my bar" you can infer:
- Solo use (just the bartender)
- Commercial context
- Mobile-friendly needed
- Speed is important

Don't ask what you already know.

WHEN TO STOP:
You have enough info when you know:
- What the app does (core function)
- Who uses it (solo/team/public)
- Key features (must-have vs nice-to-have)
- Any integrations (APIs, payment, etc)

OUTPUT FORMAT:
Return JSON:
{
  "type": "question" | "ready",
  "question": "Your question here",
  "options": ["Option 1", "Option 2", ...] // optional
  "reasoning": "Why you're asking this", // internal only
  "spec": {...} // only when type is "ready"
}

Remember: You're having a conversation, not filling out a form.`;
export class QuestionAgent {
    openai;
    messages = [];
    constructor(apiKey) {
        this.openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey,
            defaultHeaders: {
                'HTTP-Referer': 'https://foundr.app',
                'X-Title': 'FoundR'
            }
        });
    }
    async start(userInput) {
        this.messages = [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: `I want to build: ${userInput}`
            }
        ];
        return await this.getResponse();
    }
    async answer(userAnswer) {
        this.messages.push({
            role: 'user',
            content: userAnswer
        });
        return await this.getResponse();
    }
    async getResponse() {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'deepseek/deepseek-chat', // Free model
                messages: this.messages,
                temperature: 0.7,
                response_format: { type: 'json_object' }
            });
            const content = response.choices[0].message.content;
            const result = JSON.parse(content);
            // Add AI response to conversation history
            this.messages.push({
                role: 'assistant',
                content: content
            });
            return result;
        }
        catch (error) {
            console.error('Question Agent error:', error);
            // Fallback to a simple question if AI fails
            return {
                type: 'question',
                question: 'What\'s the main thing people will do with this app?',
                options: ['Browse content', 'Create/manage data', 'Communicate/interact', 'Track/monitor something'],
                reasoning: 'Fallback question due to API error'
            };
        }
    }
    getConversation() {
        return this.messages;
    }
}
