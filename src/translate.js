const fs = require('fs').promises;
const path = require('path');

/**
 * Reads all JSON files from a directory
 * @param {string} dirPath - Directory path
 * @returns {Array} Array of objects {filename, data}
 */
async function loadJSONFiles(dirPath) {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'package.json');
  const results = [];
  for (const file of jsonFiles) {
    const filePath = path.join(dirPath, file);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      results.push({
        filename: file,
        path: filePath,
        data: parsed
      });
    } catch (error) {
      console.error(`\n❌ Error parsing file: ${file}`);
      console.error(`   Path: ${filePath}`);
      console.error(`   Error: ${error.message}`);
      if (error.message.includes('position')) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const content = await fs.readFile(filePath, 'utf-8');
          const start = Math.max(0, position - 100);
          const end = Math.min(content.length, position + 100);
          console.error(`\n   Context (position ${position}):`);
          console.error(`   "${content.substring(start, end)}"`);
          console.error(`   ${' '.repeat(Math.min(100, position - start))}^`);
        }
      }
      throw new Error(`Invalid JSON file: ${file}`);
    }
  }
  return results;
}

/**
 * Saves the processed JSON file
 * @param {string} filePath - Path to save
 * @param {Array} data - Data to save
 */
async function saveJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Generates translation variations based on BCP-47 codes
 */
function expandTranslations(translations, variations) {
  const expandedTranslations = [];
  const existingLanguages = new Set(translations.map(t => t.language));
  expandedTranslations.push(...translations);
  for (const [languageName, variants] of Object.entries(variations)) {
    for (const variant of variants) {
      if (existingLanguages.has(variant)) {
        continue;
      }
      const baseCode = variant.split('-')[0];
      const baseTranslation = translations.find(t => t.language === baseCode);
      if (baseTranslation) {
        const variantTranslation = {
          ...baseTranslation,
          language: variant,
          language_name: variant === baseCode 
            ? baseTranslation.language_name 
            : `${baseTranslation.language_name} (${variant})`
        };
        expandedTranslations.push(variantTranslation);
        existingLanguages.add(variant);
      }
    }
  }
  return expandedTranslations;
}

/**
 * Processes all files in a directory
 */
async function processDirectory(dirPath, variations) {
  console.log(`\n📂 Processing directory: ${dirPath}`);
  const files = await loadJSONFiles(dirPath);
  console.log(`✅ Found ${files.length} JSON files`);
  const results = [];
  for (const file of files) {
    console.log(`\n🔄 Processing: ${file.filename}`);
    console.log(`   Original translations: ${file.data.length}`);
    const expanded = expandTranslations(file.data, variations);
    console.log(`   Expanded translations: ${expanded.length}`);
    console.log(`   New variations: ${expanded.length - file.data.length}`);
    await saveJSON(file.path, expanded);
    console.log(`   ✅ File updated: ${file.path}`);
    results.push({
      filename: file.filename,
      original: file.data.length,
      expanded: expanded.length,
      added: expanded.length - file.data.length
    });
  }
  return results;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting translation processing...\n');
    const variationsPath = './src/variations.json';
    const variationsContent = await fs.readFile(variationsPath, 'utf-8');
    const variations = JSON.parse(variationsContent);
    console.log('✅ Variations loaded successfully');

    const rootResults = await processDirectory('.', variations);
    const subjectsResults = await processDirectory('./subjects', variations);
    const templatesResults = await processDirectory('./templates', variations);

    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL SUMMARY');
    console.log('='.repeat(60));

    if (rootResults.length > 0) {
      console.log('\n📁 ROOT:');
      rootResults.forEach(r => {
        console.log(`   ${r.filename}: ${r.original} → ${r.expanded} (+${r.added})`);
      });
    }
    console.log('\n📁 SUBJECTS:');
    subjectsResults.forEach(r => {
      console.log(`   ${r.filename}: ${r.original} → ${r.expanded} (+${r.added})`);
    });
    console.log('\n📁 TEMPLATES:');
    templatesResults.forEach(r => {
      console.log(`   ${r.filename}: ${r.original} → ${r.expanded} (+${r.added})`);
    });
    const totalAdded = [...rootResults, ...subjectsResults, ...templatesResults]
      .reduce((sum, r) => sum + r.added, 0);
    console.log('\n' + '='.repeat(60));
    console.log(`✨ Total variations added: ${totalAdded}`);
    console.log(`📝 Files successfully overwritten`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('\n💡 Suggestions:');
    console.error('   1. Check the file indicated above');
    console.error('   2. Look for missing or extra commas');
    console.error('   3. Make sure all strings have closing quotes');
    console.error('   4. Use an online JSON validator: https://jsonlint.com/');
    process.exit(1);
  }
}

main();