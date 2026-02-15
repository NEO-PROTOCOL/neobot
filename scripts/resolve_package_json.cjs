
const fs = require('fs');
const path = require('path');

function findPackageJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (e) {
      console.warn(`Skipping ${filePath}: ${e.message}`);
      return;
    }
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        findPackageJsonFiles(filePath, fileList);
      }
    } else {
      if (file === 'package.json') {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

const files = findPackageJsonFiles('.');

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('<<<<<<< HEAD')) {
      console.log(`Fixing conflict in ${file}`);
      
      // Pattern: HEAD has version, Upstream has version + description (optional)
      // Goal: Keep Upstream version, Remove Upstream description (to avoid duplicate with local), Remove markers
      
      // Regex explanation:
      // <<<<<<< HEAD
      //   "version": "...",
      // =======
      //   "version": "...",
      //   "description": "...", (optional)
      // >>>>>>> upstream/main
      
      // We want to extract the upstream version.
      
      const regex = /<<<<<<< HEAD\s+^\s*"version":\s*"([^"]+)",\s+=======\s+^\s*"version":\s*"([^"]+)",(?:\s+^\s*"description":\s*"[^"]+",)?\s+>>>>>>> upstream\/main/ms;
      
      // Usage of 'm' flag for multiline anchors (though we use \s+ mostly), 's' for dot matching newlines (not used here but good practice).
      // Actually we are matching strict structure.
      
      content = content.replace(regex, (match, localVer, upstreamVer) => {
        console.log(`  Updating version: ${localVer} -> ${upstreamVer}`);
        // Return just the version line with correct indentation (assuming 2 spaces)
        return `  "version": "${upstreamVer}",`;
      });
      
      // Check if there are other conflict patterns (e.g. just version without description in upstream)
      // The regex above handles optional description.
      
      // Validate JSON if possible, but the regex might leave trailing commas if not careful?
      // The original had comma after version. We return comma after version.
      // If subsequent lines were just `  "type": "module"`, it's fine.
      
      if (content.includes('<<<<<<< HEAD')) {
        console.warn(`  WARNING: Unresolved conflicts remain in ${file}`);
      } else {
        fs.writeFileSync(file, content);
        console.log(`  Fixed ${file}`);
      }
    }
  }
});
