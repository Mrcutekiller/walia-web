const fs = require('fs');

function keepHead(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to match conflict blocks:
    // <<<<<<< HEAD\n(keep this)\n=======\n(discard this)\n>>>>>>> [id]\n
    // Using [\s\S] to match across newlines
    const conflictRegex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>>[^\r\n]*\r?\n?/g;

    if (conflictRegex.test(content)) {
        content = content.replace(conflictRegex, '$1');
        fs.writeFileSync(filePath, content);
        console.log(`Resolved: ${filePath}`);
    }
}

const files = [
    'web/app/layout.tsx',
    'web/app/login/page.tsx',
    'web/app/page.tsx',
    'web/app/signup/page.tsx',
    'web/components/DashboardShell.tsx',
    'web/components/ReviewForm.tsx',
    'web/context/AuthContext.tsx',
    'web/lib/firebase.ts',
    'web/lib/utils.ts'
];

files.forEach(f => keepHead(f));
