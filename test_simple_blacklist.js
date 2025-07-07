// Simple test for blacklist file loading
const path = require('path');
const fs = require('fs').promises;

async function testFileLoading() {
  const DATA_FILE = path.resolve(process.cwd(), 'src/actions/models/black_list_ip.js');
  const EXPORT_REGEX = /export\s+const\s+blackListIPs\s*=\s*(\[[\s\S]*?\]);/;
  
  console.log('Testing blacklist file loading...');
  console.log('File path:', DATA_FILE);
  
  try {
    const src = await fs.readFile(DATA_FILE, 'utf-8');
    console.log('✓ File read successfully');
    
    const match = src.match(EXPORT_REGEX);
    if (!match) {
      console.error('✗ Regex match failed');
      return;
    }
    console.log('✓ Regex match successful');
    
    // Try JSON parsing
    try {
      const parsed = JSON.parse(match[1]);
      console.log('✓ JSON parsing successful');
      console.log('  Entries loaded:', parsed.length);
      console.log('  First entry:', parsed[0]);
    } catch (jsonErr) {
      console.log('✗ JSON parsing failed:', jsonErr.message);
      
      // Try eval parsing
      try {
        const parsed = eval('(' + match[1] + ')');
        console.log('✓ Eval parsing successful');
        console.log('  Entries loaded:', parsed.length);
        console.log('  First entry:', parsed[0]);
      } catch (evalErr) {
        console.log('✗ Eval parsing failed:', evalErr.message);
      }
    }
  } catch (err) {
    console.error('✗ File read failed:', err.message);
  }
}

// Run the test
testFileLoading().catch(console.error);
