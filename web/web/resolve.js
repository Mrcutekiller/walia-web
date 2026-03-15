const fs = require('fs');
const glob = require('glob');

function resolveConflictsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('<<<<<<< HEAD')) return false;

    const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [^\r\n]+\r?\n/g;
    const newContent = content.replace(regex, '$1');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('Resolved conflicts in ' + filePath);
        return true;
    }
    return false;
}

const files = glob.sync('**/*.{ts,tsx}', { ignore: ['node_modules/**', '.next/**'] });
let count = 0;
files.forEach(f => {
    if (resolveConflictsInFile(f)) count++;
});
console.log('Done resolving. Files updated: ' + count);
