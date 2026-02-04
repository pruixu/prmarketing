const fs = require('fs').promises;
const path = require('path');

/**
 * Lee todos los archivos JSON de un directorio
 * @param {string} dirPath - Ruta del directorio
 * @returns {Array} Array de objetos {filename, data}
 */
async function loadJSONFiles(dirPath) {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
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
      console.error(`\n❌ Error al parsear archivo: ${file}`);
      console.error(`   Ruta: ${filePath}`);
      console.error(`   Error: ${error.message}`);
      
      // Mostrar contexto del error
      if (error.message.includes('position')) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const content = await fs.readFile(filePath, 'utf-8');
          const start = Math.max(0, position - 100);
          const end = Math.min(content.length, position + 100);
          console.error(`\n   Contexto (posición ${position}):`);
          console.error(`   "${content.substring(start, end)}"`);
          console.error(`   ${' '.repeat(Math.min(100, position - start))}^`);
        }
      }
      
      throw new Error(`Archivo JSON inválido: ${file}`);
    }
  }
  
  return results;
}

/**
 * Guarda el archivo JSON procesado
 * @param {string} filePath - Ruta donde guardar
 * @param {Array} data - Datos a guardar
 */
async function saveJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Genera variaciones de traducciones basadas en códigos BCP-47
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
 * Procesa todos los archivos de un directorio
 */
async function processDirectory(dirPath, variations) {
  console.log(`\n📂 Procesando directorio: ${dirPath}`);
  
  const files = await loadJSONFiles(dirPath);
  console.log(`✅ Encontrados ${files.length} archivos JSON`);
  
  const results = [];
  
  for (const file of files) {
    console.log(`\n🔄 Procesando: ${file.filename}`);
    console.log(`   Traducciones originales: ${file.data.length}`);
    
    const expanded = expandTranslations(file.data, variations);
    console.log(`   Traducciones expandidas: ${expanded.length}`);
    console.log(`   Nuevas variaciones: ${expanded.length - file.data.length}`);
    
    // Sobrescribir archivo original
    await saveJSON(file.path, expanded);
    console.log(`   ✅ Archivo actualizado: ${file.path}`);
    
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
 * Función principal
 */
async function main() {
  try {
    console.log('🚀 Iniciando procesamiento de traducciones...\n');
    
    // Cargar variaciones
    const variationsPath = './variations.json';
    const variationsContent = await fs.readFile(variationsPath, 'utf-8');
    const variations = JSON.parse(variationsContent);
    console.log('✅ Variaciones cargadas correctamente');
    
    // Procesar subjects (sobrescribe originales)
    const subjectsResults = await processDirectory('./subjects', variations);
    
    // Procesar templates (sobrescribe originales)
    const templatesResults = await processDirectory('./templates', variations);
    
    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN FINAL');
    console.log('='.repeat(60));
    
    console.log('\n📁 SUBJECTS:');
    subjectsResults.forEach(r => {
      console.log(`   ${r.filename}: ${r.original} → ${r.expanded} (+${r.added})`);
    });
    
    console.log('\n📁 TEMPLATES:');
    templatesResults.forEach(r => {
      console.log(`   ${r.filename}: ${r.original} → ${r.expanded} (+${r.added})`);
    });
    
    const totalAdded = [...subjectsResults, ...templatesResults]
      .reduce((sum, r) => sum + r.added, 0);
    
    console.log('\n' + '='.repeat(60));
    console.log(`✨ Total de variaciones agregadas: ${totalAdded}`);
    console.log(`📝 Archivos sobrescritos con éxito`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    console.error('\n💡 Sugerencias:');
    console.error('   1. Revisa el archivo indicado arriba');
    console.error('   2. Busca comas faltantes o sobrantes');
    console.error('   3. Verifica que todos los strings tengan comillas cerradas');
    console.error('   4. Usa un validador JSON online: https://jsonlint.com/');
    process.exit(1);
  }
}

main();