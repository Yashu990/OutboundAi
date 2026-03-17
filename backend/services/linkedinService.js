import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const linkedinService = {
  findDecisionMakers: async (companyName) => {
    try {
      console.log(`🧠 [AI ENRICHMENT] Using OpenAI to identify leaders for: ${companyName}`);
      
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_API_KEY')) {
        return [
          { name: `Founder of ${companyName}`, role: 'CEO', linkedin_url: `https://linkedin.com/search?keywords=CEO+${encodeURIComponent(companyName)}` },
        ];
      }

      const prompt = `Based on the company name "${companyName}", predict the most likely names of the CEO/Founder and Head of Sales. 
      Use local naming conventions for the region if the name suggests one (e.g. India).
      This is for a CRM simulation, so provide realistic but common professional names for that region.
      
      Return ONLY a JSON array:
      - name: Full name
      - role: Job title
      - email: Predict a professional email (e.g. name@website.com)
      - linkedin_url: Generate a search URL: https://www.linkedin.com/search/results/people/?keywords={name}%20{companyName}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      const contacts = JSON.parse(content.replace(/```json|```/g, '').trim());

      return contacts.map(c => ({
        ...c,
        linkedin_url: c.linkedin_url || `https://linkedin.com/search?keywords=${c.name.replace(/ /g, '+')}+${companyName}`
      }));

    } catch (error) {
      console.error('LinkedIn AI Enrichment Error:', error.message);
      // Safety fallback
      return [
        { name: `${companyName} Leader`, role: 'CEO', email: `hello@${companyName.toLowerCase().replace(/ /g, '')}.com`, linkedin_url: '#' }
      ];
    }
  }
};

export default linkedinService;
