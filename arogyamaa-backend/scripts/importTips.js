// scripts/importTips.js - Import existing tips to MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Tip = require('../models/Tip');

const MONGODB_URI = process.env.MONGODB_URI;

async function importTips() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Read JSON file
    const tipsPath = path.join(__dirname, '../data/nutritionTips.json');
    const jsonData = JSON.parse(fs.readFileSync(tipsPath, 'utf8'));

    // Clear existing tips
    console.log('Clearing existing tips...');
    await Tip.deleteMany({});

    let totalImported = 0;

    // Import tips
    for (const [trimester, languages] of Object.entries(jsonData)) {
      for (const [language, tips] of Object.entries(languages)) {
        console.log(`Importing ${tips.length} tips for trimester ${trimester}, language ${language}...`);
        
        for (const tipText of tips) {
          // Determine category based on keywords
          let category = 'general';
          if (tipText.toLowerCase().includes('eat') || tipText.toLowerCase().includes('food') || tipText.toLowerCase().includes('nutrition')) {
            category = 'nutrition';
          } else if (tipText.toLowerCase().includes('exercise') || tipText.toLowerCase().includes('walk')) {
            category = 'exercise';
          } else if (tipText.toLowerCase().includes('rest') || tipText.toLowerCase().includes('sleep')) {
            category = 'wellness';
          }

          const tip = new Tip({
            trimester,
            language,
            text: tipText,
            category,
            active: true
          });
          
          await tip.save();
          totalImported++;
        }
      }
    }

    console.log(`\n✅ Successfully imported ${totalImported} tips!\n`);

    // Show statistics
    console.log('📊 Statistics:');
    for (const trimester of ['1', '2', '3']) {
      const count = await Tip.countDocuments({ trimester });
      console.log(`  Trimester ${trimester}: ${count} tips`);
    }

    console.log('\nBy language:');
    for (const language of ['en', 'hi']) {
      const count = await Tip.countDocuments({ language });
      console.log(`  ${language}: ${count} tips`);
    }

    console.log('\nBy category:');
    const categories = await Tip.distinct('category');
    for (const category of categories) {
      const count = await Tip.countDocuments({ category });
      console.log(`  ${category}: ${count} tips`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Import completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Import failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run import
importTips();