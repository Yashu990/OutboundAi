import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const mapsService = {
  searchLeads: async (query, limit = 20) => {
    try {
      if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY.includes('YOUR_GOOGLE_KEY')) {
        console.error('❌ Google Places API Key is missing!');
        return [];
      }

      console.log(`🔍 Searching Real Google Places for: ${query}`);
      
      // 1. Text Search to get list of places
      const searchResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        {
          params: {
            query: query,
            key: GOOGLE_PLACES_API_KEY,
          }
        }
      );

      const results = searchResponse.data.results || [];
      
      // 2. Map results to our lead format
      const leads = await Promise.all(results.slice(0, limit).map(async (place) => {
        // Fetch more details for each place (like website and phone)
        try {
          const detailResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`,
            {
              params: {
                place_id: place.place_id,
                fields: 'name,website,formatted_phone_number,formatted_address,rating',
                key: GOOGLE_PLACES_API_KEY,
              }
            }
          );
          
          const details = detailResponse.data.result || {};

          return {
            name: place.name,
            company: place.name,
            website: details.website || null,
            phone: details.formatted_phone_number || null,
            address: details.formatted_address || place.formatted_address,
            rating: place.rating,
            status: 'prospect'
          };
        } catch (detailError) {
          console.error(`Error fetching details for ${place.name}:`, detailError.message);
          return {
            name: place.name,
            company: place.name,
            website: null,
            phone: null,
            address: place.formatted_address,
            rating: place.rating,
            status: 'prospect'
          };
        }
      }));

      console.log(`✅ Successfully found ${leads.length} REAL leads from Google.`);
      return leads;
    } catch (error) {
      console.error('Google Places Service Error:', error.response?.data || error.message);
      return [];
    }
  },
};

export default mapsService;
