require('dotenv').config();

// Data source adapters
const sheets = require('./_sources/sheets');
const squarespace = require('./_sources/squarespace');

/**
 * Get menu items from configured data source
 */
module.exports = async function() {
  const dataSource = process.env.DATA_SOURCE || 'sheets';
  
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
      console.error(`❌ Unknown DATA_SOURCE: ${dataSource}. Defaulting to sheets.`);
      adapter = sheets;
  }
  
  // Delegate to adapter
  return await adapter.getMenu();
};
