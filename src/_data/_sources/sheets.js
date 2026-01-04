const EleventyFetch = require('@11ty/eleventy-fetch');
const Papa = require('papaparse');

/**
 * Google Sheets data source adapter
 * Fetches content from published Google Sheets CSVs
 */

/**
 * Generic function to fetch and parse CSV data from Google Sheets
 */
async function fetchSheetData(sheetUrl, dataType) {
  if (!sheetUrl) {
    console.warn(`⚠️  SHEET_URL_${dataType.toUpperCase()} not configured. Using empty ${dataType} list.`);
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

    return {
      data: parsed.data,
      error: null
    };

  } catch (error) {
    console.error(`❌ Failed to fetch ${dataType} data:`, error.message);
    
    return {
      data: [],
      error: `Unable to load ${dataType} at this time`
    };
  }
}

/**
 * Get beer list from Google Sheets
 */
async function getBeers() {
  const sheetUrl = process.env.SHEET_URL_BEERS;
  const result = await fetchSheetData(sheetUrl, 'beers');

  if (result.error) {
    return {
      items: [],
      error: result.error,
      lastUpdated: new Date().toISOString()
    };
  }

  // Filter out rows with no name (empty rows)
  const beers = result.data.filter(row => row.name && row.name.trim());

  console.log(`✅ Loaded ${beers.length} beers from Google Sheets`);

  return {
    items: beers,
    error: null,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get menu items from Google Sheets
 */
async function getMenu() {
  const sheetUrl = process.env.SHEET_URL_MENU;
  const result = await fetchSheetData(sheetUrl, 'menu');

  if (result.error) {
    return {
      items: [],
      error: result.error,
      lastUpdated: new Date().toISOString()
    };
  }

  // Filter out rows with no item_name (empty rows)
  const menuItems = result.data.filter(row => row.item_name && row.item_name.trim());

  console.log(`✅ Loaded ${menuItems.length} menu items from Google Sheets`);

  return {
    items: menuItems,
    error: null,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get events from Google Sheets
 */
async function getEvents() {
  const sheetUrl = process.env.SHEET_URL_EVENTS;
  const result = await fetchSheetData(sheetUrl, 'events');

  if (result.error) {
    return {
      items: [],
      error: result.error,
      lastUpdated: new Date().toISOString()
    };
  }

  // Filter out rows with no title (empty rows)
  const events = result.data.filter(row => row.title && row.title.trim());

  console.log(`✅ Loaded ${events.length} events from Google Sheets`);

  return {
    items: events,
    error: null,
    lastUpdated: new Date().toISOString()
  };
}

module.exports = {
  getBeers,
  getMenu,
  getEvents
};
