import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Service to perform Google searches via Serper.dev
 */
const searchService = {
  /**
   * Search for CEO/Founders of a company
   * @param {string} companyName 
   * @returns {Promise<Array>} List of search results
   */
  searchLeaders: async (companyName) => {
    try {
      const SERPER_API_KEY = process.env.SERPER_API_KEY;
      
      if (!SERPER_API_KEY) {
        console.warn('⚠️ SERPER_API_KEY is missing. Falling back to AI prediction.');
        return null;
      }

      console.log(`🔍 [GOOGLE SEARCH] Using Serper to find leaders for: ${companyName}`);

      const data = JSON.stringify({
        "q": `${companyName} CEO Founder LinkedIn site:linkedin.com/in/`,
        "num": 5
      });

      const config = {
        method: 'post',
        url: 'https://google.serper.dev/search',
        headers: { 
          'X-API-KEY': SERPER_API_KEY, 
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios(config);
      return response.data.organic || [];
    } catch (error) {
      console.error('Serper Search Error:', error.message);
      return null;
    }
  }
};

export default searchService;
