import OpenAI from 'openai';
import dotenv from 'dotenv';
import searchService from './searchService.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const linkedinService = {
  findDecisionMakers: async (companyName) => {
    try {
      console.log(`🧠 [AI ENRICHMENT] Searching live Google results for: ${companyName}`);
      
      // 1. Get Live Search Results (Real Data)
      const searchResults = await searchService.searchLeaders(companyName);
      let context = `Company: ${companyName}\n`;
      
      if (searchResults && searchResults.length > 0) {
        context += `Google Search Results:\n${searchResults.map((r, i) => 
          `[${i+1}] Title: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.link}`
        ).join('\n\n')}\n\n`;
      } else {
        context += "No live search results found. Predict the most likely leaders instead.";
      }

      // 2. AI Extraction / Prediction Prompt
      const prompt = `Task: Identify the real CEO, Founder, or Managing Director of "${companyName}".
      
      ${context}
      
      Return ONLY a JSON array with exactly these fields:
      - name: Full name
      - role: Job title (e.g. CEO, Founder)
      - email: Predicted business email
      - linkedin_url: The real LinkedIn URL from search (or a search link if not found)`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Mini is often more stable for pure extraction
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });

      let content = response.choices[0].message.content;
      
      // Handle edge cases where AI might wrap in backticks
      if (content.includes('```')) {
        content = content.replace(/```json|```/g, '').trim();
      }

      const contacts = JSON.parse(content);
      return contacts;

    } catch (error) {
      console.error('LinkedIn AI Enrichment Error:', error.message);
      
      // Fallback if GPT-4o fails (uses 3.5-turbo)
      try {
          const secondResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Predict CEO of ${companyName} as JSON array [name, role, email, linkedin_url]` }],
          });
          return JSON.parse(secondResponse.choices[0].message.content.replace(/```json|```/g, '').trim());
      } catch (e) {
          return [{ name: `${companyName} CEO`, role: 'CEO', email: `ceo@${companyName.toLowerCase().replace(/ /g, '')}.com`, linkedin_url: '#' }];
      }
    }
  }
};

export default linkedinService;
