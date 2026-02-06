const fs = require('fs').promises;
const path = require('path');

async function validateJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    JSON.parse(content);
    return { valid: true, file: filePath };
  } catch (error) {
    return { valid: false, file: filePath, error: error.message };
  }
}

async function validateDirectory(dirPath) {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  const results = await Promise.all(
    jsonFiles.map(f => validateJSON(path.join(dirPath, f)))
  );
  return results;
}

async function main() {
  console.log('🔍 Validating JSON files...\n');
  const rootResults = await validateDirectory('.');
  const subjectsResults = await validateDirectory('./subjects');
  const templatesResults = await validateDirectory('./templates');
  const allResults = [...rootResults, ...subjectsResults, ...templatesResults];
  const invalid = allResults.filter(r => !r.valid);
  if (invalid.length > 0) {
    console.error(`❌ ${invalid.length} file(s) with errors:\n`);
    invalid.forEach(r => {
      console.error(`   ${r.file}`);
      console.error(`   → ${r.error}\n`);
    });
    process.exit(1);
  }
  console.log(`✅ All JSON files are valid (${allResults.length} files)`);
}

main();