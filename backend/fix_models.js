const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

for (const file of files) {
  if (file.endsWith('.js')) {
    const filePath = path.join(modelsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the botched replacement: mongoose.models.Brand || mongoose.model('', BrandSchema);
    // Find mongoose.models.([^ ]+) \|\| mongoose.model\('', (\w+)\);
    const badRegex = /module\.exports = mongoose\.models\.(\w+) \|\| mongoose\.model\('([^']*)', (\w+)\);/g;
    
    content = content.replace(badRegex, "module.exports = mongoose.models.$1 || mongoose.model('$1', $3);");
    
    // Just in case some were not affected but still original
    const oldRegex = /module\.exports = mongoose\.model\('([^']+)', (\w+)\);/g;
    content = content.replace(oldRegex, "module.exports = mongoose.models.$1 || mongoose.model('$1', $2);");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
