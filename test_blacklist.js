// Test script to verify blacklist functionality
const { blackListController } = require('./src/actions/controller/blackListController.ts');

async function testBlacklistInsert() {
  console.log('Testing blacklist insert...');
  
  try {
    // Get current list
    const currentList = await blackListController.getAllAsync();
    console.log('Current blacklist entries:', currentList.length);
    
    // Insert a new entry
    const newEntry = await blackListController.insert({
      ip: "1.2.3.4",
      reason: "Test entry",
      country: "US",
      blocked_requests: 1,
      user_agent: "Test Agent"
    });
    
    console.log('Inserted entry:', newEntry);
    
    // Wait a bit for the file to be written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if the entry exists
    const found = await blackListController.getByIpAsync("1.2.3.4");
    console.log('Found entry:', found);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testBlacklistInsert();
