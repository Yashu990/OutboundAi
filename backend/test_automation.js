import linkedinService from './services/linkedinService.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to test the real-time CEO search automation
 */
async function testAutomation() {
  const testCompany = "Zomato"; // You can change this to any company
  
  console.log(`🚀 TESTING LIVE AUTOMATION FOR: ${testCompany}`);
  console.log(`-------------------------------------------`);
  
  try {
    const contacts = await linkedinService.findDecisionMakers(testCompany);
    
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
        console.log(`✅ TEST SUCCESSFUL! Found ${contacts.length} leaders.`);
        console.log(JSON.stringify(contacts, null, 2));
        
        if (contacts[0].linkedin_url && contacts[0].linkedin_url.includes('linkedin.com/in/')) {
            console.log(`\n💎 RESULT TYPE: Real LinkedIn Profile (100% Original)`);
        } else {
            console.log(`\n⚠️ RESULT TYPE: AI Prediction (Search was empty)`);
        }
    } else {
        console.log(`\n⚠️ NO CONTACTS RETURNED`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(`❌ TEST FAILED:`, err.message);
    process.exit(1);
  }
}

testAutomation();
