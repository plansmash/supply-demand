// Data source adapters
const sheets = require('./_sources/sheets');
const squarespace = require('./_sources/squarespace');

/**
 * Get events from configured data source
 */
module.exports = async function() {
  // Normalize DATA_SOURCE input (trim and lowercase)
  const rawSource = process.env.DATA_SOURCE || 'sheets';
  const dataSource = rawSource.trim().toLowerCase();
  
  // Select adapter based on DATA_SOURCE
  let adapter;
  switch (dataSource) {
    case 'sheets':
      adapter = sheets;
      break;
    case 'squarespace':
      adapter = squarespace;
      break;
    default:
      console.error(`❌ Unknown DATA_SOURCE: "${rawSource}". Defaulting to sheets.`);
      adapter = sheets;
  }
  
  // Delegate to adapter with error handling
  try {
    return await adapter.getEvents();
  } catch (error) {
    console.error(`❌ Adapter error (${dataSource}):`, error.message);
    // Return user-friendly error message for fallback UI
    const userFriendlyError = error.message || 'Unable to load events at this time';
    return {
      items: [],
      error: userFriendlyError,
      lastUpdated: new Date().toISOString()
    };
  }
};
