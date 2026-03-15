const fs = require('fs');
const path = require('path');

const routesToMove = ['messages', 'profile', 'tools', 'community', 'calendar', 'settings', 'upgrade'];

routesToMove.forEach(route => {
    const srcPath = path.join(__dirname, 'app', route, 'page.tsx');
    const destDir = path.join(__dirname, 'app', 'dashboard', route);
    const destPath = path.join(destDir, 'page.tsx');

    if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf8');

        // Replace <DashboardShell> with <> and </DashboardShell> with </>
        content = content.replace(/<DashboardShell>/g, '<>');
        content = content.replace(/<\/DashboardShell>/g, '</>');

        // Also remove import DashboardShell from '@/components/DashboardShell';
        content = content.replace(/import DashboardShell from ['"]@\/components\/DashboardShell['"];\r?\n?/g, '');

        // Ensure destination directory exists
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.writeFileSync(destPath, content);
        console.log(`Migrated ${route}`);
    } else {
        console.log(`Skip ${route}, not found`);
    }
});
