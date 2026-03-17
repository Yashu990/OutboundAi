import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiService = {
  generateOutreachMessage: async (contactData) => {
    const { name, company, role, address, website, type = 'linkedin' } = contactData;

    // Build location context
    const locationSnippet = address ? ` based in ${address}` : '';
    const websiteSnippet = website ? ` (${website.replace(/^https?:\/\//, '')})` : '';

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_API_KEY')) {
      console.warn('OPENAI_API_KEY is missing. Using fallback mock message.');
      const firstName = name?.split(' ')[0] || name;
      if (type === 'email') {
        return `Subject: Quick intro from [Your Company]\n\nHi ${firstName},\n\nI came across ${company}${locationSnippet} and was really impressed by what you're building as ${role}.\n\nI'd love to explore how we might help ${company} with [your value proposition]. Would you be open to a 15-minute call this week?\n\nBest,\n[Your Name]`;
      }
      return `Hi ${firstName}, I noticed ${company}${locationSnippet} — impressive work as ${role}! I'd love to connect and explore how we could add value to ${company}. Would you be open to a quick chat?`;
    }

    try {
      const isEmail = type === 'email';
      const prompt = isEmail
        ? `Write a personalized cold email outreach.

Context:
- Recipient: ${name} (${role})
- Company: ${company}${websiteSnippet}${locationSnippet}

Requirements:
- Start with "Subject:" line
- Open with a specific, genuine observation about the business or its location
- Highlight a clear value proposition in 1 sentence
- End with a soft CTA (e.g. 15-min call)
- Sign off professionally
- Total email body: under 120 words. Sound human, NOT spammy.`
        : `Write a personalized LinkedIn connection request message.

Context:
- Recipient: ${name} (${role})
- Company: ${company}${websiteSnippet}${locationSnippet}

Requirements:
- Address them by first name only
- Open with a specific, genuine observation about their business or location
- Be curious and friendly, NOT salesy
- Under 60 words total
- No hashtags, no emojis overload, no generic phrases like "I hope this finds you well"`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.85,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI Error:', error.message);
      throw new Error('Failed to generate AI message');
    }
  }
};

export default aiService;
