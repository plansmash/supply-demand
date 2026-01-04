require('dotenv').config();
const EleventyFetch = require('@11ty/eleventy-fetch');
const Papa = require('papaparse');

module.exports = async function() {
  const sheetUrl = process.env.SHEET_URL_BEERS;
  
  if (!sheetUrl) {
    console.warn('⚠️  SHEET_URL_BEERS not configured. Using empty beer list.');
    return {
      items: [],
      error: 'Data source not configured'
    };
  }

  try {
    // Fetch with caching (1 hour in dev, 1 day in production)
    const csvData = await EleventyFetch(sheetUrl, {
      duration: process.env.NODE_ENV === 'production' ? '1d' : '1h',
      type: 'text',
      fetchOptions: {
        headers: {
          'User-Agent': 'Supply-Demand-Website/1.0'
        }
      }
    });

    // Parse CSV data
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });

    if (parsed.errors.length > 0) {
      console.warn('⚠️  CSV parsing warnings:', parsed.errors);
    }

    // Filter out rows with no name (empty rows)
    const beers = parsed.data.filter(row => row.name && row.name.trim());

    console.log(`✅ Loaded ${beers.length} beers from Google Sheets`);

    return {
      items: beers,
      error: null,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Failed to fetch beer data:', error.message);
    
    return {
      items: [],
      error: 'Unable to load beer list at this time',
      lastUpdated: new Date().toISOString()
    };
  }
};
