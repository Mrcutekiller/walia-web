const fs = require('fs');

if (fs.existsSync('.env')) {
    fs.unlinkSync('.env');
}

const file = 'services/ai.ts';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/AIzaSyDHjN8cQ1943ib8YUzpjfWu1JqwamlzRKk/g, "REDACTED");
    content = content.replace(/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/g, "REDACTED");
    content = content.replace(/sk-eb738d76c19d4affa38e7a87513fe52b/g, "REDACTED");

    // Also check if process.env.EXPO_PUBLIC... strings are present and correct any broken quoted variables.
    fs.writeFileSync(file, content);
}
